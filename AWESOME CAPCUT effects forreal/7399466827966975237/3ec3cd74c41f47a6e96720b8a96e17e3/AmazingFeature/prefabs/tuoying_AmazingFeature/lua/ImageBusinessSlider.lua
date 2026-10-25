--write by editor  EffectSDK:10.9.0 EngineVersion:10.68.0 EditorBuildTime:Jan_21_2022_06_47_17
--sliderVersion: 20210901  Lua generation date: Wed May 25 11:23:55 2022


local exports = exports or {}
local ImageBusinessSlider = ImageBusinessSlider or {}
ImageBusinessSlider.__index = ImageBusinessSlider


function ImageBusinessSlider.new(construct, ...)
    local self = setmetatable({}, ImageBusinessSlider)
    if construct and ImageBusinessSlider.constructor then
        ImageBusinessSlider.constructor(self, ...)
    end
    return self
end


local function remap(x, a, b)
    return x * (b - a) + a
end


function ImageBusinessSlider:onStart(sys)
    self.Pass7Material0 = sys.scene:findEntityBy("tuoying_AmazingFeature"):searchEntity("Pass7"):getComponent("Renderer").material
end


function ImageBusinessSlider:onEvent(sys,event)
    if event.args:get(0) == "effects_adjust_color" then
        local intensity = event.args:get(1)
        self.Pass7Material0["u_colorChange"] = remap(intensity,0,1)
    end
end


exports.ImageBusinessSlider = ImageBusinessSlider
return exports