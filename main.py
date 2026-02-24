import pyglet
pyglet.resource.path = ["assets"]
pyglet.resource.reindex()
import math
import os
import pwd
import shutil
from pathlib import Path
def get_resource_root():
    # Use the first resource path (most apps only need one)
    return Path(pyglet.resource.path[0]).resolve()
from pyglet.window import key
from pyglet.window import mouse
from pyglet.window import *
from pyglet.window import Window
from pyglet.app import run
from pyglet.app import *
from pyglet.graphics import Batch
from pyglet.text import Label
import time
from pyglet import font
from pyglet import resource
import pyglet.window.key

def copy_resource_folder(folder_name, destination):
    """
    Copies assets/folder_name → destination/folder_name
    """
    resource_root = get_resource_root()
    src = resource_root / folder_name
    dst = Path(destination) / folder_name

    if not src.exists():
        raise FileNotFoundError(f"Resource folder not found: {src}")

    shutil.copytree(src, dst, dirs_exist_ok=True)
def get_resource_root():
    return Path(pyglet.resource.path[0]).resolve()
def CopyEffects(ID):
    """
    Copies multiple folders from assets/ into destination/

    folders      -> list of folder paths relative to assets/
    destination  -> output folder
    """
    for IDS in ID:
        resource_root = get_resource_root()
        destination=f"/Users/{get_username()}/Movies/CapCut/User Data/Cache/effect/{IDS}"
        destination = Path(destination).resolve()

        if destination.exists():
            shutil.rmtree(destination)

        destination=f"/Users/{get_username()}/Movies/CapCut/User Data/Cache/effect/"
        destination = Path(destination).resolve()
        destination.mkdir(parents=True, exist_ok=True)
        folder = f"./AWESOME CAPCUT effects forreal/{IDS}"
        src = resource_root / folder
        dst = destination / Path(folder).name

        if not src.exists():
            raise FileNotFoundError(f"Missing resource folder: {src}")

        shutil.copytree(src, dst)
def lerp(a, b, t):
    return a + (b - a) * t
def constrain(val, min_val, max_val):
    if val < min_val: return min_val
    if val > max_val: return max_val
    return val
def get_username():
    return pwd.getpwuid(os.getuid())[0]
print(get_username())

effectIDs = [
    7399472023874931973,
    7538416788560760125,
    7399467918615973125,
    7585507865532599570,
    7584604470445706549,
    7586945658486082817,
    7516649204144426293,
    7525161059229961525,
    7399467020506483973,
    7399470493742451973,
    7497908199245368629,
    7587290093887507730,
    7589504110471171335,
    7599898793059912967,
    7497204107288022325
]
def modCapCut():
    CopyEffects(effectIDs)
moddedTime = 0

class GlassPanel:
    def __init__(self, x, y, w, h, batch):
        self.rect = pyglet.shapes.Rectangle(
            x, y, w, h,
            color=(30, 30, 255),
            batch=batch
        )
        self.rect.opacity = 160

class Button:
    def __init__(self, text, x, y, w, h, batch, on_click):
        self.x, self.y, self.w, self.h = x, y, w, h
        self.on_click = on_click
        self.hover = 0.0

        self.bg = pyglet.shapes.Rectangle(
            x, y, w, h,
            color=(50, 50, 50),
            batch=batch
        )
        self.bg.opacity = 150

        self.label = pyglet.text.Label(
            text,
            font_size=18,
            font_name='Consolas',
            x=x + w // 2,
            y=y + h // 2,
            anchor_x='center',
            anchor_y='center',
            batch=batch
        )

    def contains(self, mx, my):
        return self.x <= mx <= self.x + self.w and self.y <= my <= self.y + self.h

    def update(self, mx, my, dt):
        target = 1.0 if self.contains(mx, my) else 0.0
        self.hover = lerp(self.hover, target, dt * 10)

        self.bg.opacity = int(150 + self.hover * 80)
        self.bg.color = (70, 70 + int(self.hover * 60), 120)

    def click(self, mx, my):
        if self.contains(mx, my):
            self.on_click()


window = pyglet.window.Window(1280, 720, caption="CapCut Modder", visible=False, resizable=True, config=pyglet.gl.Config(double_buffer=True))
clock = pyglet.clock.Clock()
batch = pyglet.graphics.Batch()
resource.add_font('VCR_OSD_MONO_1.001.ttf')
VCROSDMONO = font.load('VCR OSD MONO')
panel = GlassPanel(0, 0, 0, 0, batch)
def on_button():
    print("Button clicked!")
    modCapCut()
    moddedTime = 7.5
    print('Modding Complete!')
button = Button("Start", 350, 240, 200, 50, batch, on_button)
mouse_pos = (0, 0)
mouse_pos2 = (0, 0)
@window.event
def on_mouse_motion(x, y, dx, dy):
    global mouse_pos, mouse_pos2
    mouse_pos = (x, y)
    mouse_pos2 = (window._mouse_x, window._mouse_y)

fps_label = pyglet.text.Label(
    f'FPS: 0',
    font_name='Consolas',
    font_size=30,
    x=10,
    y=10,
    color=(0, 255, 0, 255),
    batch=batch
)
label1 = pyglet.text.Label(    "CapCut Modder\n\n"
    "• Fast\n"
    "• Clean\n"
    "• Custom\n\n"
    "Music by kasper_100\n"
    "Press SPACE to Mod CapCut.",
    font_name='VCR OSD MONO',
    align="center",
    font_size=36,
    width=window.width,
    x=window.width//2, y=window.height//2 + 160,
    anchor_x='center', anchor_y='center',
    multiline=True,
    batch=batch
)
label2 = pyglet.text.Label('Modding Complete',
    font_name='VCR OSD MONO',
    font_size=36,
    align="center",
    x=window.width//2, y=window.height//2 - 100,
    anchor_x='center', anchor_y='center',
    batch=batch,
    color=(255, 255, 255, 0)
)
label3 = pyglet.text.Label("Or click 'Start' to mod\nCapCut.",
    font_name='VCR OSD MONO',
    align="center",
    font_size=36,
    width=window.width,
    x=window.width//2, y=window.height//2 - 333,
    anchor_x='center', anchor_y='center',
    multiline=True,
    batch=batch
)
last_time = time.perf_counter()
frames = 0
fps = 60
moddedTime = 0
deltaTime = 0.0166666667
@window.event
def on_draw():
    global last_time, frames, fps, moddedTime, panel, button
    pyglet.clock.tick()
    window.clear()
    frames += 1
    now = time.perf_counter()
    deltaTime = now-last_time
    fps = 1/deltaTime
    last_time = now
    fps_label.text = f'FPS: {fps}'
    image = pyglet.resource.image('Capcut-logo (1)-White.png')
    image.blit(
        x=(window.width-160)//2,
        y=(window.height+777)//2 + math.sin(now*10)*20,
        width=160,
        height=125.66666666666666666667
    )
    moddedTime -= deltaTime
    panel = GlassPanel((window.width-800)//2, 180, 800, 260, batch)
    label1.width=window.width
    label1.x=window.width//2
    label1.y=window.height//2 + 160
    label2.x=window.width//2
    label2.y=window.height//2 - 100
    label2.color=(255, 255, 255, constrain(math.floor(moddedTime*51.2),0,255) )
    label3.x=window.width//2
    label3.y=window.height//2 - 333
    button = Button("Start", (window.width-200)//2, 240, 200, 50, batch, on_button)
    button.update(window._mouse_x, window._mouse_y, deltaTime)
    batch.draw()

@window.event
def on_key_press(symbol, modifiers):
    global moddedTime
    if symbol == key.SPACE:
        modCapCut()
        moddedTime = 7.5
        print('Modding Complete!')
@window.event
def on_mouse_press(x, y, button_mouse, modifiers):
    if button_mouse == mouse.LEFT:
        print('The left mouse button was pressed.')
        button.click(x, y)
    if button_mouse == mouse.MIDDLE:
        print('The middle mouse button was pressed.')
    if button_mouse == mouse.RIGHT:
        print('The right mouse button was pressed.')

MusPlayer = pyglet.media.Player()
music = pyglet.resource.media('kasper_100 - Physics geam 0.7.2v - Quantum (HQ).wav')
MusPlayer.queue(music) 
MusPlayer.loop = True
MusPlayer.play()
window.set_visible()
pyglet.app.run()