from setuptools import setup

APP = ["main.py"]
OPTIONS = {
    "argv_emulation": True,
    "packages": ["pyglet"],
    "resources": ["assets"],
}
setup(
    app=APP,
    options={"py2app": OPTIONS},
    setup_requires=["py2app"],
)