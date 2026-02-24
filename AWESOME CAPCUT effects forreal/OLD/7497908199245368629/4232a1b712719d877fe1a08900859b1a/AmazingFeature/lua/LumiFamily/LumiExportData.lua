local data = {}

local ae_compDurations = {0, 3}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'effect'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiTone_30-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiBrightness_30-effect1'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiContrast_30-effect2'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_30-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiTone_30-effect0'] = {
        ['amount'] = 1,
        ['whiteColor'] = Amaz.Color(0.07058817893267, 1, 0, 1),
        ['blackColor'] = Amaz.Color(0.05460340902209, 0.05210303887725, 0.05490196123719, 1),
    },
    ['LumiBrightness_30-effect1'] = {
        ['brightnessIntensity'] = -0.04999999850988,
    },
    ['LumiContrast_30-effect2'] = {
        ['contrastIntensity'] = 1.11,
        ['pivot'] = 0.43000000715256,
    },
    ['LumiLayer_30-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_sliderInfos = {
    ['effects_adjust_speed'] = {
        {'LumiTone_30-effect0', 'whiteColor', 'color', {true, true, true, true, }, 1, 2, 0, 1, {0, 0, 0, 0, }, {0, 0, 0, 0, }, },
        {'LumiTone_30-effect0', 'blackColor', 'color', {true, true, true, true, }, 1, 2, 0, 1, {0, 0, 0, 0, }, {0, 0, 0, 0, }, },
    },
}
data.ae_sliderInfos = ae_sliderInfos

local ae_fadeinInfos = {
    time = 0.05263157894737,
    infos = {
        {'LumiTone_30-effect0', 'whiteColor', 'color', {0, 0, 0, 0, }},
        {'LumiTone_30-effect0', 'blackColor', 'color', {0, 0, 0, 0, }},
    }
}
data.ae_fadeinInfos = ae_fadeinInfos

local ae_fadeoutInfos = {
    time = 0.05263157894737,
    infos = {
        {'LumiTone_30-effect0', 'whiteColor', 'color', {0, 0, 0, 0, }},
        {'LumiTone_30-effect0', 'blackColor', 'color', {0, 0, 0, 0, }},
    }
}
data.ae_fadeoutInfos = ae_fadeoutInfos

local ae_animationInfos = {
    animationMode = 1,
    loopStart = 0,
    speedInfo = {1, 0, 1, },
}
data.ae_animationInfos = ae_animationInfos

return data
