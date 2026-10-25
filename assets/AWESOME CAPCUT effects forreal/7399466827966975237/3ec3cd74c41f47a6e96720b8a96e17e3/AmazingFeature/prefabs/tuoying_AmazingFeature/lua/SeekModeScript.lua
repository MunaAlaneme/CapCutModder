---@class SeekModeScript : ScriptComponent
----@field curTime number [UI(Range={0, 300}, Slider)]
----@field duration number [UI(Input)]
----@field zoom_factor number
----@field blurRadius Vector4f
----@field direction Vector2f
----@field weight number
----@field filter number
----@field alpha number
----@field alpha1 number
----@field alpha2 number
----@field lightnessMin number
----@field lightnessRange number
----@field lightness number
----@field contrast number
----@field updateTime number
----@field colorSpeed number
----@field colorDiv number
----@field changeSrcColorTime number
----@field changeSrcColorWaitTime number
----@field changeSrcColorMax number
----@field isAutoPlay boolean

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript

  

function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 1.0
    self.curTime = 0.0
    self.width = 0
    self.height = 0
    return self
end
function SeekModeScript:onStart(comp)
    self.EASpeed = 1.0

    elf.pass5Material = comp.entity.scene:findEntityBy("tuoying_AmazingFeature"):searchEntity("Pass5"):getComponent("MeshRenderer").material
    self.camera5 = comp.entity.scene:findEntityBy("tuoying_AmazingFeature"):searchEntity("CameraPass5"):getComponent("Camera")
    self.isFirst = true
end

function SeekModeScript:seekToTime(comp, time)
    self.pass5Material['u_weight'] = self.weight
    self.pass5Material['u_alpha'] = self.alpha
    local timeMix = self.changeSrcColorTime+self.changeSrcColorWaitTime
    local tempTime = math.mod(self.curTime,2*(timeMix))
    local srcColorAlpha = 0.
end

function SeekModeScript:onEvent(sys, event)
    if "effects_adjust_intensity" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.alpha = intensity*2.0-1.0
    end
    if "effects_adjust_range" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.alpha1 = intensity
    end
    if "effects_adjust_speed" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.colorSpeed = intensity
    end
    if "effects_adjust_filter" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.filter = intensity
    end
end


exports.SeekModeScript = SeekModeScript
return exports
