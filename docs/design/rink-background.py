"""Renders a skated hockey rink with the Ice Pak crest at centre ice. One image for each Theme.
   Blender -b --factory-startup --python rink.py -- <home|away|third> <out.png> [samples]"""
import bpy, bmesh, math, sys, os
import numpy as np
from mathutils import Vector
variant, out = sys.argv[sys.argv.index("--") + 1], sys.argv[sys.argv.index("--") + 2]
samples = int(sys.argv[sys.argv.index("--") + 3]) if len(sys.argv) > sys.argv.index("--") + 3 else 160
HERE = os.path.dirname(os.path.abspath(__file__))
V = {
  "home":  dict(ice=(0.035, 0.055, 0.10), blue=(0.02, 0.10, 0.50), red=(0.55, 0.02, 0.03), scratch=(0.78, 0.87, 1.0), light=75, tint=(0.72, 0.85, 1.0), world=(0.002, 0.004, 0.010),
                cam=(-6.2, -7.6, 1.45), aim=(0.9, 0.3, 0.0), lens=27, fstop=2.4, crest="crest-navy.png", white=False, rot=-0.69, kw=0.62),
  "away":  dict(ice=(0.30, 0.36, 0.45), blue=(0.02, 0.12, 0.60), red=(0.70, 0.03, 0.04), scratch=(1.0, 1.0, 1.0), light=150, tint=(1.0, 1.0, 1.0), world=(0.03, 0.035, 0.05),
                cam=(0.0, -8.6, 0.95), aim=(0.0, 4.0, 0.1), lens=21, fstop=4.0, crest="crest-navy.png", white=False, rot=0.0, kw=0.62),
  "third": dict(ice=(0.006, 0.006, 0.007), blue=(0.45, 0.45, 0.45), red=(0.60, 0.015, 0.015), scratch=(0.9, 0.9, 0.9), light=80, tint=(1.0, 0.96, 0.93), world=(0.001, 0.001, 0.001),
                cam=(6.4, -7.4, 1.45), aim=(-0.9, 0.3, 0.0), lens=27, fstop=2.4, crest="crest-third.png", white=True, rot=0.71, kw=0.62),
}[variant]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
L, W = 61.0, 26.0

# --- scratch map: blade arcs and short scuffs, drawn with numpy
def scratch_map(n=2048, seed=57):
    rng = np.random.default_rng(seed); img = np.zeros((n, n), np.float32)
    for _ in range(230):
        r = rng.uniform(0.05, 0.9) * n; a0 = rng.uniform(0, 6.283); span = rng.uniform(0.2, 1.0)
        cx, cy = rng.uniform(0, n, 2); w = rng.uniform(0.12, 0.9) ** 1.5
        t = np.linspace(a0 - span / 2, a0 + span / 2, int(r * span * 1.6) + 8)
        for dr in ([0.0] if rng.random() < 0.5 else [0.0, rng.uniform(1.5, 3.5)]):
            x = (cx + np.cos(t) * (r + dr)).astype(int) % n; y = (cy + np.sin(t) * (r + dr)).astype(int) % n
            np.add.at(img, (y, x), w)
            if rng.random() < 0.12: np.add.at(img, ((y + 1) % n, x), w * 0.8)
    for _ in range(420):
        x0, y0 = rng.uniform(0, n, 2); a = rng.uniform(0, 3.1416); ln = rng.uniform(10, 120); w = rng.uniform(0.08, 0.5)
        t = np.linspace(0, ln, int(ln * 1.5))
        np.add.at(img, ((y0 + np.sin(a) * t).astype(int) % n, (x0 + np.cos(a) * t).astype(int) % n), w)
    img = np.clip(img, 0, 1)
    img = (img * 0.6 + 0.1 * (np.roll(img, 1, 0) + np.roll(img, -1, 0) + np.roll(img, 1, 1) + np.roll(img, -1, 1)))
    im = bpy.data.images.new("scratch", n, n, alpha=False)
    px = np.ones((n, n, 4), np.float32); px[..., 0] = px[..., 1] = px[..., 2] = np.clip(img, 0, 1)
    im.pixels.foreach_set(px.ravel()); im.update()
    path = os.path.join(HERE, "scratch.png"); im.filepath_raw = path; im.file_format = "PNG"; im.save()
    print("scratch mean", float(img.mean()), "max", float(img.max()))
    im2 = bpy.data.images.load(path); im2.colorspace_settings.name = "Non-Color"
    return im2
SCR = scratch_map()

def material(name, color=None, image=None, white=False, rough=0.05, kw=0.5):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nd, lk = nt.nodes, nt.links
    bsdf = nd["Principled BSDF"]
    geo = nd.new("ShaderNodeNewGeometry")
    def layer(scale, rot):
        mp = nd.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (scale, scale, scale); mp.inputs["Rotation"].default_value = (0, 0, rot)
        tx = nd.new("ShaderNodeTexImage"); tx.image = SCR; lk.new(geo.outputs["Position"], mp.inputs["Vector"]); lk.new(mp.outputs["Vector"], tx.inputs["Vector"])
        return tx.outputs["Color"]
    add = nd.new("ShaderNodeMath"); add.operation = "ADD"; add.use_clamp = True
    lk.new(layer(1 / 4.2, 0.0), add.inputs[0]); lk.new(layer(1 / 1.9, 1.1), add.inputs[1])
    noise = nd.new("ShaderNodeTexNoise"); noise.inputs["Scale"].default_value = 0.35; noise.inputs["Detail"].default_value = 3
    lk.new(geo.outputs["Position"], noise.inputs["Vector"])
    mix = nd.new("ShaderNodeMix"); mix.data_type = "RGBA"; mix.inputs[7].default_value = (*V["scratch"], 1)
    # frost: wide soft patches where the ice is more worn
    fr = nd.new("ShaderNodeMath"); fr.operation = "POWER"; fr.inputs[1].default_value = 5.0; lk.new(noise.outputs["Fac"], fr.inputs[0])
    k = nd.new("ShaderNodeMath"); k.operation = "MULTIPLY_ADD"; k.inputs[1].default_value = kw; lk.new(add.outputs[0], k.inputs[0]); lk.new(fr.outputs[0], k.inputs[2]); k.use_clamp = True
    lk.new(k.outputs[0], mix.inputs[0])
    if image:
        tx = nd.new("ShaderNodeTexImage"); tx.image = bpy.data.images.load(os.path.join(HERE, image)); tx.extension = "CLIP"
        if white:  # a black drawing on white: the dark parts become white paint
            inv = nd.new("ShaderNodeMath"); inv.operation = "SUBTRACT"; inv.inputs[0].default_value = 1.0
            bw = nd.new("ShaderNodeRGBToBW"); lk.new(tx.outputs["Color"], bw.inputs[0]); lk.new(bw.outputs[0], inv.inputs[1])
            mix.inputs[6].default_value = (0.85, 0.85, 0.85, 1); lk.new(inv.outputs[0], bsdf.inputs["Alpha"])
        else:
            lk.new(tx.outputs["Color"], mix.inputs[6]); lk.new(tx.outputs["Alpha"], bsdf.inputs["Alpha"])
    else:
        mix.inputs[6].default_value = (*color, 1)
    lk.new(mix.outputs[2], bsdf.inputs["Base Color"])
    r1 = nd.new("ShaderNodeMath"); r1.operation = "MULTIPLY_ADD"; r1.inputs[1].default_value = 0.55; r1.inputs[2].default_value = rough; lk.new(add.outputs[0], r1.inputs[0])
    r2 = nd.new("ShaderNodeMath"); r2.operation = "MULTIPLY_ADD"; r2.inputs[1].default_value = 0.10; lk.new(noise.outputs["Fac"], r2.inputs[0]); lk.new(r1.outputs[0], r2.inputs[2])
    lk.new(r2.outputs[0], bsdf.inputs["Roughness"])
    return m

def mesh(name, verts, faces, mat, uvs=None):
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.materials.append(mat)
    if uvs:
        uv = me.uv_layers.new()
        for i, l in enumerate(me.loops): uv.data[i].uv = uvs[l.vertex_index]
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob); return ob
def rect(name, x0, y0, x1, y1, z, mat): return mesh(name, [(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)], [(0, 1, 2, 3)], mat)
def ring(name, cx, cy, r, w, z, mat, n=96):
    vs, fs = [], []
    for i in range(n):
        a = 2 * math.pi * i / n
        vs += [(cx + math.cos(a) * (r - w / 2), cy + math.sin(a) * (r - w / 2), z), (cx + math.cos(a) * (r + w / 2), cy + math.sin(a) * (r + w / 2), z)]
        j = (i + 1) % n; fs.append((2 * i, 2 * i + 1, 2 * j + 1, 2 * j))
    return mesh(name, vs, fs, mat)
def disc(name, cx, cy, r, z, mat, n=48):
    vs = [(cx, cy, z)] + [(cx + math.cos(2 * math.pi * i / n) * r, cy + math.sin(2 * math.pi * i / n) * r, z) for i in range(n)]
    return mesh(name, vs, [(0, 1 + i, 1 + (i + 1) % n) for i in range(n)], mat)
def box(name, x0, y0, z0, x1, y1, z1, mat):
    vs = [(x, y, z) for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)]
    return mesh(name, vs, [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)], mat)

ICE = material("ice", V["ice"], rough=0.04, kw=V["kw"])
BLUE = material("blue", V["blue"], rough=0.06, kw=0.55); RED = material("red", V["red"], rough=0.06, kw=0.55)
rect("ice", -L / 2, -W / 2, L / 2, W / 2, 0, ICE)
rect("centre", -0.15, -W / 2, 0.15, W / 2, 0.001, RED)
for x in (-7.62, 7.62): rect("blueline", x - 0.15, -W / 2, x + 0.15, W / 2, 0.001, BLUE)
for x in (-27.1, 27.1): rect("goal", x - 0.03, -W / 2, x + 0.03, W / 2, 0.001, RED)
ring("circle", 0, 0, 4.57, 0.11, 0.0015, BLUE)
for x in (-21.0, 21.0):
    for y in (-6.7, 6.7): ring("fo", x, y, 4.57, 0.05, 0.001, RED); disc("fod", x, y, 0.3, 0.0012, RED)
for x in (-6.1, 6.1):
    for y in (-6.7, 6.7): disc("nd", x, y, 0.3, 0.0012, RED)
# crest at centre ice, 7.4 m wide, turned to the camera side
cw = 7.4; ch = cw * (5256 / 5000 if not V["white"] else 1.0)
CR = material("crest", image=V["crest"], white=V["white"], rough=0.06, kw=0.5)
c = mesh("crest", [(-cw / 2, -ch / 2, 0.002), (cw / 2, -ch / 2, 0.002), (cw / 2, ch / 2, 0.002), (-cw / 2, ch / 2, 0.002)], [(0, 1, 2, 3)], CR, uvs=[(0, 0), (1, 0), (1, 1), (0, 1)])
c.rotation_euler[2] = V["rot"]

# boards, kick plate, and glass posts
def plain(name, col, rough=0.5, emit=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough; return m
BW = plain("boards", (0.75, 0.77, 0.8) if variant != "third" else (0.05, 0.05, 0.05), 0.35); KP = plain("kick", (0.8, 0.55, 0.05) if variant != "third" else (0.5, 0.02, 0.02), 0.4)
PO = plain("post", (0.5, 0.52, 0.55), 0.3); DK = plain("dark", (0.01, 0.012, 0.02), 0.9)
for (x0, y0, x1, y1) in [(-L / 2, W / 2, L / 2, W / 2 + 0.12), (-L / 2, -W / 2 - 0.12, L / 2, -W / 2), (-L / 2 - 0.12, -W / 2, -L / 2, W / 2), (L / 2, -W / 2, L / 2 + 0.12, W / 2)]:
    box("board", x0, y0, 0, x1, y1, 1.07, BW)
box("kick", -L / 2, W / 2 - 0.01, 0, L / 2, W / 2, 0.2, KP); box("kick", -L / 2, -W / 2, 0, L / 2, -W / 2 + 0.01, 0.2, KP)
for i in range(int(L / 2.4) + 1):
    x = -L / 2 + i * 2.4; box("post", x - 0.03, W / 2 + 0.03, 1.07, x + 0.03, W / 2 + 0.09, 2.9, PO)
box("redmark", -0.15, W / 2 - 0.012, 0.2, 0.15, W / 2, 1.07, plain("rm", V["red"], 0.4))
for x in (-7.62, 7.62): box("bluemark", x - 0.15, W / 2 - 0.012, 0.2, x + 0.15, W / 2, 1.07, plain("bm", V["blue"], 0.4))
box("stands", -L, W / 2 + 3, 0, L, W / 2 + 3.2, 14, DK); box("stands2", -L, -W / 2 - 3.2, 0, L, -W / 2 - 3, 14, DK)

# lights: rows of bright panels over the ice
em = bpy.data.materials.new("lamp"); em.use_nodes = True; nt = em.node_tree; nt.nodes.clear()
e = nt.nodes.new("ShaderNodeEmission"); e.inputs["Color"].default_value = (*V["tint"], 1); e.inputs["Strength"].default_value = V["light"]
o = nt.nodes.new("ShaderNodeOutputMaterial"); nt.links.new(e.outputs[0], o.inputs[0])
for ix in range(-4, 5):
    for iy in (-1.5, -0.5, 0.5, 1.5):
        x, y = ix * 7.0, iy * 7.2
        mesh("lamp", [(x - 0.9, y - 0.25, 11), (x + 0.9, y - 0.25, 11), (x + 0.9, y + 0.25, 11), (x - 0.9, y + 0.25, 11)], [(3, 2, 1, 0)], em)
w = bpy.data.worlds.new("w"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (*V["world"], 1); sc.world = w

cam = bpy.data.cameras.new("cam"); co = bpy.data.objects.new("cam", cam); sc.collection.objects.link(co); sc.camera = co
co.location = V["cam"]; d = Vector(V["aim"]) - Vector(V["cam"]); co.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
cam.lens = V["lens"]; cam.dof.use_dof = True; cam.dof.focus_distance = (Vector((0, 0, 0)) - Vector(V["cam"])).length * 0.8; cam.dof.aperture_fstop = V["fstop"]; cam.clip_end = 300

sc.render.engine = "CYCLES"; sc.cycles.samples = samples; sc.cycles.use_denoising = True
try:
    p = bpy.context.preferences.addons["cycles"].preferences; p.compute_device_type = "METAL"; p.get_devices()
    for dv in p.devices: dv.use = True
    sc.cycles.device = "GPU"
except Exception as ex: print("GPU not set:", ex)
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080; sc.render.filepath = out; sc.render.image_settings.file_format = "PNG"
sc.view_settings.look = "AgX - Medium High Contrast"
bpy.ops.render.render(write_still=True)
