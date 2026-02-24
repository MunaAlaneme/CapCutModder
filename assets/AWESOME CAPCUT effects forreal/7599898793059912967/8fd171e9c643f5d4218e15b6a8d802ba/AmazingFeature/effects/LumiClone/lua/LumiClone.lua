local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiClone = LumiClone or {}
LumiClone.__index = LumiClone
---@class LumiClone : ScriptComponent
---@field type number
---@field initialScale number
---@field center Vector2f
---@field count number
---@field distance number
---@field hueChange number
---@field initHue number
---@field angle number
---@field distribution number
---@field scale number
---@field rotation number
---@field startAlpha number
---@field endAlpha number
---@field startZ number
---@field endZ number
---@field reverseLayer number
---@field InputTex Texture
---@field OutputTex Texture
---@field mainImage Texture

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

local function createRenderTexture(width, height, filterMag, filterMin)
    local rt = Amaz.RenderTexture()
    rt.width = width
    rt.height = height
    rt.depth = 1
    rt.filterMag = filterMag or Amaz.FilterMode.LINEAR
    rt.filterMin = filterMin or Amaz.FilterMode.LINEAR
    rt.filterMipmap = Amaz.FilterMipmapMode.NONE
    rt.attachment = Amaz.RenderTextureAttachment.NONE
    return rt
end

local function updateTexSize(rt, width, height)
    if rt == nil or width <= 0 or height <= 0 then
        return
    end
    if rt.width ~= width or rt.height ~= height then
        rt.width = width
        rt.height = height
    end
end

function LumiClone.new(construct, ...)
    local self = setmetatable({}, LumiClone)

    self.__lumi_type = "lumi_obj"
    self.__lumi_rt_pingpong_type = "custom"

    self.count = 10
    self.distance = 50
    self.angle = 45
    self.distribution = 0
    self.scale = 1.
    self.rotation = 30
    self.startAlpha = 1
    self.endAlpha = 0.5
    self.startZ = 1
    self.endZ = 1
    self.reverseLayer = 1
    self.type = 0
    self.hueChange = 0
    self.initHue = 0

    self.InputTex = nil
    self.OutputTex = nil
    self.mainImage = nil

    self.initialScale = 1.0
    self.center = Amaz.Vector2f(0.5, 0.5)
    self.testVec2 = Amaz.Vector2f(0.0, 0.0)

    return self
end

function LumiClone:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value)
        self[_key] = _value
        if comp and comp.properties ~= nil then
            comp.properties:set(_key, _value)
        end
    end

    _setEffectAttr(key, value)
end

function LumiClone:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name

    -- Use entity instead of scene 
    self.camera = self.entity:searchEntity("BlitCamera"):getComponent("Camera")
    self.material = self.entity:searchEntity("BlitPass"):getComponent("MeshRenderer").material

end

local function calculateOriginalCoord(index, self)
    local count = math.max(math.min(math.floor(self.count + 0.5), 19), 0) + 1
    local angleStep = (count > 1) and (2.0 * math.pi / (count - 1)) or 0.0

    local offset
    if index == 1 then
        offset = Amaz.Vector2f(0.0, 0.0)
    else
        local currentAngle = math.rad(-self.angle) + angleStep * (index - 2)
        offset = Amaz.Vector2f(math.cos(currentAngle), math.sin(currentAngle)) * (self.distance / 100.0)
    end
    return offset
end

function LumiClone:onUpdate(comp, deltaTime)
    -- set the input and output textures to be displayed
    if self.OutputTex then
        self.camera.renderTexture = self.OutputTex
    end
    self.material:setTex("u_inputTexture", self.mainImage)
    self.material:setInt("u_count", self.count)
    self.material:setFloat("u_distance", self.distance / 100.0)
    self.material:setFloat("u_angle", self.angle)
    self.material:setFloat("u_distribution", self.distribution)
    self.material:setFloat("u_scale", self.scale/self.endZ)
    self.material:setFloat("u_rotation", self.rotation)
    self.material:setFloat("u_startAlpha", self.startAlpha)
    self.material:setFloat("u_hueChange", self.hueChange)
    self.material:setFloat("u_initHue", self.initHue)
    self.material:setFloat("u_initialScale", self.initialScale/self.startZ)

    local calCenter = Amaz.Vector2f((self.center.x + 1.0) * 0.5, self.center.y * 0.5)
    self.material:setVec2("u_center", calCenter)
    self.material:setFloat("u_endAlpha", self.endAlpha)

    self.material:setInt("u_reverseLayer", self.reverseLayer)
    self.material:setInt("u_type", self.type)

    local cloneList = {}
    local totalItems = (count == 0) and 1 or (count + 1)

    for i = 1, totalItems do
        local coord = calculateOriginalCoord(i, self)
        -- local coord = Amaz.Vector2f(0.0, 0.0)
        table.insert(cloneList, {
            index = i,
            coord = coord,
            color = nil
        })
    end

    table.sort(cloneList, function(a, b)
        return a.coord.y > b.coord.y
    end)

    local sortedIndices = Amaz.FloatVector()
    for i, v in ipairs(cloneList) do
        sortedIndices:pushBack(v.index)
    end

    self.material:setFloatVector("u_sortedIndices", sortedIndices)
    self.material:setInt("u_cloneCount", sortedIndices:size())

    if self.midTex then
        if self.midTex.width ~= self.OutputTex.width or self.midTex.height ~= self.OutputTex.height then
            self.midTex.width = self.OutputTex.width
            self.midTex.height = self.OutputTex.height
        end
    end
end

exports.LumiClone = LumiClone
return exports
