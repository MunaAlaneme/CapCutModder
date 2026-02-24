local data = {}

local ae_compDurations = {0, 2.96}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'effect'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['Lumi3DShape_30-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiGlow_30-effect1'] = {
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
    ['Lumi3DShape_30-effect0'] = {
        ['fov'] = 60,
        ['meshType'] = 3,
        ['meshSize_x'] = 2,
        ['meshSize_y'] = 2,
        ['meshSize_z'] = 2,
        ['meshResX'] = 30,
        ['meshResY'] = 30,
        ['meshResZ'] = 30,
        ['reverseUV'] = false,
        ['cullBack'] = false,
        ['translucency'] = false,
        ['twoSide'] = false,
        ['Position_x'] = 0,
        ['Position_y'] = 0,
        ['Position_z'] = -5,
        ['Scale_x'] = 1,
        ['Scale_y'] = 1,
        ['Scale_z'] = 1,
        ['Rotate_x'] = -18.2015061836369,
        ['Rotate_y'] = -17.4101363495658,
        ['Rotate_z'] = 8.70506817478288,
        ['texFillMode'] = 2,
        ['uvScaleX'] = 1,
        ['uvScaleY'] = 1,
        ['uvWrapMode'] = 1,
        ['enableMask'] = false,
        ['maskChannel'] = 3,
        ['bendZbyX'] = 0,
        ['bendZbyY'] = 0,
        ['bendYbyX'] = 0,
        ['bendYbyZ'] = 0,
        ['bendXbyY'] = 0,
        ['bendXbyZ'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(512, 512),
    },
    ['LumiGlow_30-effect1'] = {
        ['threshold'] = 0.96,
        ['radius'] = 85,
        ['glowIntensity'] = 2.52,
        ['blendMode'] = 3,
        ['show'] = 0,
        ['glowColor'] = 0,
        ['colorLooping'] = 0,
        ['colorLoops'] = 1.25,
        ['colorPhase'] = 0,
        ['midpoint'] = 1,
        ['colorA'] = Amaz.Color(0.22525303065777, 0.87294119596481, 0.72511619329453, 1),
        ['colorB'] = Amaz.Color(0.05629161372781, 0.4054901599884, 0.06943798065186, 1),
        ['glowDimensions'] = 0,
        ['quality'] = 1,
        ['AEDesignSize'] = Amaz.Vector2f(512, 512),
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

local ae_keyframes = {
    ['Lumi3DShape_30-effect0#fov#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.08, 0.32, }, 
		{{28, }, {60, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 0, }, 
		{0.32, 2.68, }, 
		{{60, }, {60, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{2.68, 2.84, }, 
		{{60, }, {28, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['Lumi3DShape_30-effect0#Rotate_x#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.12, 0.8, }, 
		{{0, }, {-23, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.8, 1.48, }, 
		{{-23, }, {-53, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.48, 2.2, }, 
		{{-53, }, {-161, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{2.2, 2.84, }, 
		{{-161, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['Lumi3DShape_30-effect0#Rotate_y#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.12, 0.8, }, 
		{{0, }, {-22, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.8, 1.48, }, 
		{{-22, }, {-68, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.48, 2.2, }, 
		{{-68, }, {-129, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{2.2, 2.84, }, 
		{{-129, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['Lumi3DShape_30-effect0#Rotate_z#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.12, 0.8, }, 
		{{0, }, {11, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.8, 1.48, }, 
		{{11, }, {-27, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.48, 2.2, }, 
		{{-27, }, {-110, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{2.2, 2.84, }, 
		{{-110, }, {-180, }, }, 
		{6417, }, 
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
