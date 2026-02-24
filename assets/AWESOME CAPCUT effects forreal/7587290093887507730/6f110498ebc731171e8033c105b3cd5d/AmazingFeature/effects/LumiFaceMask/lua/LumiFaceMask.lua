local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiFaceMask = LumiFaceMask or {}
LumiFaceMask.__index = LumiFaceMask
---@class LumiFaceMask : ScriptComponent
---@field faceMode string [UI(Option={"Video", "Image", "ImageSlow"})]
---@field faceDetectInterval int [UI(Range={1, 24})]
---@field faceSmoothLevel number [UI(Range={0.1, 1.0}, Drag)]
---@field maskType string [UI(Option={"L", "R", "G", "B", "A"})]
---@field reverseTaking boolean
---@field InputTex Texture
---@field maskImageTex Texture
---@field OutputTex Texture
---@field lumiSharedRt Vector [UI(Type="Texture")]

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
    if rt == nil or width <= 0 or height <= 0 then return end
    if rt.width ~= width or rt.height ~= height then
        rt.width = width
        rt.height = height
    end
end

function LumiFaceMask.new(construct, ...)
    local self = setmetatable({}, LumiFaceMask)

    self.__lumi_type = "lumi_obj"
    self.__lumi_rt_pingpong_type = "custom"

    self.InputTex = nil
    self.OutputTex = nil
    self.maskType = "G"

    self.MODE_QUERY = {
        "L",
        "R",
        "G",
        "B",
        "A",
        ["L"] = 0,
        ["R"] = 1,
        ["G"] = 2,
        ["B"] = 3,
        ["A"] = 4
    }
    self.faceMode = "Video"
    self.faceModeQuery = {["Video"] = 131072, ["Image"] = 262144}
    self.faceDetectInterval = 24
    self.faceSmoothLevel = 1.0
    return self
end

function LumiFaceMask:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _force)
        if _force or self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "maskType" then
        value = math.max(0, math.min(value, #self.MODE_QUERY))
        value = self.MODE_QUERY[value]
        _setEffectAttr(key, value)
    else
        _setEffectAttr(key, value)
    end
end

function LumiFaceMask:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name
    Amaz.LOGI(self.TAG, 'onStart')

    self.camera = self.entity:searchEntity("FaceMaskCamera"):getComponent(
                      "Camera")
    self.faceCamera = self.entity:searchEntity("FaceCamera"):getComponent(
                          "Camera")
    self.qingyanFace = self.entity:searchEntity("QingyanFace"):getComponent(
                           "MeshRenderer").material
    self.material = self.entity:searchEntity("FaceMaskPass"):getComponent(
                        "MeshRenderer").material

    if self.lumiSharedRt and self.lumiSharedRt:size() > 0 then
        self.faceTex = self.lumiSharedRt:get(0)
    end
end

function LumiFaceMask:onUpdate(comp, deltaTime)
    if self.faceTex then self.faceCamera.renderTexture = self.faceTex end
    if self.OutputTex then self.camera.renderTexture = self.OutputTex end

    local w, h = self.OutputTex.width, self.OutputTex.height
    updateTexSize(self.faceTex, w, h)

    self.qingyanFace:setTex("u_imageTexture", self.maskImageTex)

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    self.material:setInt("u_hasFace", faceCount)
    if faceCount == 0 then
        self.material:setTex("u_originalTex", self.InputTex)
    end

    local color
    if self.MODE_QUERY[self.maskType] == 0 then
        color = Amaz.Vector4f(1, 1, 1, 1)
    end
    if self.MODE_QUERY[self.maskType] == 1 then
        color = Amaz.Vector4f(1, 0, 0, 1)
    end
    if self.MODE_QUERY[self.maskType] == 2 then
        color = Amaz.Vector4f(0, 1, 0, 1)
    end
    if self.MODE_QUERY[self.maskType] == 3 then
        color = Amaz.Vector4f(0, 0, 1, 1)
    end
    if self.MODE_QUERY[self.maskType] == 4 then
        color = Amaz.Vector4f(0, 0, 0, 1)
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local graphName = self.entity.scene:getEffectName()
    local algoNodeName_face = (self.algoSlot == 0) and 'face_0' or 'face_1'
    if graphName == '' then graphName = "AE2Effect" end

    if result ~= nil then
        Amaz.Algorithm.setAlgorithmParamInt(graphName, algoNodeName_face,
                                            "face_detect_mode",
                                            self.faceModeQuery[self.faceMode])
        Amaz.Algorithm.setAlgorithmParamInt(graphName, algoNodeName_face,
                                            "face_detect_interval",
                                            self.faceDetectInterval)
        Amaz.Algorithm.setAlgorithmParamFloat(graphName, algoNodeName_face,
                                              "face_base_smooth_level",
                                              self.faceSmoothLevel)
    end

    self.qingyanFace:setVec4("u_backgroundColor", color)
    self.faceCamera.clearColor = Amaz.Color(color.x, color.y, color.z, color.w)

    self.material:setInt("u_maskType", self.MODE_QUERY[self.maskType])
    self.material:setFloat("u_reverseTaking", self.reverseTaking)
end

exports.LumiFaceMask = LumiFaceMask
return exports
