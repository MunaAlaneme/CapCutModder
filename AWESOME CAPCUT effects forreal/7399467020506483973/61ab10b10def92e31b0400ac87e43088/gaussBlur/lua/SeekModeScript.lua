--@input float curTime = 0.0{"widget":"slider","min":0,"max":10}

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0
    self.width = 0
    self.height = 0
    return self
end

function SeekModeScript:constructor()

end

function SeekModeScript:onUpdate(comp, detalTime)
    --text
    -- local props = comp.entity:getComponent("ScriptComponent").properties
    -- if props:has("curTime") then
    --     self:seekToTime(comp, props:get("curTime"))
    -- end
    --actual
    -- self.curTime = detalTime + self.curTime
    self:seekToTime(comp, self.curTime - self.startTime)
end

function SeekModeScript:onStart(comp)
    self.pass0Material = comp.entity.scene:findEntityBy("SeekModeScript"):getComponent("MeshRenderer").material
    -- self.pass0Material:setFloat("Speed", 1 + 5)
end

function SeekModeScript:seekToTime(comp, time)
    if self.first == nil then
        self.first = true
        -- self:start(comp)
    end
    -- self.animSeqCom:seekToTime(time)

    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    if w ~= self.width or h ~= self.height then
        self.width = w
        self.height = h
        self.pass0Material:setFloat("inputWidth",self.width)
        self.pass0Material:setFloat("inputHeight",self.height)
    end
    
    self.pass0Material:setFloat("time",time)
end

function SeekModeScript:onEvent(sys, event)
    if "effects_adjust_speed" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.pass0Material:setFloat("Speed", intensity*10.0)
    end
    if "effects_adjust_distortion" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.pass0Material:setFloat("region", intensity * .5)
    end
    if "effects_adjust_speed2" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.pass0Material:setFloat("range", intensity * .5)
    end
    if "effects_adjust_distortion2" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.pass0Material:setFloat("broken", intensity * 100.0)
    end
    if "effects_adjust_speed3" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.pass0Material:setFloat("brokenbool", intensity)
    end
end

exports.SeekModeScript = SeekModeScript
return exports
