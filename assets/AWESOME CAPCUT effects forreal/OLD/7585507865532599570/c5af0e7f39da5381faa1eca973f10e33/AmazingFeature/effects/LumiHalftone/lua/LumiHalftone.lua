local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiHalftone = LumiHalftone or {}
LumiHalftone.__index = LumiHalftone
---@class LumiHalftone : ScriptComponent
---@field blackDots boolean
---@field colorMode string [UI(Option={"Grayscale", "RGB", "CMY"})]
---@field dotFreq number [UI(Range={0, 2000}, Drag)]
---@field rotationAngle number
---@field dotsRelativeWidth number [UI(Range={0.1, 100}, Drag)]
---@field dotsSharpen number
---@field dotsLighten number
---@field color1 Color [UI(NoAlpha)]
---@field color2 Color [UI(NoAlpha)]
---@field dotsShift Vector2f
---@field alternateShift Vector2f
---@field redOffsetX number
---@field redOffsetY number
---@field greenOffsetX number
---@field greenOffsetY number
---@field blueOffsetX number
---@field blueOffsetY number
---@field smoothFactor number [UI(Range={0, 100}, Drag)]
---@field quality number [UI(Range={0.1, 1}, Drag)]
---@field useRings boolean
---@field ringThickness number [UI(Range={0, 1.}, Drag)]
---@field ringCount number [UI(Range={0, 10}, Drag)]
---@field ringPhase number [UI(Range={0, 10}, Drag)]
---@field InputTex Texture
---@field OutputTex Texture

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

function LumiHalftone.new(construct, ...)
    local self = setmetatable({}, LumiHalftone)

    self.__lumi_type = "lumi_obj"
    self.__lumi_rt_pingpong_type = "custom"
    self.quality = 0.5
    self.angle = 0
    self.colorMode = "Grayscale"
    self.blackDots = true
    self.dotFreq = 10
    self.rotationAngle = 0
    self.dotsRelativeWidth = 1
    self.dotsSharpen = 0.1
    self.dotsLighten = 0.1
    self.color1 = Amaz.Color(0., 0., 0.)
    self.color2 = Amaz.Color(1., 1., 1.)
    self.dotsShift = Amaz.Vector2f(0, 0)
    self.alternateShift = Amaz.Vector2f(0, 0)
    self.redOffsetX = 0
    self.redOffsetY = 0
    self.greenOffsetX = 0
    self.greenOffsetY = 0
    self.blueOffsetX = 0
    self.blueOffsetY = 0
    self.smoothFactor = 1

    self.useRings = false
    self.ringThickness = 0.1
    self.ringCount = 1
    self.ringPhase = 0

    self.COLOR_MODE_QUERY = {
        [0] = "Grayscale",
        "CMY",
        "RGB",
        ["Grayscale"] = 0,
        ["CMY"] = 1,
        ["RGB"] = 2
    }

    self.InputTex = nil
    self.OutputTex = nil
    return self
end

function LumiHalftone:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _force)
        if _force or self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "colorMode" then
        value = math.max(0, math.min(value, #self.COLOR_MODE_QUERY))
        value = self.COLOR_MODE_QUERY[value]
        _setEffectAttr(key, value)
    else
        _setEffectAttr(key, value)
    end
end

function LumiHalftone:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name
    Amaz.LOGI(self.TAG, 'onStart')
    self.matBlurX = comp.entity:searchEntity("PassBlurX"):getComponent(
                        "MeshRenderer").material
    self.camBlurX = comp.entity:searchEntity("CameraBlurX"):getComponent(
                        "Camera")
    self.matBlurY = comp.entity:searchEntity("PassBlurY"):getComponent(
                        "MeshRenderer").material
    self.camBlurY = comp.entity:searchEntity("CameraBlurY"):getComponent(
                        "Camera")
    self.camHalftone = self.entity:searchEntity("CameraHalftone"):getComponent(
                           "Camera")
    self.matHalftone = self.entity:searchEntity("PassHalftone"):getComponent(
                           "MeshRenderer").material

    local w = self.OutputTex.width
    local h = self.OutputTex.height
    self.tmpTex = createRenderTexture(w, h)
    self.tmpTex2 = createRenderTexture(w, h)
end

function LumiHalftone:onUpdate(comp, deltaTime)
    local width = self.OutputTex.width * self.quality
    local height = self.OutputTex.height * self.quality
    updateTexSize(self.tmpTex, width, height)
    updateTexSize(self.tmpTex2, width, height)
    if self.tmpTex then self.camBlurX.renderTexture = self.tmpTex end
    if self.tmpTex2 then self.camBlurY.renderTexture = self.tmpTex2 end
    if self.OutputTex then self.camHalftone.renderTexture = self.OutputTex end

    local stride = self.smoothFactor
    local steps = self.smoothFactor > 0 and 20 or 1
    self.matBlurX:setTex("u_inputTex", self.InputTex)
    self.matBlurY:setTex("u_inputTex", self.tmpTex)
    self.matBlurX:setInt("u_steps", steps)
    self.matBlurX:setFloat("u_stride", stride)
    self.matBlurX:setFloat("u_angle", math.rad(self.angle))
    self.matBlurY:setInt("u_steps", steps)
    self.matBlurY:setFloat("u_stride", stride)
    self.matBlurY:setFloat("u_angle", math.rad(self.angle + 90))

    self.matHalftone:setTex("u_inputTexture", self.tmpTex2)
    self.matHalftone:setInt("u_colorMode", self.COLOR_MODE_QUERY[self.colorMode])
    self.matHalftone:setInt("u_blackDots", self.blackDots and 1 or 0)
    self.matHalftone:setFloat("u_dotFreq", math.max(self.dotFreq - 1, 1))
    self.matHalftone:setFloat("u_rotationAngle", self.rotationAngle)
    self.matHalftone:setFloat("u_dotsRelativeWidth",
                              math.max(self.dotsRelativeWidth, 0.1))

    local dotsSharpen = (1. - self.dotsSharpen)
    local dotsLighten = self.dotsLighten
    if self.blackDots then
        dotsLighten = dotsLighten + 0.1
    else
        dotsLighten = dotsLighten - 0.1
    end
    self.matHalftone:setFloat("u_dotsSharpen", dotsSharpen)
    self.matHalftone:setFloat("u_dotsLighten", dotsLighten)
    self.matHalftone:setVec3("u_color1", Amaz.Vector3f(self.color1.r,
                                                       self.color1.g,
                                                       self.color1.b))
    self.matHalftone:setVec3("u_color2", Amaz.Vector3f(self.color2.r,
                                                       self.color2.g,
                                                       self.color2.b))

    self.matHalftone:setVec2("u_dotsShift",
                             Amaz.Vector2f(self.dotsShift.x, self.dotsShift.y))
    self.matHalftone:setVec2("u_alternateShift", Amaz.Vector2f(
                                 self.alternateShift.x, self.alternateShift.y))
    self.matHalftone:setFloat("u_redOffsetX", self.redOffsetX)
    self.matHalftone:setFloat("u_redOffsetY", self.redOffsetY)
    self.matHalftone:setFloat("u_greenOffsetX", self.greenOffsetX)
    self.matHalftone:setFloat("u_greenOffsetY", self.greenOffsetY)
    self.matHalftone:setFloat("u_blueOffsetX", self.blueOffsetX)
    self.matHalftone:setFloat("u_blueOffsetY", self.blueOffsetY)

    self.matHalftone:setInt("u_useRings", self.useRings and 1 or 0)
    self.matHalftone:setFloat("u_ringThickness", self.ringThickness)
    self.matHalftone:setFloat("u_ringCount", self.ringCount)
    self.matHalftone:setFloat("u_ringPhase", self.ringPhase)

end

exports.LumiHalftone = LumiHalftone
return exports
