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
    self.renderTargets = {}
    self.count = 0
    self.speedIntensity = 1
    self.filterIntensity = 1
    self.speedController = 0
    return self
end

function SeekModeScript:constructor()

end

function SeekModeScript:onUpdate(comp, detalTime)
    ---154788126623430832219511065127975508711173527549435695743
    -- local props = comp.entity:getComponent("ScriptComponent").properties
    -- if props:has("curTime") then
    --     self:seekToTime(comp, props:get("curTime"))
    -- end
    ---486158496203046556263158757421186850461173527549435695743
    self:seekToTime(comp, self.curTime - self.startTime)
end

function SeekModeScript:start(comp)
    self.pass0Material = comp.entity:getComponent("MeshRenderer").material
    -- self.pass3Material = comp.entity.scene:findEntityBy("Pass3"):getComponent("MeshRenderer").material
    -- self.camera0 = comp.entity.scene:findEntityBy("CameraPass0"):getComponent("Camera")
    self.camera3 = comp.entity.scene:findEntityBy("CameraPass3"):getComponent("Camera")
    self.camera4 = comp.entity.scene:findEntityBy("CameraPass4"):getComponent("Camera")
    self.entity3 = comp.entity.scene:findEntityBy("CameraPass3")
    self.entity4 = comp.entity.scene:findEntityBy("CameraPass4")
    self.renderTargets[1] = self.camera3.renderTexture
    self.renderTargets[2] = self.camera4.renderTexture
    -- self.entity3.visible = false
    -- self.entity4.visible = false
end

function SeekModeScript:seekToTime(comp, time)
    local controllerFactor = math.floor(5 * (1 - self.speedIntensity)) + 1
    if self.first == nil then
        self.first = true
        self:start(comp)
        if self.count%2 ~= 0 then
            self.entity3.visible = false
            self.entity4.visible = true
            self.renderTargets[(self.count%2)+1] = self.camera4.renderTexture
        else
            self.entity3.visible = true
            self.entity4.visible = false
            self.renderTargets[(self.count%2)+1] = self.camera3.renderTexture
        end
    
        -- self.pass0Material:setTex("inputImageTextureLast",self.renderTargets[(self.count+1)%2+1])
        self.count = self.count+1
    elseif self.speedController % controllerFactor == 0 then
        if self.count%2 ~= 0 then
            self.entity3.visible = false
            self.entity4.visible = true
            self.renderTargets[(self.count%2)+1] = self.camera4.renderTexture
        else
            self.entity3.visible = true
            self.entity4.visible = false
            self.renderTargets[(self.count%2)+1] = self.camera3.renderTexture
        end
    
        self.pass0Material:setTex("inputImageTextureLast",self.renderTargets[(self.count+1)%2+1])
        self.count = self.count+1
        -- self.speedController = (self.speedController + 1) % controllerFactor
    else
        -- self.speedController = (self.speedController + 1) % controllerFactor
    end
    self.speedController = (self.speedController + 1) % controllerFactor
    -- self.animSeqCom:seekToTime(time)

    -- local w = Amaz.BuiltinObject:getInputTextureWidth()
    -- local h = Amaz.BuiltinObject:getInputTextureHeight()
    -- if w ~= self.width or h ~= self.height then
    --     self.width = w
    --     self.height = h
    --     -- self.pass1Material:setInt("inputWidth",self.width)
    --     -- self.pass1Material:setInt("inputHeight",self.height)
    -- end
    self.pass0Material:setFloat("filterIntensity", self.filterIntensity)
end

function SeekModeScript:onEvent(sys, event)
    if "effects_adjust_speed" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.speedIntensity = intensity * 0.9
    end
    if "effects_adjust_filter" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.filterIntensity = intensity
    end
    -- if "effects_adjust_range" == event.args:get(0) then
    --     local intensity = event.args:get(1)
    --     self.rangeIntensity = intensity
    -- end
end

exports.SeekModeScript = SeekModeScript
return exports
