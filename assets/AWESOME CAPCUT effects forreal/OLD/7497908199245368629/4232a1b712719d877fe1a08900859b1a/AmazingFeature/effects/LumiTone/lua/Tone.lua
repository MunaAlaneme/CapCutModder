
local exports = exports or {}
local Tone = Tone or {}
Tone.__index = Tone

---@class Tone: ScriptComponent
---@field amount number
---@field whiteColor Color [UI(NoAlpha)]
---@field blackColor Color [UI(NoAlpha)]
---@field InputTex Texture
---@field OutputTex Texture

function Tone.new(construct, ...)
    local self = setmetatable({}, Tone)
    self.InputTex = nil
    self.OutputTex = nil
    self.startTime = 0.0
    self.endTime = 3.0
    self.width = 0
    self.height = 0
    self.progress = 0.0
    self.autoPlay = true
    self.curTime = 0.0
    self.amount = 1.0
    self.whiteColor = Amaz.Color(1., 1., 1.)
    self.blackColor = Amaz.Color(0., 0., 0.)
    if construct and Tone.constructor then Tone.constructor(self, ...) end
    return self
end

function Tone:constructor()
end

function Tone:onStart(comp)
    self:start(comp)
end

function Tone:start(comp)
    self.first = true
    self.PassToneMaterial = comp.entity:searchEntity("PassTone"):getComponent("MeshRenderer").material
    self.PassToneCamera = comp.entity:searchEntity("CameraTone"):getComponent("Camera")
end

function Tone:onUpdate(comp, deltaTime)
    self:seekToTime(comp, self.curTime - self.startTime)
end

function Tone:seekToTime(comp, time)
    if self.first == nil then
        self:start(comp)
    end
    self.PassToneCamera.renderTexture = self.OutputTex
    self.PassToneMaterial:setTex("u_albedo", self.InputTex)
    self.PassToneMaterial:setFloat("u_amount",self.amount)
    self.PassToneMaterial:setVec4("u_whiteColor", Amaz.Vector4f(self.whiteColor.r, self.whiteColor.g, self.whiteColor.b, 1.0))
    self.PassToneMaterial:setVec4("u_blackColor", Amaz.Vector4f(self.blackColor.r, self.blackColor.g, self.blackColor.b, 1.0))

end

exports.Tone = Tone
return exports
