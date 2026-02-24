local data = {}

data.ae_durations = {
    ['LumiLayer_49-trs'] = {
        ['nodeDuration'] = {{0, 66.7}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 66.7}, },
        },
    },
}
data.rotx = 0.0
data.roty = 0.0
data.rotz = 0.0
data.orix = 0.0
data.oriy = 0.0
data.oriz = 0.0
local value = 0.0
local value2 = 0.0
local value3 = 0.0
local value4 = 0.0
local value5 = 0.0
local value6 = 0.0

local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiManager = LumiManager or {}
LumiManager.__index = LumiManager
---@class LumiManager : ScriptComponent
---@field lumiEffectRoot Transform
---@field start_render_layer int
---@field start_render_order int

function LumiManager.new(construct, ...)
    local self = setmetatable({}, LumiManager)
    self.lumiEffectRoot = nil
    self.InputTex = nil
    self.rotx = 0
    self.roty = 0
    self.rotz = 0
    self.orix = 0
    self.oriy = 0
    self.oriz = 0
    return self
end

function LumiManager:onEvent(comp, event)
    if self.lumi_obj == nil then
        self:registerLumiObj(self.lumiEffectRoot, 1)
        self:updateCameraLayerAndOrder()
    end

    if self.lumi_obj == nil then
        Amaz.LOGE(AE_EFFECT_TAG, 'Failed to find lumi_obj')
        return
    end

    if event.args:get(0) == 'effects_adjust_speed' then
        value = event.args:get(1)
    elseif event.args:get(0) == 'effects_adjust_speed2' then
        value2 = event.args:get(1)
    elseif event.args:get(0) == 'effects_adjust_speed3' then
        value3 = event.args:get(1)
    elseif event.args:get(0) == 'effects_adjust_speed4' then
        value4 = event.args:get(1)
    elseif event.args:get(0) == 'effects_adjust_speed5' then
        value5 = event.args:get(1)
    elseif event.args:get(0) == 'effects_adjust_speed6' then
        value6 = event.args:get(1)
    end

    if self.lumi_params_setter and self.lumi_params_setter.onEvent then
        self.lumi_params_setter:onEvent(self.lumi_obj, event)
    end
end
function LumiManager:onStart()
    self.lumi_obj_extension = includeRelativePath("LumiObjectExtension")
    self.LumiParamsSetter = includeRelativePath("LumiParamsSetter")
    self.durations = data.ae_durations
    if self.LumiParamsSetter then
        self.lumi_params_setter = self.LumiParamsSetter.new(
            self,
            {
                ['LumiLayer_49-trs'] = {
                    ['hasBlend'] = false,
                    ['hasMatte'] = false,
                    ['hasTransform'] = true,
                    ['layerType'] = 'Precomp',
                    ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
                    ['position'] = Amaz.Vector3f(540, 540, 0),
                    ['scale'] = Amaz.Vector3f(100, 100, 100),
                    ['orientation'] = Amaz.Vector3f(value4*360.0, value5*360.0, value6*360.0),
                    ['xRotation'] = value*360.0,
                    ['yRotation'] = value2*360.0,
                    ['rotation'] = value3*360.0,
                    ['opacity'] = 100,
                    ['active_cam_fovx'] = 45,
                    ['compositeSize'] = Amaz.Vector2f(1080, 1080),
                    ['layerSize'] = Amaz.Vector2f(1080, 1080),
                    ['mirrorEdge'] = false,
                },
            }
        )
    end
end

function LumiManager:registerLumiObj(_trans, _idx)
    if _trans == nil then return end
    local script_comp = _trans.entity:getComponent("ScriptComponent")
    if script_comp then
        local lua_obj = Amaz.ScriptUtils.getLuaObj(script_comp:getScript())
        if lua_obj then
            self.lumi_obj = self.lumi_obj_extension.register(_trans.entity)
        end
    end
end
function LumiManager:onUpdate(comp, deltaTime)
    self.lumi_obj_extension = includeRelativePath("LumiObjectExtension")
    self.LumiParamsSetter = includeRelativePath("LumiParamsSetter")
    self.durations = data.ae_durations
    if self.LumiParamsSetter then
        self.lumi_params_setter = self.LumiParamsSetter.new(
            self,
            {
                ['LumiLayer_49-trs'] = {
                    ['hasBlend'] = false,
                    ['hasMatte'] = false,
                    ['hasTransform'] = true,
                    ['layerType'] = 'Precomp',
                    ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
                    ['position'] = Amaz.Vector3f(540, 540, 0),
                    ['scale'] = Amaz.Vector3f(100, 100, 100),
                    ['orientation'] = Amaz.Vector3f(value4*360.0, value5*360.0, value6*360.0),
                    ['xRotation'] = value*360.0,
                    ['yRotation'] = value2*360.0,
                    ['rotation'] = value3*360.0,
                    ['opacity'] = 100,
                    ['active_cam_fovx'] = 45,
                    ['compositeSize'] = Amaz.Vector2f(1080, 1080),
                    ['layerSize'] = Amaz.Vector2f(1080, 1080),
                    ['mirrorEdge'] = false,
                },
            }
        )
    end
    if self.lumi_obj == nil then
        self:registerLumiObj(self.lumiEffectRoot, 1)
        self:updateCameraLayerAndOrder()
    end

    for entityName, durationMap in pairs(self.durations) do
        if string.sub(entityName, 1, string.len('LumiLayer')) == 'LumiLayer' then
            self.lumi_obj:setSubEffectAttr(entityName, 'srcDuration', durationMap['texDuration']['InputTex'])
        end
    end

    if self.lumi_obj then
        self.lumi_obj:setEffectAttrRecursively("aeTime", 0)
    end

    if self.lumi_params_setter and self.lumi_params_setter.initParams then
        self.lumi_params_setter:initParams(self.lumi_obj)
    end
end

exports.LumiManager = LumiManager
return exports