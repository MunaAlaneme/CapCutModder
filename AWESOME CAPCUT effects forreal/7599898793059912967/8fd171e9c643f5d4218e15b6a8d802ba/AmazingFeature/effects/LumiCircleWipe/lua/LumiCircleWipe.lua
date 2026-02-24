---@class LumiCircleWipe : ScriptComponent
---@field radiusMode string [UI(Option={"Auto", "Fixed"})]
---@field progress number [UI(Range={0, 1}, Drag)]
---@field radius number [UI(Range={0, 1280}, Drag)]
---@field center Vector2f
---@field feather number [UI(Range={0, 1}, Drag)]
---@field reverse boolean
---@field InputTex Texture
---@field OutputTex Texture
local exports = exports or {}
local LumiCircleWipe = LumiCircleWipe or {}
LumiCircleWipe.__index = LumiCircleWipe

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

function LumiCircleWipe.new(construct, ...)
    local self = setmetatable({}, LumiCircleWipe)

    self.__lumi_type = "lumi_obj"
    self.__lumi_rt_pingpong_type = "custom"

    self.InputTex = nil
    self.OutputTex = nil

    self.progress = 0.0
    self.center = Amaz.Vector2f(0.5, 0.5)
    self.feather = 0.0
    self.reverse = false
    self.radius = 0.0
    self.radiusMode = "Auto"

    self.radiusMode_QUERY = {
        [0] = "Auto",
        "Fixed",
        ["Auto"] = 0,
        ["Fixed"] = 1
    }

    self.MAX_FEATHER = 300

    return self
end

function LumiCircleWipe:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _force)
        if _force or self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "radiusMode" then
        value = math.max(0, math.min(value, #self.radiusMode_QUERY))
        value = self.radiusMode_QUERY[value]
        _setEffectAttr(key, value)
    else
        _setEffectAttr(key, value)
    end
end

function LumiCircleWipe:onStart(comp)
    self.scene = comp.entity.scene
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name

    self.circleWipe = self.entity:searchEntity("circleWipe"):getComponent("MeshRenderer").material
    self.camera = self.entity:searchEntity("CameraCircleWipe"):getComponent("Camera")
end

function LumiCircleWipe:updateMaterial(comp, dt)
    if not self.OutputTex then
        return
    end

    local w = self.OutputTex.width
    local h = self.OutputTex.height
    local s = 720 / math.min(w, h)
    w = w * s
    h = h * s

    local center = Amaz.Vector2f(w * self.center.x, h * self.center.y)
    local feather = self.MAX_FEATHER * self.feather + 0.001
    local radius = self.getMaxRadius(w, h, center) + feather
    local progress = self.reverse and self.progress or (1 - self.progress)

    self.circleWipe:setTex("u_inputTex", self.InputTex)
    self.circleWipe:setVec2("u_screenSize", Amaz.Vector2f(w, h))
    self.circleWipe:setVec2("u_center", center)

    if self.radiusMode_QUERY[self.radiusMode] == 0 then
        self.circleWipe:setFloat("u_radius", radius * progress)
    else
        self.circleWipe:setFloat("u_radius", self.radius)
    end

    self.circleWipe:setFloat("u_feather", feather)
    self.circleWipe:setFloat("u_reverse", self.reverse and 1 or 0)
    self.camera.renderTexture = self.OutputTex
end

function LumiCircleWipe.getMaxRadius(w, h, center)
    local l1 = center:distance(Amaz.Vector2f(0, 0))
    local l2 = center:distance(Amaz.Vector2f(w, 0))
    local l3 = center:distance(Amaz.Vector2f(0, h))
    local l4 = center:distance(Amaz.Vector2f(w, h))
    return math.max(l1, l2, l3, l4)
end

exports.LumiCircleWipe = LumiCircleWipe
return exports
