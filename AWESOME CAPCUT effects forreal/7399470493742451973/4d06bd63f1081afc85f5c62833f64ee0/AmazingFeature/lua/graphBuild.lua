local exports = exports or {}
local graphBuild = graphBuild or {}

---@class graphBuild : ScriptComponent
----@field inputTexture Texture  [UI(Type="Texture")]
----@field curTime Double [UI(Range={0, 3}, Slider)]
----@export "prefabs"

graphBuild.__index = graphBuild


local Utils = Utils or {}
function Utils.CreateRenderTexture(name, width, height, colorFormat, renderTextureType)
    local rt = nil
    if renderTextureType == "RenderTexture" then
        rt = Amaz.RenderTexture()
    elseif renderTextureType == "ScreenRenderTexture" then
        rt = Amaz.ScreenRenderTexture()
    end
    return rt
end


function Utils.split(s, p)
    local rt = {}
    string.gsub(
        s,
        "[^" .. p .. "]+",
        function(w)
            table.insert(rt, w)
        end
    )
    return rt
end

function Utils.buildRenderChain(self, comp)
    local colorFormat = Amaz.PixelFormat.RGBA8Unorm
    local RTCounter = self.RTCounter
    local link = self.renderChain.link
    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    -- init RTCounter
    RTCounter[1] = {}
    -- RTCounter[1].rt = comp.entity.scene:getOutputRenderTexture()
    RTCounter[1].rt = comp.entity.scene.assetMgr:SyncLoad("rt/outputTex.rt")
    RTCounter[1].width = w
    RTCounter[1].height = h
    for i = 1, #RTCounter do
        RTCounter[i].count = -1
    end
    Amaz.LOGI("RenderTex", "----------------------------------------------------------------------------")
    -- create renderTexture and link the node
    for i = 1, #link do
        if link[i].visible then
            -- search availableRT
            local availableRT = 0
            availableRT = #RTCounter + 1
            RTCounter[availableRT] = {}
            RTCounter[availableRT].rt =
                Utils.CreateRenderTexture(
                "__tmp_rt_" .. (availableRT - 1),
                link[i].outputSize.width,
                link[i].outputSize.height,
                colorFormat,
                link[i].renderTextureType
            )

            -- use the availableRT
            if link[i].RTShare then
                if not link[i].output then
                    RTCounter[availableRT].count = 0
                end
            else
                RTCounter[availableRT].count = 999
            end
            link[i].renderTextureIndex = availableRT
        end
    end

    -- reorder the output rendertexture and tmp rendertexture
    local lastIndex = 1
    for i = #link, 1, -1 do
        if link[i].visible then
            lastIndex = link[i].renderTextureIndex
            break
        end
    end
    for i = 1, #link do
        if link[i].visible then
            if link[i].renderTextureIndex == lastIndex then
                link[i].renderTextureIndex = 1
            end
        end
    end
    Amaz.LOGI("RenderTex", "----------------------------------------------------------------------------")
    -- set the output rt of xshader
    for i = 1, #link do
        if link[i].visible then
            local availableRT = link[i].renderTextureIndex
            link[i].material.xshader.passes:get(0).renderTexture = RTCounter[availableRT].rt
        end
    end

    -- set the input rt of material
    for i = 1, #link do
        if link[i].visible then
            local material = link[i].material
            if link[i].input then
                for k, v in pairs(link[i].input) do
                    if v == "INPUT0" then
                        material:setTex(k, self.inputTexture)
                    else
                        for j = i - 1, 1, -1 do
                            if link[j].visible and link[j].entityName == v then
                                material:setTex(k, RTCounter[link[j].renderTextureIndex].rt)
                            end
                        end
                    end
                end
            end
        end
    end
end



function graphBuild.new(construct, ...)
    local o = setmetatable({}, graphBuild)
    -- o.renderChain = includeRelativePath("renderChain.lua")
    o.curTime = 0
    o.Utils = Utils
    o.RTCounter = {}
    o.entities = {}
    return o
end

function graphBuild:init(comp)
    local entities = comp.entity.scene.entities
    local link = self.renderChain.link
    local tmpLink = {}
    for i = 1, #link do
        if link[i].subLink then
            local subLink = link[i].subLink
            for j = 1, #subLink do
                for key, value in pairs(subLink[j].input) do
                    local splitResult =  self.Utils.split(value,'.')
                    if #splitResult == 2 and splitResult[1] == "subLinkInput" then
                        subLink[j].input[key] = link[i].subLinkInput[splitResult[2]]
                    end
                end
                table.insert(tmpLink,subLink[j])
            end
            for j = i + 1, #link do
                if link[j].input then
                    for key, value in pairs(link[j].input) do
                        if value == link[i].subLinkName then
                            link[j].input[key] = link[i].subLink[#link[i].subLink].entityName
                        end
                    end
                end
                if link[j].subLinkInput then
                    for key, value in pairs(link[j].subLinkInput) do
                        if value == link[i].subLinkName then
                            link[j].subLinkInput[key] = link[i].subLink[#link[i].subLink].entityName
                        end
                    end
                end
            end
        else
            table.insert(tmpLink,link[i])
        end
    end
    self.renderChain.link = tmpLink
    link = tmpLink
    local path = comp.entity.scene.assetMgr.rootDir
    --  remove all instantiated entities
    for i = 1, #self.entities do
        comp.entity.scene:removeEntity(self.entities[i])
    end
    self.entities = {}
    for i = 1, #link do
        -- local prefab = Amaz.PrefabManager.loadPrefab(path, path .. "prefabs/" .. link[i].entityName .. ".prefab")
        -- if not prefab then
        --     Amaz.LOGE("link", "can't find prefab:" .. link[i].entityName)
        -- end
        -- comp.entity.scene:addInstantiatedPrefab(prefab)
        local entity = comp.entity.scene:findEntityBy(link[i].entityName)
        if entity then
            entity.visible = link[i].visible
        end
        table.insert(self.entities, entity)
        local renderer =
            entity:getComponent("MeshRenderer") and entity:getComponent("MeshRenderer") or
            entity:getComponent("Sprite2DRenderer")
        if renderer then
            link[i].material = renderer.material
        else
            Amaz.LOGE("link", "can't find render:" .. link[i].entityName)
        end
    end
    self.Utils.buildRenderChain(self, comp)
    self.Utils.setMaterialProp(self, comp)
end

function graphBuild:onStart(comp, sys)
    local path = comp.entity.scene.assetMgr.rootDir
    self.jsonParser = cjson.new()
    -- local file = io.open(path .. "lua/renderChain.json", "r")
    local jsonRaw = [[
        {"link": [{"visible": true, "entityName": "srcMergeMatting", "input": {}, "materialProp": {}, "renderTextureType": "ScreenRenderTexture", "outputSize": {"width": 720, "height": 1280}, "RTShare": true}, {"visible": true, "entityName": "particles", "input": {"u_inputSrcMergeMatting": "srcMergeMatting"}, "materialProp": {}, "renderTextureType": "ScreenRenderTexture", "outputSize": {"width": 360, "height": 640}, "RTShare": true}], "isUseRTShare": true}
    ]]
    -- file:close()
    self.renderChain = cjson.decode(jsonRaw)
    self:init(comp)
end

function graphBuild:onUpdate(comp, detalTime)
    -- self.curTime = (self.curTime + detalTime) % 3.0
end

exports.graphBuild = graphBuild
return exports
