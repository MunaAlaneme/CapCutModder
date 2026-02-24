local data = {}
local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiManager = LumiManager or {}
LumiManager.__index = LumiManager
---@class LumiManager : ScriptComponent
---@field debugTime number [UI(Range={0, 6}, Drag)]
---@field autoPlay boolean
---@field lumiEffectRoot Transform
---@field start_render_layer int
---@field start_render_order int

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

local EffectType = {
    Effect = 'effect',
    Transition = 'transition',
    EffectXT = 'xtEffect',
    FilterXT = 'xtFilter',
}

local AnimationMode = {
    Once = 0,
    Loop = 1,
    StretchOnce = 2,
    StretchLoop = 3,
}

local function clamp(val, min, max)
    return math.min(math.max(val, min), max)
end

local function remap(value, srcMin, srcMax, dstMin, dstMax)
    return dstMin + (value - srcMin) * (dstMax - dstMin) / (srcMax - srcMin)
end

local function handleAllEntityBySingleParent(_trans, func, ...)
    if _trans.children:size() > 0 then
        for i = 1, _trans.children:size() do
            local child = _trans.children:get(i-1)
            handleAllEntityBySingleParent(child, func, ...)
        end
    end
    func(_trans, ...)
end

local function intervalIntersection(intervals1, intervals2)
    local result = {}
    local i = 1
    local j = 1

    while i <= #intervals1 and j <= #intervals2 do
        local start1 = intervals1[i][1]
        local end1 = intervals1[i][2]
        local start2 = intervals2[j][1]
        local end2 = intervals2[j][2]

        local start = math.max(start1, start2)
        local end_ = math.min(end1, end2)

        if start <= end_ then
            table.insert(result, {start, end_})
        end
        if end1 < end2 then
            i = i + 1
        else
            j = j + 1
        end
    end
    return result
end
local value1 = 80
local value2 = 0
local value2a = false
local value3 = 0.5
local value4 = 0.5
local value5 = 1
local value5a = true

function LumiManager.new(construct, ...)
    local self = setmetatable({}, LumiManager)

    self.lumiEffectRoot = nil
    self.start_render_layer = 1
    self.start_render_order = 1

    self.speed = 1.0

    return self
end

function LumiManager:getKeyframeAeTime(aeTime)
    if self.isReverseKeyframes ~= true then
        return aeTime
    end
    return self.compDurations[1] + self.compDurations[2] - aeTime
end

function LumiManager:onDestroy(comp)
    if self.lumiEffectRoot and self.lumi_obj_extension then
        self.lumi_obj_extension.deregister(self.lumiEffectRoot.entity)
    end
    self.lumi_obj = nil
    self.LumiParamsSetter = nil
end

function LumiManager:getCameraCount()
    if self.lumiEffectRoot == nil then
        Amaz.LOGE(AE_EFFECT_TAG, 'Lumi Effect Root is nil, please check')
        return 0
    end

    self.lumi_obj = nil
    self:ReRender()

    local cam_count = 0
    if self.lumi_obj then
        cam_count = self.lumi_obj:getCameraCount()
        Amaz.LOGI(AE_EFFECT_TAG, self.lumi_obj.entity.name .. " camera_count: " .. tostring(cam_count))
    end
    return cam_count
end

function LumiManager:ReRender()
    if self.lumiEffectRoot == nil then
        Amaz.LOGE(AE_EFFECT_TAG, 'Lumi Effect Root is nil, please check')
        return
    end

    -- re register
    self.lumi_obj = nil
    self:registerLumiObj(self.lumiEffectRoot, 1)

    if self.lumi_obj == nil then
        Amaz.LOGE(AE_EFFECT_TAG, 'No lumi_obj register')
        return
    end

    -- change layer & order
    self:updateCameraLayerAndOrder()

    -- change rt pingpong
    self:updateRtPingpong()
end

function LumiManager:registerLumiObj(_trans, _idx)
    if _trans == nil then return end
    local script_comp = _trans.entity:getComponent("ScriptComponent")
    if script_comp then
        local lua_obj = Amaz.ScriptUtils.getLuaObj(script_comp:getScript())
        if lua_obj then
            self.lumi_obj_extension.deregister(_trans.entity)
            self.lumi_obj = self.lumi_obj_extension.register(_trans.entity)
        end
    end
end

local function _setLayer(_cam, _layer)
    local str = "1"
    for i = 1, _layer do
        str = str.."0"
    end
    local dynamic_bitset = Amaz.DynamicBitset.new(str)

    _cam.layerVisibleMask = dynamic_bitset
end

function LumiManager:updateCameraLayerAndOrder()
    if self.lumi_obj then
        local cur_start_layer, cur_start_order = self.lumi_obj:updateCameraLayerAndOrder(self.start_render_layer, self.start_render_order)

    end
end

function LumiManager:updateRtPingpong()
    if self.lumi_obj then
        self.lumi_obj:updateRt(self.InputTex, self.OutputTex, self.PingPongTex)
    end
end

function LumiManager:updateOutputRtSize()
    if self.lumi_obj then
        self.lumi_obj:updateOutputRtSize(self.width, self.height)
    end
end


function LumiManager:onUpdate(comp, deltaTime)
    data.ae_durations = {
        ['LumiLayer_317-trs'] = {
            ['nodeDuration'] = {{0, 9999999999}, },
            ['texDuration'] = {
                ['InputTex'] = {{0, 99999999999}, },
            },
        },
        ['LumiLayer_306-matte-blend'] = {
            ['nodeDuration'] = {{0, 99999999999999}, },
            ['texDuration'] = {
                ['InputTex'] = {{0, 9999999999}, },
                ['baseTex'] = {{0, 9999999999999}, },
                ['maskTex'] = {{0, 999999999999}, },
            },
        },
        ['LumiLayer_305-matte-blend'] = {
            ['nodeDuration'] = {{0, 999999999999}, },
            ['texDuration'] = {
                ['InputTex'] = {{222222220, 9999999999}, },
                ['baseTex'] = {{0, 9999999999}, },
                ['maskTex'] = {{0, 9999999999}, },
            },
        },
    }

    data.ae_attribute = {
        ['LumiOpticsCompensation_306-effect0'] = {
            ['fov'] = value1,
            ['inverseLensDistortion'] = value2a,
            ['fovOrientation'] = 20,
            ['center'] = Amaz.Vector2f(value3, value4),
            ['antiAliasing'] = false,
            ['fillBorders'] = value5,
        },
        ['LumiLayer_306-matte-blend'] = {
            ['hasBlend'] = true,
            ['hasMatte'] = false,
            ['hasTransform'] = true,
            ['layerType'] = 'Precomp',
            ['matteMode'] = 0,
            ['blendMode'] = 0,
        },
        ['LumiLayer_305-matte-blend'] = {
            ['hasBlend'] = true,
            ['hasMatte'] = true,
            ['hasTransform'] = false,
            ['layerType'] = 'Precomp',
            ['matteMode'] = 0,
            ['blendMode'] = 2,
        },
    }
    self.entity = comp.entity

    self.lumi_obj_extension = includeRelativePath("LumiObjectExtension")
    self.lumi_obj = nil

    self.durations = nil
    self.params = nil
    self.compDurations = {0, 6}

    self.LumiParamsSetter = includeRelativePath("LumiParamsSetter")
    if data then
        if data.ae_durations ~= nil then
            self.durations = data.ae_durations
        end
        if data.ae_attribute ~= nil then
            self.params = data.ae_attribute
        end
    end
    if self.LumiParamsSetter then
        self.lumi_params_setter = self.LumiParamsSetter.new(
            self,
            self.params
        )
    end
    if self.lumiEffectRoot == nil then
        Amaz.LOGE(AE_EFFECT_TAG, 'Lumi Effect Root is nil, please check')
        return
    end

    if self.lumi_obj == nil then
        self:registerLumiObj(self.lumiEffectRoot, 1)
        self:updateCameraLayerAndOrder()
    end

    if self.durations and not self.isSetDuration then
        for entityName, durationMap in pairs(self.durations) do
            local isLumiLayer = string.sub(entityName, 1, string.len('LumiLayer')) == 'LumiLayer'
            if isLumiLayer then
                local texDuration = durationMap['texDuration']
                local srcDuration = texDuration['InputTex']
                local baseDuration = texDuration['baseTex']
                local maskDuration = texDuration['maskTex']
                if srcDuration then
                    self.lumi_obj:setSubEffectAttr(entityName, 'srcDuration', srcDuration)
                end
                if baseDuration then
                    self.lumi_obj:setSubEffectAttr(entityName, 'baseDuration', baseDuration)
                end
                if maskDuration then
                    local matteDuration = intervalIntersection(maskDuration, srcDuration)
                    self.lumi_obj:setSubEffectAttr(entityName, 'matteDuration', matteDuration)
                end
            end
        end
        self.isSetDuration = true
    end

    local w = Amaz.BuiltinObject.getInputTextureWidth()
    local h = Amaz.BuiltinObject.getInputTextureHeight()
    if self.InputTex then
        w = self.InputTex.width
        h = self.InputTex.height
    end
    if self.OutputTex and (self.OutputTex.width ~= w or self.OutputTex.height ~= h) then
        Amaz.LOGE(AE_EFFECT_TAG, 'Invalid rt size, input: ' .. w .. 'x' .. h .. ', output: ' .. self.OutputTex.width .. 'x' .. self.OutputTex.height)
    end
    if self.width == nil or self.width ~= w or self.height == nil or self.height ~= h then
        self.width = w
        self.height = h
        self:updateOutputRtSize()
    end

    self.curTime = self.curTime + deltaTime
    if isEditor then
        self.curTime = self.curTime % self.endTime
    end
    local curTime = (self.curTime - self.startTime) * self.speed + self.startTime
    local startTime = self.startTime
    local endTime = (self.endTime - self.startTime) * self.speed + self.startTime

    if self.cameraMode then
        if self.animationMode ~= AnimationMode.Loop then
            Amaz.LOGE(AE_EFFECT_TAG, 'Camera mode is not support animationMode: ' .. tostring(self.animationMode))
            return
        end
        curTime = self.curTime - self.cameraStartTime
        endTime = math.huge
    elseif self.effectType == EffectType.EffectXT or self.effectType == EffectType.FilterXT then -- deprecated after 1810 in XT
        startTime = 0
    end
    
    local aeTime = curTime;
    if endTime < curTime then
        aeTime = math.max(self.compDurations[1], self.compDurations[2] - (self.endTime - self.curTime))
    else
        local aeDuration = math.max(0.001, self.compDurations[2] - self.compDurations[1])
        local lvDuration = math.max(0.001, endTime - startTime)
        if self.animationMode == AnimationMode.Once then
            aeTime = self.compDurations[1] + curTime - startTime
            aeTime = math.min(aeTime, self.compDurations[2])
        elseif self.animationMode == AnimationMode.Loop then
            if self.cameraMode then
                local cycle = math.floor((curTime - startTime) / aeDuration)
                if self.lastCycle ~= cycle then
                    self.lastCycle = cycle
                    comp.entity.scene:sendMessage(4999, 1, 0, '')
                end
            end
            if math.floor((curTime - startTime) / aeDuration) < 1 then
                aeTime = self.compDurations[1] + (curTime - startTime) % aeDuration
            else
                local curLoopStart = (self.loopStart - self.compDurations[1]) * self.speed + self.compDurations[1]
                aeTime = self.loopStart + (curTime - startTime - curLoopStart) % (aeDuration - self.loopStart)
            end
        elseif self.animationMode == AnimationMode.StretchOnce then
            aeTime = remap(curTime, startTime, self.endTime, self.compDurations[1], self.compDurations[2])
            aeTime = clamp(aeTime, self.compDurations[1], self.compDurations[2])
        elseif self.animationMode == AnimationMode.StretchLoop then
            local newCurTime = startTime + (curTime - startTime) * self.speed % lvDuration
            aeTime = remap(newCurTime, startTime, endTime, self.compDurations[1], self.compDurations[2])

            if math.floor((curTime - startTime) * self.speed / lvDuration) >= 1 then
                aeTime = self.compDurations[1] + (aeTime - self.compDurations[1]) % (self.compDurations[2] - self.loopStart) + self.loopStart
            end
        end
    end

    if isEditor then
        if self.autoPlay then
            self.debugTime = curTime % (self.compDurations[2]-self.compDurations[1]) + self.compDurations[1]
            aeTime = self.debugTime
        else
            aeTime = self.debugTime
        end
    end

    if self.lumi_obj then
        self.lumi_obj:setEffectAttrRecursively("startTime", self.startTime)
        self.lumi_obj:setEffectAttrRecursively("endTime", self.endTime)
        self.lumi_obj:setEffectAttrRecursively("curTime", self.curTime)
        self.lumi_obj:setEffectAttrRecursively("aeTime", aeTime)
    end

    if self.lumi_params_setter and self.lumi_params_setter.initParams then
        self.lumi_params_setter:initParams(self.lumi_obj)
    end
    if self.lumi_params_setter and self.lumi_params_setter.updateKeyFrameData then
        self.lumi_params_setter:updateKeyFrameData(self.lumi_obj, aeTime)
    end
    if self.lumi_params_setter and self.lumi_params_setter.updateSlider then
        self.lumi_params_setter:updateSlider(self.lumi_obj, aeTime)
    end
    if self.lumi_params_setter and self.lumi_params_setter.updateFade then
        if self.effectType == EffectType.Effect then
            self.lumi_params_setter:updateFade(self.lumi_obj, self.startTime, self.endTime, self.curTime, self.compDurations, aeTime)
        end
    end

    if self.lumi_obj and self.durations~= nil then
        aeTime = math.min(math.max(aeTime, self.compDurations[1]), self.compDurations[2])
        for entityName, durationMap in pairs(self.durations) do
            local nodeDuration = durationMap['nodeDuration']
            local visible = false
            for j = 1, #nodeDuration do
                if nodeDuration[j][1] <= aeTime and aeTime < nodeDuration[j][2] then
                    visible = true
                    break
                end
            end
            self.lumi_obj:setVisible(entityName, visible)
        end
    end
    if self.lumi_obj and self.lumi_obj.updateMaterials then
        self.lumi_obj:updateMaterials(deltaTime)
    end
end

-- function LumiManager:onLateUpdate(comp, deltaTime)
    -- collectgarbage("collect")
-- end

function LumiManager:onEvent(comp, event)
    if self.lumiEffectRoot == nil then
        Amaz.LOGE(AE_EFFECT_TAG, 'Lumi Effect Root is nil, please check')
        return
    end

    if self.lumi_obj == nil then
        self:registerLumiObj(self.lumiEffectRoot, 1)
        self:updateCameraLayerAndOrder()
    end

    if self.lumi_obj == nil then
        Amaz.LOGE(AE_EFFECT_TAG, 'Failed to find lumi_obj')
        return
    end

    if event.args:get(0) == 'effects_adjust_intensity' then
        value1 = event.args:get(1)*180.0
    elseif event.args:get(0) == 'effects_adjust_size' then
        value2 = event.args:get(1)
	if value2 < 0.5 then
	    value2a = false
	else
	    value2a = true
	end
    elseif event.args:get(0) == 'effects_adjust_intensity2' then
        value3 = event.args:get(1)
    elseif event.args:get(0) == 'effects_adjust_size2' then
        value4 = event.args:get(1)
    elseif event.args:get(0) == 'effects_adjust_intensity3' then
        value5 = event.args:get(1)
	if value5 < 0.5 then
	    value5a = false
	else
	    value5a = true
	end
    end

    if self.lumi_params_setter and self.lumi_params_setter.onEvent then
        self.lumi_params_setter:onEvent(self.lumi_obj, event)
    end
end

exports.LumiManager = LumiManager
return exports
