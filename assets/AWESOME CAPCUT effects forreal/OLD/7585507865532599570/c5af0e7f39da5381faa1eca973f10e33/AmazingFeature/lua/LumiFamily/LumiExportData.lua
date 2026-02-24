local data = {}

local ae_compDurations = {0, 3}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'effect'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiHalftone_88-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiPageTurn_88-effect1'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiHalftone_91-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiPageTurn_91-effect1'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiPageTurn_95-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_91-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiPageTurn_92-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_92-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiHalftone_89-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiPageTurn_89-effect1'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_89-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiPageTurn_90-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_90-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_88-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiPageTurn_86-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_86-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiHalftone_88-effect0'] = {
        ['colorMode'] = 0,
        ['blackDots'] = true,
        ['dotFreq'] = 740,
        ['rotationAngle'] = -30,
        ['dotsRelativeWidth'] = 1,
        ['dotsSharpen'] = 1,
        ['dotsLighten'] = 0,
        ['color1'] = Amaz.Color(1, 1, 1, 1),
        ['color2'] = Amaz.Color(0, 0, 0, 1),
        ['dotsShift'] = Amaz.Vector2f(0, 0),
        ['alternateShift'] = Amaz.Vector2f(0, 0),
        ['redOffsetX'] = 0,
        ['redOffsetY'] = 0.25,
        ['greenOffsetX'] = 0,
        ['greenOffsetY'] = 0,
        ['blueOffsetX'] = 0,
        ['blueOffsetY'] = -0.25,
        ['smoothFactor'] = 0,
        ['useRings'] = false,
        ['ringThickness'] = 0.5,
        ['ringCount'] = 6,
        ['ringPhase'] = 1,
        ['quality'] = 0.5,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiPageTurn_88-effect1'] = {
        ['classic_ui'] = 1,
        ['inFoldPosition'] = Amaz.Vector2f(2.14907407407407, -0.44814814814815),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.46,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiHalftone_91-effect0'] = {
        ['colorMode'] = 0,
        ['blackDots'] = true,
        ['dotFreq'] = 740,
        ['rotationAngle'] = -30,
        ['dotsRelativeWidth'] = 1,
        ['dotsSharpen'] = 1,
        ['dotsLighten'] = 0,
        ['color1'] = Amaz.Color(1, 1, 1, 1),
        ['color2'] = Amaz.Color(0, 0, 0, 1),
        ['dotsShift'] = Amaz.Vector2f(0, 0),
        ['alternateShift'] = Amaz.Vector2f(0, 0),
        ['redOffsetX'] = 0,
        ['redOffsetY'] = 0.25,
        ['greenOffsetX'] = 0,
        ['greenOffsetY'] = 0,
        ['blueOffsetX'] = 0,
        ['blueOffsetY'] = -0.25,
        ['smoothFactor'] = 0,
        ['useRings'] = false,
        ['ringThickness'] = 0.5,
        ['ringCount'] = 6,
        ['ringPhase'] = 1,
        ['quality'] = 0.5,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiPageTurn_91-effect1'] = {
        ['classic_ui'] = 1,
        ['inFoldPosition'] = Amaz.Vector2f(1.61148044585811, -0.08127682078455),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.46,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiPageTurn_95-effect0'] = {
        ['classic_ui'] = 1,
        ['inFoldPosition'] = Amaz.Vector2f(-0.04351851851852, 1.04814814814815),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.46,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_91-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
    ['LumiPageTurn_92-effect0'] = {
        ['classic_ui'] = 1,
        ['inFoldPosition'] = Amaz.Vector2f(2.14907407407407, -0.44814814814815),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.46,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_92-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
    ['LumiHalftone_89-effect0'] = {
        ['colorMode'] = 0,
        ['blackDots'] = true,
        ['dotFreq'] = 740,
        ['rotationAngle'] = -30,
        ['dotsRelativeWidth'] = 1,
        ['dotsSharpen'] = 1,
        ['dotsLighten'] = 0,
        ['color1'] = Amaz.Color(1, 1, 1, 1),
        ['color2'] = Amaz.Color(0, 0, 0, 1),
        ['dotsShift'] = Amaz.Vector2f(0, 0),
        ['alternateShift'] = Amaz.Vector2f(0, 0),
        ['redOffsetX'] = 0,
        ['redOffsetY'] = 0.25,
        ['greenOffsetX'] = 0,
        ['greenOffsetY'] = 0,
        ['blueOffsetX'] = 0,
        ['blueOffsetY'] = -0.25,
        ['smoothFactor'] = 0,
        ['useRings'] = false,
        ['ringThickness'] = 0.5,
        ['ringCount'] = 6,
        ['ringPhase'] = 1,
        ['quality'] = 0.5,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiPageTurn_89-effect1'] = {
        ['classic_ui'] = 1,
        ['inFoldPosition'] = Amaz.Vector2f(2.14907407407407, -0.44814814814815),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.46,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_89-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
    ['LumiPageTurn_90-effect0'] = {
        ['classic_ui'] = 1,
        ['inFoldPosition'] = Amaz.Vector2f(2.14907407407407, -0.44814814814815),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.46,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_90-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
    ['LumiLayer_88-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
    ['LumiPageTurn_86-effect0'] = {
        ['classic_ui'] = 1,
        ['inFoldPosition'] = Amaz.Vector2f(2.14907407407407, -0.44814814814815),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.46,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_86-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiPageTurn_88-effect1#inFoldPosition#vector'] =
{
	{
		{0.36, 0, 0.63, 1, }, 
		{0.5, 1, }, 
		{{-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, {-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiPageTurn_91-effect1#inFoldPosition#vector'] =
{
	{
		{0.36, 0, 0.63, 1, }, 
		{2.5, 3, }, 
		{{-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, {-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiPageTurn_92-effect0#inFoldPosition#vector'] =
{
	{
		{0.36, 0, 0.63, 1, }, 
		{2, 2.5, }, 
		{{-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, {-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiPageTurn_89-effect1#inFoldPosition#vector'] =
{
	{
		{0.36, 0, 0.63, 1, }, 
		{1.5, 2, }, 
		{{-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, {-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiPageTurn_90-effect0#inFoldPosition#vector'] =
{
	{
		{0.36, 0, 0.63, 1, }, 
		{1, 1.5, }, 
		{{-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, {-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiPageTurn_86-effect0#inFoldPosition#vector'] =
{
	{
		{0.36, 0, 0.63, 1, }, 
		{0, 0.5, }, 
		{{-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, {-0.04351851851852, 1.04814814814815, }, {2.14907407407407, -0.44814814814815, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
}
data.ae_keyframes = ae_keyframes

local ae_reverseKeyframes = false
data.ae_reverseKeyframes = ae_reverseKeyframes

local ae_sliderInfos = {
}
data.ae_sliderInfos = ae_sliderInfos

local ae_fadeinInfos = {
    time = 0,
    infos = {
    }
}
data.ae_fadeinInfos = ae_fadeinInfos

local ae_fadeoutInfos = {
    time = 0,
    infos = {
    }
}
data.ae_fadeoutInfos = ae_fadeoutInfos

local ae_animationInfos = {
    animationMode = 1,
    loopStart = 0,
    speedInfo = {1, 0.5, 2, },
}
data.ae_animationInfos = ae_animationInfos

return data
