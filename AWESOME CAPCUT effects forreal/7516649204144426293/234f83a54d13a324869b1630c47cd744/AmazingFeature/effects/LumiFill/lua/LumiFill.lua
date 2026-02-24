local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiFill = LumiFill or {}
LumiFill.__index = LumiFill
---@class LumiFill : ScriptComponent
---@field InputTex Texture
---@field OutputTex Texture
---@field color Color [UI(NoAlpha)]
---@field opacity double [UI(Range={0, 1}, Drag)]
---@field alpha double [UI(Range={0, 1}, Drag)]
---@field blendMode string [UI(Option={"Normal", "Multiply", "Add", "Screen"})]
---@field reverse Bool

local function getBlendType(blendMode)

    local blurdTypeTable = {
        ["Normal"] = 0, -- default
        ["Multiply"] = 1,
        ["Add"] = 2,
        ["Screen"] = 3

    }

    local flag = blurdTypeTable[blendMode]
    if flag == nil then
        flag = 0
    end
    return flag
end

function LumiFill:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _force)
        if _force or self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "blendMode" then
        local typeTable = {
            [0] = "Normal",
            [1] = "Multiply",
            [2] = "Add",
            [3] = "Screen"

        }
        local blendStyle = typeTable[value]
        if blendStyle == nil then
            blendStyle = "Normal"
        end
        _setEffectAttr(key, blendStyle, comp)

    else
        _setEffectAttr(key, value, comp)
    end
end

function LumiFill.new(construct, ...)
    local self = setmetatable({}, LumiFill)

    if construct and LumiFill.constructor then
        LumiFill.constructor(self, ...)
    end

    self.InputTex = nil
    self.OutputTex = nil

    self.color = Amaz.Color(1., 1., 1.)
    self.opacity = 1.0
    self.alpha = 1.0
    self.reverse = false
    self.blendMode = "Normal"

    return self
end

function LumiFill:constructor()
end

function LumiFill:onStart(comp)
    self.camera = comp.entity:searchEntity("BlitCamera"):getComponent("Camera")
    self.material = comp.entity:searchEntity("BlitPass"):getComponent("MeshRenderer").material
end

function LumiFill:onUpdate(comp, deltaTime)
    if self.OutputTex then
        self.camera.renderTexture = self.OutputTex
    end
    self.material:setTex("u_InputTexture", self.InputTex)
    self.material:setFloat('u_Opacity', self.opacity)
    self.material:setFloat('u_Alpha', self.alpha)
    self.material:setFloat('u_Reverse', self.reverse and 1 or 0)
    self.material:setVec3("u_Color", Amaz.Vector3f(self.color.r, self.color.g, self.color.b))

    local blendMode = getBlendType(self.blendMode)
    self.material:setInt("u_blendMode", blendMode)
end

exports.LumiFill = LumiFill
return exports
