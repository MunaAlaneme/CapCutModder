local exports = exports or {}
local ScriptCompTmp = ScriptCompTmp or {}
ScriptCompTmp.__index = ScriptCompTmp

function ScriptCompTmp.new(construct, ...)
    local self = setmetatable({}, ScriptCompTmp)

    if construct and ScriptCompTmp.constructor then ScriptCompTmp.constructor(self, ...) end
    self.time = 0
    self.startTime = 0.0
    -- self.speed= 1.0
    return self
end

function ScriptCompTmp:constructor()
end

function ScriptCompTmp:onStart(comp)
    self.pass2material = comp.entity.scene:findEntityBy("Untitled"):getComponent("MeshRenderer").sharedMaterials:get(0)
end

function ScriptCompTmp:onUpdate(comp, deltaTime)
    self.time = 0.02 + self.time
    self:seekToTime(comp, self.time - self.startTime)

end
function ScriptCompTmp:seekToTime(comp, time)
    -- self.speed=self.pass2material:getFloat("speed")
    self.mytime = (time-1.0)*self.pass2material:getFloat("speed")+1.0
    self.pass2material:setFloat("iTime",self.mytime)
end

function ScriptCompTmp:onEvent(sys,event)
    if event.args:get(0) == "effects_adjust_speed" then
        local intensity = event.args:get(1)

        self.pass2material:setFloat("tilew",intensity)
    end
    if event.args:get(0) == "effects_adjust_intensity" then
        local intensity = event.args:get(1)
        self.pass2material:setFloat("tileh",intensity)
    end

    if event.args:get(0) == "effects_adjust_size" then
        local intensity = event.args:get(1)
        self.pass2material:setFloat("offx",intensity)
    end
    if event.args:get(0) == "effects_adjust_speed2" then
        local intensity = event.args:get(1)

        self.pass2material:setFloat("offy",intensity)
    end
    if event.args:get(0) == "effects_adjust_intensity2" then
        local intensity = event.args:get(1)
        self.pass2material:setFloat("speedx",intensity)
    end

    if event.args:get(0) == "effects_adjust_size2" then
        local intensity = event.args:get(1)
        self.pass2material:setFloat("speedy",intensity)
    end

    if event.args:get(0) == "effects_adjust_speed3" then
        local intensity = event.args:get(1)
        self.pass2material:setFloat("repeatx",intensity)
    end

    if event.args:get(0) == "effects_adjust_intensity3" then
        local intensity = event.args:get(1)
        self.pass2material:setFloat("repeaty",intensity)
    end
    if event.args:get(0) == "effects_adjust_rotation1" then
        local intensity = event.args:get(1)
        self.pass2material:setFloat("offrot", intensity*2.0*math.pi)
    end

    if event.args:get(0) == "effects_adjust_rotation2" then
        local intensity = event.args:get(1)
        self.pass2material:setFloat("speedrot", intensity*2.0*math.pi)
    end
end




exports.ScriptCompTmp = ScriptCompTmp
return exports
