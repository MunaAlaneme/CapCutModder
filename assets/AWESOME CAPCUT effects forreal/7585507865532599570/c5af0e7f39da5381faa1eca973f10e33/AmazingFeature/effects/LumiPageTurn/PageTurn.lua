local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local PageTurn = PageTurn or {}
PageTurn.__index = PageTurn
---@class PageTurn : ScriptComponent
---@field inCornerPosition Vector2f
---@field inFoldPosition Vector2f
---@field classicUi number [UI(Range={0, 1}, Slider)]
---@field inFoldDirection number [UI(Range={0, 360}, Slider)]
---@field renderFace int [UI(Range={0, 2}, Slider)]
---@field foldRadius number
---@field frontTex Texture
---@field InputTex Texture
---@field OutputTex Texture

function PageTurn.new(construct, ...)
    local self = setmetatable({}, PageTurn)
    self.startTime = 0.0
    self.endTime = 3.0
    self.width = 0
    self.height = 0
    self.curTime = 0.0

    self.inCornerPosition = Amaz.Vector2f(1, 0)
    self.inFoldPosition = Amaz.Vector2f(0.5, 0.5)
    self.inFoldDirection = 0
    self.foldRadius = 0

    --[[
        classicUi for another type
        aligned ae type
    ]]
    self.classicUi = 0
    self.renderFace = 0

    self.InputTex = nil
    self.OutputTex = nil
    self.frontTex = nil

    if construct and PageTurn.constructor then
        PageTurn.constructor(self, ...)
    end
    return self
end

function PageTurn:constructor()

end

function PageTurn:onStart(comp)
    self.pageTurnMat = comp.entity:searchEntity("_PageTurn"):getComponent("MeshRenderer").material
    self.pageTurnCam = comp.entity:searchEntity("CamPageTurn"):getComponent("Camera")
end

local function getLineFrom2Pts(p1, p2)
    local a = p1.y - p2.y;
    local b = p2.x - p1.x;
    local c = p1.x * p2.y - p1.y * p2.x;
    return Amaz.Vector3f(a, b, c)
end

local function symmetryPtByLine(pt, line)
    local a = line.x
    local b = line.y
    local c = line.z
    local x = ((b * b - a * a) * pt.x - 2. * a * (b * pt.y + c)) / (a * a + b * b);
    local y = ((a * a - b * b) * pt.y - 2. * b * (a * pt.x + c)) / (a * a + b * b);
    return Amaz.Vector2f(x, y);
end

function PageTurn:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _force)
        if _force or self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "classic_ui" then
        if value == 0 then -- "Classic UI"
            _setEffectAttr("classicUi", 1)
        else
            _setEffectAttr("classicUi", 0)
            if value == 1 then -- Top Left Corner
                _setEffectAttr("inCornerPosition", Amaz.Vector2f(0, 1))
            elseif value == 2 then -- "Top Right Corner"
                _setEffectAttr("inCornerPosition", Amaz.Vector2f(1, 1))
            elseif value == 3 then -- "Bottom Left Corner"
                _setEffectAttr("inCornerPosition", Amaz.Vector2f(0, 0))
            elseif value == 4 then -- "Bottom Right Corner"
                _setEffectAttr("inCornerPosition", Amaz.Vector2f(1, 0))
            end
        end
    elseif key == "frontTex" then
        _setEffectAttr(key, value, true)
    else
        _setEffectAttr(key, value)
    end
end

function PageTurn:onUpdate(comp, deltaTime)
    self.pageTurnCam.renderTexture = self.OutputTex

    local frontTex = self.frontTex
    if frontTex == nil then
        frontTex = self.InputTex
    end
    self.pageTurnMat:setTex("u_frontTex", frontTex)
    self.pageTurnMat:setTex("u_backTex", self.InputTex)

    local inCornerPosition = self.inCornerPosition
    local inFoldPosition = self.inFoldPosition

    if self.classicUi > 0.5 then
        local r = (self.inFoldDirection + 0.0000001) / 180 * math.pi
        inCornerPosition = Amaz.Vector2f(math.sin(r) < 0 and 1 or 0, math.cos(r) < 0 and 1 or 0)

        local rightDir = Amaz.Vector2f(1, 0)
        local rotPoint = Amaz.Vector2f(rightDir.x * math.cos(r) + rightDir.y * math.sin(r),
            -rightDir.x * math.sin(r) + rightDir.y * math.cos(r))

        rotPoint = Amaz.Vector2f(rotPoint.x + self.inFoldPosition.x, rotPoint.y + self.inFoldPosition.y)

        local line = getLineFrom2Pts(rotPoint, self.inFoldPosition)

        inFoldPosition = symmetryPtByLine(inCornerPosition, line)
    end
    self.pageTurnMat:setFloat("u_classicUi", self.classicUi)

    self.pageTurnMat:setVec2("u_inCornerPosition", inCornerPosition)
    self.pageTurnMat:setVec2("u_inFoldPosition", inFoldPosition)
    self.pageTurnMat:setFloat("u_foldRadius", self.foldRadius)
    self.pageTurnMat:setInt("u_renderFace", self.renderFace)
end

exports.PageTurn = PageTurn
return exports
