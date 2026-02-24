local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then
        SeekModeScript.constructor(self, ...)
    end
    return self
end

function SeekModeScript:constructor()
end

function SeekModeScript:onUpdate(comp, detalTime)
    if Amaz.Macros and Amaz.Macros.EditorSDK then
        self.buildScript = comp.entity.scene:findEntityBy("Camera_entity"):getComponent("ScriptComponent")
        local scriptObj = self:getLuaObj(self.buildScript)
        if scriptObj then
            self:seekToTime(comp, scriptObj.curTime - self.startTime)
        end
    else
        self:seekToTime(comp, self.curTime - self.startTime)
    end
end

function SeekModeScript:onStart(comp)
    self.particles = comp.entity.scene:findEntityBy("particles"):getComponent("MeshRenderer").material
    self.srcMergeMatting = comp.entity.scene:findEntityBy("srcMergeMatting"):getComponent("MeshRenderer").material
end

function SeekModeScript:start(comp)
end

function SeekModeScript:getLuaObj(scriptComponent)
    if scriptComponent then
        local script = scriptComponent:getScript()
        if script then
            local luaObj = Amaz.ScriptUtils.getLuaObj(script)
            return luaObj
        end
    end
    return nil
end
function SeekModeScript:onEvent(comp, event)
    if ("effects_adjust_range" == event.args:get(0)) then
        local intensity = event.args:get(1)
        self.srcMergeMatting:setFloat("radius", intensity)
    end
    if ("effects_adjust_intensity" == event.args:get(0)) then
        local intensity = (event.args:get(1)*math.pi*-10) + (math.pi*2)
        self.srcMergeMatting:setFloat("_Angle", intensity)
    end
end

exports.SeekModeScript = SeekModeScript
return exports
