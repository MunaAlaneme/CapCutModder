local exports = exports or {}
local CornerPinScript = CornerPinScript or {}
local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false

---@class CornerPinScript : ScriptComponent
---@field leftDownVertex Vector2f
---@field rightDownVertex Vector2f
---@field leftUpVertex Vector2f
---@field rightUpVertex Vector2f
---@field motionTileTypeStr string [UI(Option={"NORMAL", "MIRROR", "TILE"})]
---@field InputTex Texture
---@field OutputTex Texture
CornerPinScript.__index = CornerPinScript

function CornerPinScript.new()
    local self = {}
    setmetatable(self, CornerPinScript)
    self.leftDownVertex = Amaz.Vector2f(0, 0)
    self.rightDownVertex = Amaz.Vector2f(1, 0)
    self.leftUpVertex = Amaz.Vector2f(0, 1)
    self.rightUpVertex = Amaz.Vector2f(1, 1)
    self.InputTex = nil
    self.OutputTex = nil

    self.motionTile = 0
    self.motionTileTypeStr = "NORMAL"
    self.motionTileTypeDict = {
        ["NORMAL"] = 0,
        ["MIRROR"] = 1,
        ["TILE"] = 2,
    }

    return self
end

function CornerPinScript:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value)
        if self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "motionTileType" then
        local typeDict = {
            [0] = "NORMAL",
            [1] = "MIRROR",
            [2] = "TILE",
        }
        _setEffectAttr("motionTileTypeStr", typeDict[value])
    else
        _setEffectAttr(key, value)
    end
end

function CornerPinScript:onStart(comp)
    self.cornerPinMat = comp.entity:searchEntity("CornerPin"):getComponent("MeshRenderer").material
    self.outputCamera = comp.entity:searchEntity('Camera_CornerPin'):getComponent('Camera')
end

function CornerPinScript:onUpdate(comp, deltaTime)
    self.cornerPinMat:setTex("u_InputTex", self.InputTex)
    self.outputCamera.renderTexture = self.OutputTex

    self.cornerPinMat:setVec2("u_downLeftVertex", self.leftDownVertex)
    self.cornerPinMat:setVec2("u_downRightVertex", self.rightDownVertex)
    self.cornerPinMat:setVec2("u_upLeftVertex", self.leftUpVertex)
    self.cornerPinMat:setVec2("u_upRightVertex", self.rightUpVertex)

    self.cornerPinMat:setInt("u_motionTileType", self.motionTileTypeDict[self.motionTileTypeStr])
end

exports.CornerPinScript = CornerPinScript
return exports
