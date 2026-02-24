local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiDistort = LumiDistort or {}
LumiDistort.__index = LumiDistort
---@class LumiDistort : ScriptComponent
---@field amount double [UI(Range={-100.0, 100.0}, Drag)]
---@field blurLens number [UI(Range={0.0, 1000.0}, Drag)]
---@field stride number [UI(Range={0.01, 1.5}, Drag)]
---@field rotateWarpDir number [UI(Range={-360.0, 360.0}, Drag)]
---@field amountRelX number [UI(Range={0, 100.0}, Drag)]  
---@field amountRelY number [UI(Range={0, 100.0}, Drag)]
---@field wrapModeX int [UI(Range={0, 2}, Drag)]
---@field wrapModeY int [UI(Range={0, 2}, Drag)]
---@field fine boolean
---@field quality double [UI(Range={0.1, 1.0}, Drag)]
---@field InputTex Texture
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

function LumiDistort.new(construct, ...)
    local self = setmetatable({}, LumiDistort)

    self.__lumi_type = "lumi_obj"
    self.__lumi_rt_pingpong_type = "custom"

    self.amount = 1.
    self.blurLens = 0.

    self.rotateWarpDir = 0.

    self.amountRelX = 1
    self.amountRelY = 1

    self.wrapModeX = 2
    self.wrapModeY = 2
    self.fine = false
    self.quality = 0.5

    self.stride = 1.
    self.angle = 0

    self.InputTex = nil
    self.tmpTex = nil
    self.tmpTex2 = nil
    self.OutputTex = nil

    return self
end

function LumiDistort:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value)
        if self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    _setEffectAttr(key, value)
end

function LumiDistort:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name
    Amaz.LOGI(self.TAG, 'onStart')
    self.matLens = comp.entity:searchEntity("PassLens"):getComponent(
                       "MeshRenderer").material
    self.camLens = comp.entity:searchEntity("CameraLens"):getComponent("Camera")
    self.matBlurX = comp.entity:searchEntity("PassBlurX"):getComponent(
                        "MeshRenderer").material
    self.camBlurX = comp.entity:searchEntity("CameraBlurX"):getComponent(
                        "Camera")
    self.matBlurY = comp.entity:searchEntity("PassBlurY"):getComponent(
                        "MeshRenderer").material
    self.camBlurY = comp.entity:searchEntity("CameraBlurY"):getComponent(
                        "Camera")
    self.matBlurX2 = comp.entity:searchEntity("PassBlurX_2"):getComponent(
                         "MeshRenderer").material
    self.camBlurX2 = comp.entity:searchEntity("CameraBlurX_2"):getComponent(
                         "Camera")
    self.matBlurY2 = comp.entity:searchEntity("PassBlurY_2"):getComponent(
                         "MeshRenderer").material
    self.camBlurY2 = comp.entity:searchEntity("CameraBlurY_2"):getComponent(
                         "Camera")
    self.camDistort = self.entity:searchEntity("CameraDistort"):getComponent(
                          "Camera")
    self.matDistort = self.entity:searchEntity("PassDistort"):getComponent(
                          "MeshRenderer").material

    local w = self.OutputTex.width
    local h = self.OutputTex.height
    self.tmpTex = createRenderTexture(w, h)
    self.tmpTex2 = createRenderTexture(w, h)
end

function LumiDistort:onUpdate(comp, deltaTime)
    -- Tex Settings
    local width = self.OutputTex.width * self.quality
    local height = self.OutputTex.height * self.quality
    updateTexSize(self.tmpTex, width, height)
    updateTexSize(self.tmpTex2, width, height)

    if self.tmpTex then
        self.camLens.renderTexture = self.tmpTex
        self.camBlurY.renderTexture = self.tmpTex
        self.camBlurY2.renderTexture = self.tmpTex
    end

    if self.tmpTex2 then
        self.camBlurX.renderTexture = self.tmpTex2
        self.camBlurX2.renderTexture = self.tmpTex2
    end

    if self.OutputTex then self.camDistort.renderTexture = self.OutputTex end

    self.matLens:setTex("u_inputTex", self.InputTex)
    self.matBlurX:setTex("u_inputTex", self.tmpTex)
    self.matBlurY:setTex("u_inputTex", self.tmpTex2)
    self.matBlurX2:setTex("u_inputTex", self.tmpTex)
    self.matBlurY2:setTex("u_inputTex", self.tmpTex2)
    self.matDistort:setTex("u_source", self.InputTex)
    self.matDistort:setTex("u_lens", self.tmpTex)

    local steps = math.max(self.blurLens, 1)
    local stride = self.stride / 2

    self.matBlurX:setInt("u_steps", steps)
    self.matBlurX:setFloat("u_stride", stride)
    self.matBlurX:setFloat("u_angle", self.angle)
    self.matBlurY:setInt("u_steps", steps)
    self.matBlurY:setFloat("u_stride", stride)
    self.matBlurY:setFloat("u_angle", self.angle + 90)
    self.matBlurX2:setInt("u_steps", steps)
    self.matBlurX2:setFloat("u_stride", stride * 4)
    self.matBlurX2:setFloat("u_angle", self.angle)
    self.matBlurY2:setInt("u_steps", steps)
    self.matBlurY2:setFloat("u_stride", stride * 4)
    self.matBlurY2:setFloat("u_angle", self.angle + 90)

    local warpAmt = math.sqrt(math.abs(self.amount) * 18.18) *
                        (self.amount > 0 and 1 or -1)
    local relMult = 1.


end

exports.LumiDistort = LumiDistort
return exports
