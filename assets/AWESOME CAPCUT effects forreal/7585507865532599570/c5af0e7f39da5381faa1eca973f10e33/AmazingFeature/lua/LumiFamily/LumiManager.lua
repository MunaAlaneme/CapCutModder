local data = {}
local value1 = 50
local value2 = 1
local value3 = 90
local value4 = 1
local value5 = 0
local value6 = 0
local value7 = 0
local value8 = 0
data.ae_durations = {
    ['LumiLayer_88-blend'] = {
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_86-blend'] = {
        ['nodeDuration'] = {{0, 0}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    }
}

local ae_keyframes = {
    ['LumiPageTurn_86-effect0#inFoldPosition#vector'] =
{
	{
		{0, 80, 80, 80,}, 
		{-51, 0.5, }, 
		{{-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, {-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
}
data.ae_keyframes = ae_keyframes

local exports = exports or {}
local LumiManager = LumiManager or {}
LumiManager.__index = LumiManager

function LumiManager.new(construct, ...)
    local self = setmetatable({}, LumiManager)
    self.curTime = 0.0

    -- for XT
    self.lastCycle = -1

    return self
end

function LumiManager:getKeyframeAeTime(aeTime)
    return aeTime
end

function LumiManager:registerLumiObj(_trans, _idx)
    self.lumi_obj = self.lumi_obj_extension.register(_trans.entity)
end


function LumiManager:updateCameraLayerAndOrder()
    local cur_start_layer, cur_start_order = self.lumi_obj:updateCameraLayerAndOrder(self.start_render_layer, self.start_render_order)
end

function LumiManager:onUpdate(comp, deltaTime)
    data.ae_attribute = {
        ['LumiHalftone_88-effect0'] = {
            ['colorMode'] = value2,
            ['blackDots'] = false,
            ['dotFreq'] = value1,
            ['rotationAngle'] = value3,
            ['dotsRelativeWidth'] = value4,
            ['dotsSharpen'] = 1,
            ['dotsLighten'] = 0,
            ['color1'] = Amaz.Color(1, 1, 1, 1),
            ['color2'] = Amaz.Color(0, 0, 0, 1),
            ['dotsShift'] = Amaz.Vector2f(value5, value6),
            ['alternateShift'] = Amaz.Vector2f(value7, value8),
            ['redOffsetX'] = 0,
            ['redOffsetY'] = 0.25,
            ['greenOffsetX'] = 0,
            ['greenOffsetY'] = 0,
            ['blueOffsetX'] = 0,
            ['blueOffsetY'] = -0.25,
            ['smoothFactor'] = 0,
            ['useRings'] = false,
            ['ringThickness'] = 0.5,
            ['ringCount'] = 6,
            ['ringPhase'] = 1,
            ['quality'] = 0.5,
            ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
        },
        ['LumiLayer_88-blend'] = {
            ['hasBlend'] = true,
            ['hasMatte'] = false,
            ['hasTransform'] = false,
            ['layerType'] = 'Precomp',
            ['blendMode'] = 0,
        },
        ['LumiLayer_86-blend'] = {
            ['hasBlend'] = true,
            ['hasMatte'] = false,
            ['hasTransform'] = false,
            ['layerType'] = 'Precomp',
            ['blendMode'] = 0,
        },
    }
    self.lumi_obj_extension = includeRelativePath("LumiObjectExtension")
    self.LumiParamsSetter = includeRelativePath("LumiParamsSetter")
    local ae_tools = includeRelativePath("AETools")
    self.keyframes = ae_tools.new(data.ae_keyframes)
    self.durations = data.ae_durations
    self.params = data.ae_attribute
    self.lumi_params_setter = self.LumiParamsSetter.new(
        self,
        self.params,
        self.keyframes
    )
    if self.lumi_obj == nil then
        self:registerLumiObj(self.lumiEffectRoot, 1)
        self:updateCameraLayerAndOrder()
    end

    for entityName, durationMap in pairs(self.durations) do
        local texDuration = durationMap['texDuration']
        local srcDuration = texDuration['InputTex']
        local baseDuration = texDuration['baseTex']
        self.lumi_obj:setSubEffectAttr(entityName, 'srcDuration', srcDuration)
        self.lumi_obj:setSubEffectAttr(entityName, 'baseDuration', baseDuration)
    end
    self.isSetDuration = true

    local w = Amaz.BuiltinObject.getInputTextureWidth()
    local h = Amaz.BuiltinObject.getInputTextureHeight()
    if self.InputTex then
        w = self.InputTex.width
        h = self.InputTex.height
    end
    if self.width == nil or self.width ~= w or self.height == nil or self.height ~= h then
        self.width = w
        self.height = h
        self:updateOutputRtSize()
    end

    self.lumi_obj:setEffectAttrRecursively("curTime", self.curTime)
    self.lumi_obj:setEffectAttrRecursively("aeTime", self.curTime)
    self.lumi_params_setter:initParams(self.lumi_obj)
    self.lumi_params_setter:updateKeyFrameData(self.lumi_obj, self.curTime)
end

-- function LumiManager:onLateUpdate(comp, deltaTime)
-- collectgarbage("collect")
-- end

function LumiManager:onEvent(comp, event)
    if event.args:get(0) == 'effects_adjust_speed' then
        value1 = event.args:get(1)*100.0
    end
    if event.args:get(0) == 'effects_adjust_speed2' then
        value2 = event.args:get(1)*2.0
    end
    if event.args:get(0) == 'effects_adjust_speed3' then
        value3 = (event.args:get(1)*720.0)-360.0
    end
    if event.args:get(0) == 'effects_adjust_speed4' then
        value4 = event.args:get(1)*10.0
    end
    if event.args:get(0) == 'effects_adjust_speed5' then
        value5 = (event.args:get(1)*200.0)-100.0
    end
    if event.args:get(0) == 'effects_adjust_speed6' then
        value6 = (event.args:get(1)*200.0)-100.0
    end
    if event.args:get(0) == 'effects_adjust_speed7' then
        value7 = (event.args:get(1)*200.0)-100.0
    end
    if event.args:get(0) == 'effects_adjust_speed8' then
        value8 = (event.args:get(1)*200.0)-100.0
    end

    if self.lumi_params_setter and self.lumi_params_setter.onEvent then
        self.lumi_params_setter:onEvent(self.lumi_obj, event)
    end
end

exports.LumiManager = LumiManager
return exports
