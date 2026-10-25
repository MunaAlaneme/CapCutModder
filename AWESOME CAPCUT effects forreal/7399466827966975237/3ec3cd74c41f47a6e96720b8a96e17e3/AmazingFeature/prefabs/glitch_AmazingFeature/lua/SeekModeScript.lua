--@input float curTime = 0.0{"widget":"slider","min":0,"max":10}

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript

function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 10.0  
    self.curTime = 0.0
    self.width = 0
    self.height = 0
    self.first = true
    return self
end

function SeekModeScript:onStart(comp)

    self.tableCom = comp.entity.scene:findEntityBy("glitch_AmazingFeature"):searchEntity("Table"):getComponent("TableComponent").table

    self.props    = comp.entity:getComponent("ScriptComponent").properties
    
    self.pass0mat = comp.entity.scene:findEntityBy("glitch_AmazingFeature"):searchEntity("Pass0"):getComponent("MeshRenderer").material
    
    self.pass1mat = comp.entity.scene:findEntityBy("glitch_AmazingFeature"):searchEntity("Pass1"):getComponent("MeshRenderer").material
    self.pass2mat = comp.entity.scene:findEntityBy("glitch_AmazingFeature"):searchEntity("Pass2"):getComponent("MeshRenderer").material
    
    self.pass3mat = comp.entity.scene:findEntityBy("glitch_AmazingFeature"):searchEntity("Pass3"):getComponent("MeshRenderer").material
    
    --"Transform"、"AnimSeqComponent"
end

function SeekModeScript:onUpdate(comp, detalTime)
    self.curTime=self.curTime+detalTime
    self:seekToTime(comp, self.curTime - self.startTime)
end

function SeekModeScript:seekToTime(comp, time)
    self.pass0mat:setFloat("iTime", time)
    self.pass1mat:setFloat("iTime", time)
    if self.first == true then
        self.first = false
    else
        local flag = 0
        self.pass0mat:setFloat("flag", flag)
        self.pass1mat:setFloat("flag", flag)
        self.pass2mat:setFloat("flag", flag)
        self.pass3mat:setFloat("flag", flag)
    end


end


exports.SeekModeScript = SeekModeScript
return exports






