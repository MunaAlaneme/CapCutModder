local data = {}
local value1 = 90
local value2 = 0
local value3 = 0
local value4 = 0
local ae_compDurations = {0, 0}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'effect'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiLayer_28-trs'] = {
        ['nodeDuration'] = {{33313, 999999999}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 144444444444}, },
        },
    },
}
data.ae_durations = ae_durations

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
    VideoAnimation = 'videoAnimation',
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

function LumiManager.new(construct, ...)
    local self = setmetatable({}, LumiManager)

    self.lumiEffectRoot = nil
    self.start_render_layer = 1
    self.start_render_order = 1

    self.InputTex = nil
    self.OutputTex = nil
    self.PingPongTex = nil

    self.startTime = 0.0
    self.endTime = 6.0
    self.curTime = 0.0

    self.speed = 1.0
    self.animationMode = AnimationMode.Once
    self.autoPlay = true
    self.debugTime = 0.0

    -- for XT
    self.cameraStartTime = 0
    self.lastCycle = -1

    return self
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

function LumiManager:initVideoAnimationLua(comp)
    local modelEntity = comp.entity:searchEntity("model")
    if modelEntity then 
        local scriptComp = modelEntity:getComponent("ScriptComponent")
        if scriptComp then 
            self.videoAnimationLua = Amaz.ScriptUtils.getLuaObj(scriptComp:getScript())
        end
    end
end

function LumiManager:onUpdate(comp, deltaTime)
    data.ae_attribute = {
	['LumiLayer_28-trs'] = {
            ['hasBlend'] = false,
            ['hasMatte'] = false,
            ['hasTransform'] = true,
            ['layerType'] = 'Precomp',
            ['anchorPoint'] = Amaz.Vector3f(300, 300, 0),
            ['position'] = Amaz.Vector3f(300, 300, 0),
            ['scale'] = Amaz.Vector3f(100, 100, 100),
            ['orientation'] = Amaz.Vector3f(0, 0, 0),
            ['xRotation'] = 0,
            ['yRotation'] = 0,
            ['rotation'] = 0,
            ['opacity'] = 100,
            ['active_cam_fovx'] = value1,
            ['p0_anchorPoint'] = Amaz.Vector3f(300, 300, 0),
            ['p0_position'] = Amaz.Vector3f(300, 300, 0),
            ['p0_scale'] = Amaz.Vector3f(100, 100, 100),
            ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
            ['p0_xRotation'] = value2,
            ['p0_yRotation'] = value3,
            ['p0_rotation'] = value4,
            ['p0_opacity'] = 100,
            ['p0_active_cam_fovx'] = 90,
            ['compositeSize'] = Amaz.Vector2f(600, 600),
            ['layerSize'] = Amaz.Vector2f(600, 600),
            ['mirrorEdge'] = true,
	},
    }
    self.entity = comp.entity

    self.lumi_obj_extension = includeRelativePath("LumiObjectExtension")
    self.lumi_obj = nil

    self.durations = nil
    self.params = nil
    self.compDurations = {0, 6}
    self.animationInfos = 0
    self.sliderInfos = {}
    self.fadeinInfos = {}
    self.fadeoutInfos = {}
    self.effectType = "effect"
    self.transitionInputIndex = {}

    self.LumiParamsSetter = includeRelativePath("LumiParamsSetter")
    if data then
        if data.ae_durations ~= nil then
            self.durations = data.ae_durations
        end
        if data.ae_attribute ~= nil then
            self.params = data.ae_attribute
        end
        if data.ae_animationInfos ~= nil then
            self.animationInfos = data.ae_animationInfos
            self.animationMode = self.animationInfos.animationMode
            self.loopStart = self.animationInfos.loopStart
            self.speed = self.animationInfos.speedInfo[1]
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
                self.lumi_obj:setSubEffectAttr(entityName, 'srcDuration', srcDuration)
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
    end
    
    local aeTime = curTime;

    if self.lumi_obj then
        self.lumi_obj:setEffectAttrRecursively("startTime", self.startTime)
        self.lumi_obj:setEffectAttrRecursively("endTime", self.endTime)
        self.lumi_obj:setEffectAttrRecursively("curTime", self.curTime)
        self.lumi_obj:setEffectAttrRecursively("aeTime", aeTime)
    end

    if self.lumi_params_setter and self.lumi_params_setter.initParams then
        self.lumi_params_setter:initParams(self.lumi_obj)
    end
    if self.lumi_params_setter and self.lumi_params_setter.updateSlider then
        self.lumi_params_setter:updateSlider(self.lumi_obj, aeTime)
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

    if event.args:get(0) == 'effects_adjust_speed' then
        value1 = event.args:get(1)*180
    elseif event.args:get(0) == 'effects_adjust_texture' then
        value2 = event.args:get(1)*360
    elseif event.args:get(0) == 'effects_adjust_speed2' then
        value3 = event.args:get(1)*360
    elseif event.args:get(0) == 'effects_adjust_texture2' then
        value4 = event.args:get(1)*360
    end
    if self.lumi_params_setter and self.lumi_params_setter.onEvent then
        self.lumi_params_setter:onEvent(self.lumi_obj, event)
    end
end

exports.LumiManager = LumiManager
return exports
