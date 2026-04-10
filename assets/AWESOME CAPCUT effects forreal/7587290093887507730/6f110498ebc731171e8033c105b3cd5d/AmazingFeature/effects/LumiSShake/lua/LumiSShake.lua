local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiSShake = LumiSShake or {}
LumiSShake.__index = LumiSShake
---@class LumiSShake : ScriptComponent
---@field ampRatio double [UI(Display="Amplitude Ratio", Range={0, 50}, Drag)]
---@field frqRatio double [UI(Display="Frequency Ratio", Range={0, 100}, Drag)]
---@field phase0 double [UI(Display="Base Phase")]
---@field scale0 double [UI(Display="Base Scale", Range={0.001, 15}, Drag)]
---@field blurEnabled Bool
---@field blurIntensity double [UI(Display="MotionBlur Intensity", Range={0, 5}, Drag)]
---@field blurQuality double [UI(Display="MotionBlur Quality", Range={0, 1}, Drag)]
---@field seed double [UI(Display="Random Seed")]
---@field random double [UI(Display="Randomness")]
---@field xFill string [UI(Option={"None", "Repeat", "Mirror"})]
---@field yFill string [UI(Option={"None", "Repeat", "Mirror"})]
---@field xAmpR double [UI(Display="X Amplitude Random", Range={0, 1500}, Drag)]
---@field xFrqR double [UI(Display="X Frequency Random", Range={0, 15}, Drag)]
---@field xAmp double [UI(Display="X Amplitude Main", Range={0, 1500}, Drag)]
---@field xFrq double [UI(Display="X Frequency Main", Range={0, 15}, Drag)]
---@field xPhase double [UI(Display="X Phase", Range={-5, 2000}, Drag)]
---@field yAmpR double [UI(Display="Y Amplitude Random", Range={0, 1500}, Drag)]
---@field yFrqR double [UI(Display="Y Frequency Random", Range={0, 15}, Drag)]
---@field yAmp double [UI(Display="Y Amplitude Main", Range={0, 1500}, Drag)]
---@field yFrq double [UI(Display="Y Frequency Main", Range={0, 15}, Drag)]
---@field yPhase double [UI(Display="Y Phase", Range={-5, 2000}, Drag)]
---@field zAmpR double [UI(Display="Z Amplitude Random", Range={0, 2000}, Drag)]
---@field zFrqR double [UI(Display="Z Frequency Random", Range={0, 15}, Drag)]
---@field zAmp double [UI(Display="Z Amplitude Main", Range={0, 2000}, Drag)]
---@field zFrq double [UI(Display="Z Frequency Main", Range={0, 15}, Drag)]
---@field zPhase double [UI(Display="Z Phase", Range={-5, 2000}, Drag)]
---@field wAmpR double [UI(Display="Rotate Amplitude Random", Range={0, 360}, Drag)]
---@field wFrqR double [UI(Display="Rotate Frequency Random", Range={0, 10}, Drag)]
---@field wAmp double [UI(Display="Rotate Amplitude Main", Range={0, 360}, Drag)]
---@field wFrq double [UI(Display="Rotate Frequency Main", Range={0, 10}, Drag)]
---@field wPhase double [UI(Display="Rotate Phase", Range={-5, 2000}, Drag)]
---@field rAmpRatio double [UI(Display="Red Amplitude Ratio", Range={0, 5}, Drag)]
---@field gAmpRatio double [UI(Display="Green Amplitude Ratio", Range={0, 5}, Drag)]
---@field bAmpRatio double [UI(Display="Blue Amplitude Ratio", Range={0, 5}, Drag)]
---@field rPhase double [UI(Display="Red Phase", Range={-0.1, 0.1}, Drag)]
---@field gPhase double [UI(Display="Green Phase", Range={-0.1, 0.1}, Drag)]
---@field bPhase double [UI(Display="Blue Phase", Range={-0.1, 0.1}, Drag)]
---@field rgbRnd double [UI(Display="RGB Randomness", Range={0, 5}, Drag)]
---@field rgbFrq double [UI(Display="RGB Frequency", Range={0.1, 30}, Drag)]
---@field InputTex Texture
---@field OutputTex Texture

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

local function createRenderTexture(width, height, filterMag, filterMin)
    local rt = Amaz.RenderTexture()
    rt.width = width
    rt.height = height
    rt.depth = 1
    rt.filterMag = filterMag or Amaz.FilterMode.LINEAR
    rt.filterMin = filterMin or Amaz.FilterMode.LINEAR
    rt.filterMipmap = Amaz.FilterMipmapMode.NONE
    rt.attachment = Amaz.RenderTextureAttachment.NONE
    return rt
end

local function updateTexSize(rt, width, height)
    if rt == nil or width <= 0 or height <= 0 then
        return
    end
    if rt.width ~= width or rt.height ~= height then
        rt.width = width
        rt.height = height
    end
end

function LumiSShake.new(construct, ...)
    local self = setmetatable({}, LumiSShake)

    self.__lumi_type = "lumi_obj"
    self.__lumi_rt_pingpong_type = "custom"

    self.InputTex = nil
    self.OutputTex = nil

    self.ampRatio = 1
    self.frqRatio = 1
    self.phase0 = 0
    self.scale0 = 1
    self.blurEnabled = false
    self.blurIntensity = 1
    self.blurQuality = 0
    self.seed = 0
    self.xFill = "None"
    self.yFill = "None"
    self.xAmpR = 192
    self.xFrqR = 1
    self.xAmp = 0
    self.xFrq = 0.5
    self.xPhase = 0
    self.yAmpR = 192
    self.yFrqR = 1
    self.yAmp = 0
    self.yFrq = 0.5
    self.yPhase = 0
    self.zAmpR = 0
    self.zFrqR = 1
    self.zAmp = 0
    self.zFrq = 0.5
    self.zPhase = 0
    self.wAmpR = 0
    self.wFrqR = 1
    self.wAmp = 0
    self.wFrq = 0.5
    self.wPhase = 0
    self.rAmpRatio = 1
    self.gAmpRatio = 1
    self.bAmpRatio = 1
    self.rPhase = 0
    self.gPhase = 0
    self.bPhase = 0
    self.rgbRnd = 0
    self.rgbFrq = 2
    self.random = 0

    self.curTime = 0
    self.FILL_QUERY = {[0]="None", "Repeat", "Mirror",
                       ["None"]=0, ["Repeat"]=1, ["Mirror"]=2}
    self.DESIGN_SIZE = 1080
    return self
end

function LumiSShake:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _force)
        if _force or self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "xFill" then
        value = math.max(0, math.min(value, #self.FILL_QUERY))
        value = self.FILL_QUERY[value]
        _setEffectAttr(key, value)
    elseif key == "yFill" then
        value = math.max(0, math.min(value, #self.FILL_QUERY))
        value = self.FILL_QUERY[value]
        _setEffectAttr(key, value)
    else
        _setEffectAttr(key, value)
    end
end

function LumiSShake:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name
    Amaz.LOGI(self.TAG, 'onStart')

    -- Use entity instead of scene
    self.camera = self.entity:searchEntity("CameraSShake"):getComponent("Camera")
    self.renderer = self.entity:searchEntity("PassSShake"):getComponent("MeshRenderer")
    self.rendererBlur = self.entity:searchEntity("PassSShakeBlur"):getComponent("MeshRenderer")
end

function LumiSShake:onUpdate(comp, deltaTime)
    local ow = self.DESIGN_SIZE
    local oh = self.DESIGN_SIZE
    local iw = self.DESIGN_SIZE
    local ih = self.DESIGN_SIZE
    if self.OutputTex then
        self.camera.renderTexture = self.OutputTex
        ow = self.OutputTex.width
        oh = self.OutputTex.height
        local s = self.DESIGN_SIZE / math.min(ow, oh)
        ow = ow * s
        oh = oh * s
        iw = ow
        ih = oh
    end

    --self.curTime = 0
    if self.blurEnabled then
        self:applyBlur(iw, ih, ow, oh, self.curTime)
        self.rendererBlur.material:setTex("u_inputTexture", self.InputTex)
        self.rendererBlur.material:setInt("u_fillModeX", self.FILL_QUERY[self.xFill])
        self.rendererBlur.material:setInt("u_fillModeY", self.FILL_QUERY[self.yFill])
        self.rendererBlur.material:setVec2("u_screenSize", Amaz.Vector2f(ow, oh))
        self.rendererBlur.material:setVec2("u_spriteSize", Amaz.Vector2f(iw, ih))
        self.rendererBlur.entity.visible = true
        self.renderer.entity.visible = false
    else
        self:apply(iw, ih, ow, oh, self.curTime)
        self.renderer.material:setTex("u_inputTexture", self.InputTex)
        self.renderer.material:setInt("u_fillModeX", self.FILL_QUERY[self.xFill])
        self.renderer.material:setInt("u_fillModeY", self.FILL_QUERY[self.yFill])
        self.renderer.entity.visible = true
        self.rendererBlur.entity.visible = false
    end
end

function LumiSShake:apply (iw, ih, ow, oh, t)
    local phase0 = self.phase0
    local phaseR = phase0 + self.rPhase
    local phaseG = phase0 + self.gPhase
    local phaseB = phase0 + self.bPhase

    local amp0 = self.ampRatio
    local ampR = amp0 * self.rAmpRatio
    local ampG = amp0 * self.gAmpRatio
    local ampB = amp0 * self.bAmpRatio

    local frq0 = self.frqRatio

    local dXR = self.mainWave(ampR * self.xAmp, frq0 * self.xFrq, phaseR + self.xPhase, t)
    local dXG = self.mainWave(ampG * self.xAmp, frq0 * self.xFrq, phaseG + self.xPhase, t)
    local dXB = self.mainWave(ampB * self.xAmp, frq0 * self.xFrq, phaseB + self.xPhase, t)

    local dYR = self.mainWave(ampR * self.yAmp, frq0 * self.yFrq, phaseR + self.yPhase, t)
    local dYG = self.mainWave(ampG * self.yAmp, frq0 * self.yFrq, phaseG + self.yPhase, t)
    local dYB = self.mainWave(ampB * self.yAmp, frq0 * self.yFrq, phaseB + self.yPhase, t)

    local dZR = self.mainWave(ampR * self.zAmp, frq0 * self.zFrq, phaseR + self.zPhase, t)
    local dZG = self.mainWave(ampG * self.zAmp, frq0 * self.zFrq, phaseG + self.zPhase, t)
    local dZB = self.mainWave(ampB * self.zAmp, frq0 * self.zFrq, phaseB + self.zPhase, t)

    local dWR = self.mainWave(ampR * self.wAmp, frq0 * self.wFrq, phaseR + self.wPhase, t)
    local dWG = self.mainWave(ampG * self.wAmp, frq0 * self.wFrq, phaseG + self.wPhase, t)
    local dWB = self.mainWave(ampB * self.wAmp, frq0 * self.wFrq, phaseB + self.wPhase, t)

    dXR = dXR + self.randWaveX(ampR * self.xAmpR, frq0 * self.xFrqR, phaseR + self.xPhase, t, self.seed, self.random)
    dXG = dXG + self.randWaveX(ampG * self.xAmpR, frq0 * self.xFrqR, phaseG + self.xPhase, t, self.seed, self.random)
    dXB = dXB + self.randWaveX(ampB * self.xAmpR, frq0 * self.xFrqR, phaseB + self.xPhase, t, self.seed, self.random)

    dYR = dYR + self.randWaveY(ampR * self.yAmpR, frq0 * self.yFrqR, phaseR + self.yPhase, t, self.seed, self.random)
    dYG = dYG + self.randWaveY(ampG * self.yAmpR, frq0 * self.yFrqR, phaseG + self.yPhase, t, self.seed, self.random)
    dYB = dYB + self.randWaveY(ampB * self.yAmpR, frq0 * self.yFrqR, phaseB + self.yPhase, t, self.seed, self.random)

    dZR = dZR + self.randWaveZ(ampR * self.zAmpR, frq0 * self.zFrqR, phaseR + self.zPhase, t, self.seed, self.random)
    dZG = dZG + self.randWaveZ(ampG * self.zAmpR, frq0 * self.zFrqR, phaseG + self.zPhase, t, self.seed, self.random)
    dZB = dZB + self.randWaveZ(ampB * self.zAmpR, frq0 * self.zFrqR, phaseB + self.zPhase, t, self.seed, self.random)

    dWR = dWR + self.randWaveW(ampR * self.wAmpR, frq0 * self.wFrqR, phaseR + self.wPhase, t, self.seed, self.random)
    dWG = dWG + self.randWaveW(ampG * self.wAmpR, frq0 * self.wFrqR, phaseG + self.wPhase, t, self.seed, self.random)
    dWB = dWB + self.randWaveW(ampB * self.wAmpR, frq0 * self.wFrqR, phaseB + self.wPhase, t, self.seed, self.random)

    local screenSize = Amaz.Vector2f(ow, oh)
    local ohw = ow * 0.5
    local ohh = oh * 0.5
    local scaleR = self.DESIGN_SIZE / math.max(self.scale0 * self.DESIGN_SIZE + dZR, self.DESIGN_SIZE * 0.1)
    local scaleG = self.DESIGN_SIZE / math.max(self.scale0 * self.DESIGN_SIZE + dZG, self.DESIGN_SIZE * 0.1)
    local scaleB = self.DESIGN_SIZE / math.max(self.scale0 * self.DESIGN_SIZE + dZB, self.DESIGN_SIZE * 0.1)
    self.renderer.material:setMat4("u_uvMatR", self.matrix(screenSize, {{w = iw, h = ih, ax = 0.5, ay = 0.5, x = ohw - dXR, y = ohh - dYR, s = scaleR, r = -dWR}}))
    self.renderer.material:setMat4("u_uvMatG", self.matrix(screenSize, {{w = iw, h = ih, ax = 0.5, ay = 0.5, x = ohw - dXG, y = ohh - dYG, s = scaleG, r = -dWG}}))
    self.renderer.material:setMat4("u_uvMatB", self.matrix(screenSize, {{w = iw, h = ih, ax = 0.5, ay = 0.5, x = ohw - dXB, y = ohh - dYB, s = scaleB, r = -dWB}}))
end

function LumiSShake:applyBlur (iw, ih, ow, oh, t)
    local phase0 = self.phase0
    local phaseR = phase0 + self.rPhase
    local phaseG = phase0 + self.gPhase
    local phaseB = phase0 + self.bPhase

    local amp0 = self.ampRatio
    local ampR = amp0 * self.rAmpRatio
    local ampG = amp0 * self.gAmpRatio
    local ampB = amp0 * self.bAmpRatio

    local frq0 = self.frqRatio * 2

    local ohw = ow * 0.5
    local ohh = oh * 0.5
    local t0 = t - (self.blurIntensity * 0.5/30)
    local t1 = t + (self.blurIntensity * 0.5/30)
    local n = math.max(1, math.ceil(self.blurIntensity * self.mix(2, 12, self.blurQuality)))
    self.rendererBlur.material:setInt("u_frameCount", n)
    self.rendererBlur.material:setFloat("u_step", self.mix(10, 1, self.blurQuality))
    self.setMat4Vector(self.rendererBlur.material, "u_matricesR", n, function (i)
        local tt = self.mix(t0, t1, i/n)
        local dXR = self.mainWave(ampR * self.xAmp, frq0 * self.xFrq, phaseR + self.xPhase, tt)
        local dYR = self.mainWave(ampR * self.yAmp, frq0 * self.yFrq, phaseR + self.yPhase, tt)
        local dZR = self.mainWave(ampR * self.zAmp, frq0 * self.zFrq, phaseR + self.zPhase, tt)
        local dWR = self.mainWave(ampR * self.wAmp, frq0 * self.wFrq, phaseR + self.wPhase, tt)
        dXR = dXR + self.randWaveX(ampR * self.xAmpR, frq0 * self.xFrqR, phaseR + self.xPhase, tt, self.seed, self.random)
        dYR = dYR + self.randWaveY(ampR * self.yAmpR, frq0 * self.yFrqR, phaseR + self.yPhase, tt, self.seed, self.random)
        dZR = dZR + self.randWaveZ(ampR * self.zAmpR, frq0 * self.zFrqR, phaseR + self.zPhase, tt, self.seed, self.random)
        dWR = dWR + self.randWaveW(ampR * self.wAmpR, frq0 * self.wFrqR, phaseR + self.wPhase, tt, self.seed, self.random)
        local scaleR = self.DESIGN_SIZE / math.max(self.scale0 * self.DESIGN_SIZE + dZR, self.DESIGN_SIZE * 0.1)
        return self.matrix(nil, {{w = iw, h = ih, ax = 0.5, ay = 0.5, x = ohw - dXR, y = ohh - dYR, s = scaleR, r = -dWR}})
    end)
    self.setMat4Vector(self.rendererBlur.material, "u_matricesG", n, function (i)
        local tt = self.mix(t0, t1, i/n)
        local dXG = self.mainWave(ampG * self.xAmp, frq0 * self.xFrq, phaseG + self.xPhase, tt)
        local dYG = self.mainWave(ampG * self.yAmp, frq0 * self.yFrq, phaseG + self.yPhase, tt)
        local dZG = self.mainWave(ampG * self.zAmp, frq0 * self.zFrq, phaseG + self.zPhase, tt)
        local dWG = self.mainWave(ampG * self.wAmp, frq0 * self.wFrq, phaseG + self.wPhase, tt)
        dXG = dXG + self.randWaveX(ampG * self.xAmpR, frq0 * self.xFrqR, phaseG + self.xPhase, tt, self.seed, self.random)
        dYG = dYG + self.randWaveY(ampG * self.yAmpR, frq0 * self.yFrqR, phaseG + self.yPhase, tt, self.seed, self.random)
        dZG = dZG + self.randWaveZ(ampG * self.zAmpR, frq0 * self.zFrqR, phaseG + self.zPhase, tt, self.seed, self.random)
        dWG = dWG + self.randWaveW(ampG * self.wAmpR, frq0 * self.wFrqR, phaseG + self.wPhase, tt, self.seed, self.random)
        local scaleG = self.DESIGN_SIZE / math.max(self.scale0 * self.DESIGN_SIZE + dZG, self.DESIGN_SIZE * 0.1)
        return self.matrix(nil, {{w = iw, h = ih, ax = 0.5, ay = 0.5, x = ohw - dXG, y = ohh - dYG, s = scaleG, r = -dWG}})
    end)
    self.setMat4Vector(self.rendererBlur.material, "u_matricesB", n, function (i)
        local tt = self.mix(t0, t1, i/n)
        local dXB = self.mainWave(ampB * self.xAmp, frq0 * self.xFrq, phaseB + self.xPhase, tt)
        local dYB = self.mainWave(ampB * self.yAmp, frq0 * self.yFrq, phaseB + self.yPhase, tt)
        local dZB = self.mainWave(ampB * self.zAmp, frq0 * self.zFrq, phaseB + self.zPhase, tt)
        local dWB = self.mainWave(ampB * self.wAmp, frq0 * self.wFrq, phaseB + self.wPhase, tt)
        dXB = dXB + self.randWaveX(ampB * self.xAmpR, frq0 * self.xFrqR, phaseB + self.xPhase, tt, self.seed, self.random)
        dYB = dYB + self.randWaveY(ampB * self.yAmpR, frq0 * self.yFrqR, phaseB + self.yPhase, tt, self.seed, self.random)
        dZB = dZB + self.randWaveZ(ampB * self.zAmpR, frq0 * self.zFrqR, phaseB + self.zPhase, tt, self.seed, self.random)
        dWB = dWB + self.randWaveW(ampB * self.wAmpR, frq0 * self.wFrqR, phaseB + self.wPhase, tt, self.seed, self.random)
        local scaleB = self.DESIGN_SIZE / math.max(self.scale0 * self.DESIGN_SIZE + dZB, self.DESIGN_SIZE * 0.1)
        return self.matrix(nil, {{w = iw, h = ih, ax = 0.5, ay = 0.5, x = ohw - dXB, y = ohh - dYB, s = scaleB, r = -dWB}})
    end)
end


function LumiSShake.mainWave (amp, frq, phase, t)
    local x = math.pi * t * frq + phase
    return math.sin(x) * amp
end

--TODO
local function fract(x)
    return x - math.floor(x)
end

local function lerp(a, b, t)
    return a + (b - a) * t
end

-- smoother interpolation (Perlin fade)
local function smooth(t)
    return t * t * t * (t * (t * 6 - 15) + 10)
end

-- deterministic hash with seed
local function hash(x, seed)
    return fract(math.sin(x * 127.1 + seed * 311.7) * 43758.5453123)
end

-- base smooth noise
local function noise1D(x, seed)
    local i = math.floor(x)
    local f = x - i

    local a = hash(i, seed)
    local b = hash(i+1, seed)

    return lerp(a, b, smooth(f))
end

local function fractalNoise1D(x, seed, octaves)
    local value = 0
    local amp = 1
    local freq = 1
    local max = 0

    for i=1,octaves do
        value = value + noise1D(x*freq, seed+i*17)*amp
        max = max + amp
        amp = amp*0.5
        freq = freq*2
    end

    return value/max
end



-- ------------------------------------------------------------
-- 2D Simplex Noise (Lua Port)
-- ------------------------------------------------------------

local function floor(x)
    return math.floor(x)
end

local function frac(x)
    return x - floor(x)
end

local function dot2(a, b)
    return a[1]*b[1] + a[2]*b[2]
end

local function dot3(a, b)
    return a[1]*b[1] + a[2]*b[2] + a[3]*b[3]
end

local function mod289_2(x)
    return {
        x[1] - floor(x[1] / 289.0) * 289.0,
        x[2] - floor(x[2] / 289.0) * 289.0
    }
end

local function mod289_3(x)
    return {
        x[1] - floor(x[1] / 289.0) * 289.0,
        x[2] - floor(x[2] / 289.0) * 289.0,
        x[3] - floor(x[3] / 289.0) * 289.0
    }
end

local function permute(x)
    return mod289_3({
        (x[1] * 34.0 + 1.0) * x[1],
        (x[2] * 34.0 + 1.0) * x[2],
        (x[3] * 34.0 + 1.0) * x[3]
    })
end

function snoise2(vx, vy)

    local C = {
        0.211324865405187,
        0.366025403784439,
       -0.577350269189626,
        0.024390243902439
    }

    -- First corner
    local dotv = (vx + vy) * C[2]
    local i = {
        floor(vx + dotv),
        floor(vy + dotv)
    }

    local doti = (i[1] + i[2]) * C[1]
    local x0 = {
        vx - i[1] + doti,
        vy - i[2] + doti
    }

    -- Other corners
    local i1
    if x0[1] > x0[2] then
        i1 = {1.0, 0.0}
    else
        i1 = {0.0, 1.0}
    end

    local x12 = {
        x0[1] - i1[1] + C[1],
        x0[2] - i1[2] + C[1],
        x0[1] + C[3],
        x0[2] + C[3]
    }

    -- Permutations
    i = mod289_2(i)

    local p = permute(
        permute({
            i[2] + 0.0,
            i[2] + i1[2],
            i[2] + 1.0
        })
    )

    p = permute({
        p[1] + i[1] + 0.0,
        p[2] + i[1] + i1[1],
        p[3] + i[1] + 1.0
    })

    -- Gradients
    local m = {
        math.max(0.5 - dot2(x0, x0), 0.0),
        math.max(0.5 - (x12[1]*x12[1] + x12[2]*x12[2]), 0.0),
        math.max(0.5 - (x12[3]*x12[3] + x12[4]*x12[4]), 0.0)
    }

    for k=1,3 do
        m[k] = m[k] * m[k]
        m[k] = m[k] * m[k]
    end

    local x = {
        2.0 * frac(p[1] * C[4]) - 1.0,
        2.0 * frac(p[2] * C[4]) - 1.0,
        2.0 * frac(p[3] * C[4]) - 1.0
    }

    local h = {
        math.abs(x[1]) - 0.5,
        math.abs(x[2]) - 0.5,
        math.abs(x[3]) - 0.5
    }

    local ox = {
        floor(x[1] + 0.5),
        floor(x[2] + 0.5),
        floor(x[3] + 0.5)
    }

    local a0 = {
        x[1] - ox[1],
        x[2] - ox[2],
        x[3] - ox[3]
    }

    for k=1,3 do
        m[k] = m[k] * (1.79284291400159 - 0.85373472095314 * (a0[k]*a0[k] + h[k]*h[k]))
    end

    local g = {
        a0[1]*x0[1] + h[1]*x0[2],
        a0[2]*x12[1] + h[2]*x12[2],
        a0[3]*x12[3] + h[3]*x12[4]
    }

    return 130.0 * dot3(m, g)
end





function LumiSShake.randWaveX (amp, frq, phase, t, seed, random)
    local x = math.pi * t * frq
    local y = 0
    if random == 1 then
        y = y + snoise2(phase+x, seed * 49235.3198)
    elseif random == 2 then
        y = y + (fractalNoise1D(x+phase, seed, 4)*2 - 1)
    else
        y = y + math.cos(x * (2 + seed % 0.33) * 0.5 + phase + seed % 1.13) * 0.50 * 0.5
        y = y + math.sin(x * (3 + seed % 0.73) * 0.5 + phase + seed % 0.69) * 0.32 * 0.5
        y = y + math.cos(x * (5 + seed % 1.37) * 0.5 + phase + seed % 0.33) * 0.18 * 0.5
    end
    return y * amp
end
function LumiSShake.randWaveY (amp, frq, phase, t, seed, random)
    local x = math.pi * t * frq
    local y = 0
    if random == 1 then
        y = y + snoise2(phase+x+7468.329, seed * 19337.9404)
    elseif random == 2 then
        y = y + (fractalNoise1D(x+phase, seed+100, 4)*2 - 1)
    else
        y = y + math.sin(x * (2 + seed % 0.33) * 0.5 + phase + seed % 1.13) * 0.50 * 0.5
        y = y + math.cos(x * (3 + seed % 0.73) * 0.5 + phase + seed % 0.69) * 0.32 * 0.5
        y = y + math.sin(x * (5 + seed % 1.37) * 0.5 + phase + seed % 0.33) * 0.18 * 0.5
    end
    return y * amp
end
function LumiSShake.randWaveZ (amp, frq, phase, t, seed, random)
    local x = math.pi * t * frq
    local y = 0
    if random == 1 then
        y = y + snoise2(phase+x+14936.658, seed * 59235.3198)
    elseif random == 2 then
        y = y + (fractalNoise1D(x+phase, seed+200, 3)*2 - 1)
    else
        y = y + math.sin(x * (2 + seed % 0.33) * 0.5 + phase + seed % 1.13) * 0.50
        y = y + math.sin(x * (3 + seed % 0.73) * 0.5 + phase + seed % 0.69) * 0.32
        y = y + math.cos(x * (5 + seed % 1.37) * 0.5 + phase + seed % 0.33) * 0.18
    end
    return y * amp
end
function LumiSShake.randWaveW (amp, frq, phase, t, seed, random)
    local x = math.pi * t * frq
    local y = 0
    if random == 1 then
        y = y + snoise2(phase+x+22404.987, seed * 18337.9404)
    elseif random == 2 then
        y = y + (fractalNoise1D(x+phase, seed+300, 3)*2 - 1)
    else
        y = y + math.sin(x * (2 + seed % 0.33) * 0.5 + phase + seed % 1.13) * 0.50
        y = y + math.cos(x * (3 + seed % 0.73) * 0.5 + phase + seed % 0.69) * 0.32
        y = y + math.cos(x * (5 + seed % 1.37) * 0.5 + phase + seed % 0.33) * 0.18
    end
    return y * amp
end


function LumiSShake:scale (dZ)
    local z0 = self.scale0 * 720
    local z = z0 + dZ
    return 720 / z
end

function LumiSShake.matrix (screenSize, layers)
    local matrix = Amaz.Matrix4x4f()
    if screenSize then
        local last = layers[#layers]
        matrix:setScale(Amaz.Vector3f(1/last.w, 1/last.h, 1))
    else
        matrix:setIdentity()
    end
    for i = #layers, 1, -1 do
        local layer = layers[i]
        if layer.ax or layer.ay then
            local dx = layer.ax and layer.ax * layer.w or 0
            local dy = layer.ay and layer.ay * layer.h or 0
            matrix:translate(Amaz.Vector3f(dx, dy, 0))
        end
        if layer.r then
            local rotate = Amaz.Matrix4x4f()
            rotate:setTR(Amaz.Vector3f(0, 0, 0), Amaz.Quaternionf.eulerToQuaternion(Amaz.Vector3f(0, 0, -math.rad(layer.r))))
            matrix = matrix * rotate
        end
        if layer.s then
            matrix:scale(Amaz.Vector3f(1/layer.s, 1/layer.s, 1))
        elseif layer.sx or layer.sy then
            matrix:scale(Amaz.Vector3f(1/layer.sx, 1/layer.sy, 1))
        end
        if layer.x or layer.y then
            local x = layer.x and -layer.x or 0
            local y = layer.y and -layer.y or 0
            matrix:translate(Amaz.Vector3f(x, y, 0))
        end
    end
    if screenSize then
        matrix:scale(Amaz.Vector3f(screenSize.x, screenSize.y, 1))
    end
    return matrix
end

function LumiSShake.setMat4Vector (material, varName, count, maker)
    local arr = Amaz.Vec4Vector()
    for i = 0, count do
        local mat = maker(i)
        arr:pushBack(mat:getColumn(0))
        arr:pushBack(mat:getColumn(1))
        arr:pushBack(mat:getColumn(2))
        arr:pushBack(mat:getColumn(3))
    end
    material:setVec4Vector(varName, arr)
end

function LumiSShake.mix (a, b, t)
    return a + (b - a) * t
end

exports.LumiSShake = LumiSShake
return exports
