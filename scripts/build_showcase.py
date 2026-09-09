"""Rebuild frame-synchronous Figure 7-style videos from the original media.
Requires pillow, numpy, imageio-ffmpeg. Run from any directory.
"""
from pathlib import Path
import concurrent.futures, json, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'homepage/public/assets/showcase'
WORK = ROOT / 'homepage/work/showcase'
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
OUT.mkdir(parents=True, exist_ok=True)
WORK.mkdir(parents=True, exist_ok=True)
FRAMES = 477
FPS = 16

# Same ray convention verified against the rendered videos in Figure 7:
# horizontal FOV; yaw positive right; pitch positive down; ERP center longitude 0.
def boundary(yaw, pitch, hfov):
    y, t = math.radians(yaw), -math.radians(pitch)
    f = math.tan(math.radians(hfov) / 2)
    v = f * 9 / 16
    q = np.linspace(0, 1, 65)
    x = np.concatenate([-f + 2*f*q, np.full(65, f), f - 2*f*q, np.full(65, -f)])
    z = np.concatenate([np.full(65, v), v - 2*v*q, np.full(65, -v), -v + 2*v*q])
    X = x*math.cos(y) - z*math.sin(y)*math.sin(t) + math.sin(y)*math.cos(t)
    Y = z*math.cos(t) + math.sin(t)
    Z = -x*math.sin(y) - z*math.cos(y)*math.sin(t) + math.cos(y)*math.cos(t)
    return np.stack([np.arctan2(X, Z)/(2*math.pi)+.5, .5-np.arcsin(Y/np.sqrt(X*X+Y*Y+Z*Z))/math.pi], axis=1)

def segments(points, w, h):
    result = []
    for (ax, ay), (bx, by) in zip(points[:-1], points[1:]):
        if bx-ax > .5: bx -= 1
        elif bx-ax < -.5: bx += 1
        for shift in (-1, 0, 1):
            x1, x2, y1, y2 = ax+shift, bx+shift, ay, by
            if max(x1, x2) < 0 or min(x1, x2) > 1: continue
            if x1 < 0 or x1 > 1:
                b = 0 if x1 < 0 else 1
                y1 += (b-x1)/(x2-x1)*(y2-y1); x1 = b
            if x2 < 0 or x2 > 1:
                b = 0 if x2 < 0 else 1
                y2 = y1+(b-x1)/(x2-x1)*(y2-y1); x2 = b
            result.append([(x1*w, y1*h), (x2*w, y2*h)])
    return result

def metadata(path):
    stream = imageio_ffmpeg.read_frames(str(path), pix_fmt='rgb24')
    try: return next(stream)
    finally: stream.close()

def build(row):
    ident = row['row'] + 1
    refined = Path(row['source'])
    traj = refined.parents[1]
    scene = traj.parent
    panorama = scene/'panorama_encode/input_panorama_roundtrip.mp4'
    rendered = traj/'stage2/renderer_low.mp4'
    viewpath = traj/'renderer/viewport.json'
    viewport = json.loads(viewpath.read_text())
    for key in ['yaw_deg', 'pitch_deg', 'fov_deg']: assert len(viewport[key]) == FRAMES
    for path in [panorama, rendered, refined]:
        m = metadata(path)
        assert abs(m['fps']-FPS) < .001, (path, m)
        count, seconds = imageio_ffmpeg.count_frames_and_secs(str(path))
        assert count == FRAMES, (path, count)
    print(f"{ident}: verified 477 aligned source frames", flush=True)
    annotated = WORK/f'pano-{ident}.mp4'
    reader = imageio_ffmpeg.read_frames(str(panorama), pix_fmt='rgb24')
    meta = next(reader)
    w,h = meta['size']
    writer = imageio_ffmpeg.write_frames(str(annotated), (w,h), fps=FPS, codec='libx264', macro_block_size=1, output_params=['-crf','16','-preset','fast','-threads','2'])
    writer.send(None)
    count = 0
    try:
        for n,frame in enumerate(reader):
            im = Image.frombytes('RGB',(w,h),frame)
            d = ImageDraw.Draw(im)
            lines = segments(boundary(viewport['yaw_deg'][n],viewport['pitch_deg'][n],viewport['fov_deg'][n]),w,h)
            for color,width in [('white',4),('#f22626',2)]:
                for line in lines: d.line(line,fill=color,width=width)
            writer.send(im.tobytes()); count += 1
    finally:
        writer.close(); reader.close()
    assert count == FRAMES
    # Preserve every panel's complete field of view and aspect ratio.
    # Refined remains at its native 1024 x 576 display dimensions.
    bg = Image.new('RGB',(2048,1696),'#14141a')
    draw = ImageDraw.Draw(bg)
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',26)
    draw.text((24,10),'01  PANORAMA',font=font,fill='#eeeaf0')
    draw.text((1410,10),'Red outline: rendered field of view',font=font,fill='#efa4a4')
    draw.text((24,1082),'02  RENDERED',font=font,fill='#d0cbd4')
    draw.text((1048,1082),'03  REFINED',font=font,fill='#efb098')
    # Each worker writes its own identical background to avoid shared-file races.
    label = WORK/f'labels-{ident}.png'; bg.save(label)
    target = OUT/f'comparison-{ident}.mp4'
    filters = '[0:v]scale=2048:1024[p];[1:v]scale=1024:576[r];[3:v][p]overlay=0:48:shortest=1[b];[b][r]overlay=0:1120:shortest=1[c];[c][2:v]overlay=1024:1120:shortest=1,format=yuv420p[out]'
    args = [FFMPEG,'-v','error','-y','-threads','2','-i',str(annotated),'-i',str(rendered),'-i',str(refined),'-loop','1','-framerate',str(FPS),'-i',str(label),'-filter_complex_threads','1','-filter_complex',filters,'-map','[out]','-an','-frames:v',str(FRAMES),'-r',str(FPS),'-c:v','libx264','-threads','2','-preset','fast','-crf','20','-movflags','+faststart',str(target)]
    subprocess.run(args,check=True)
    subprocess.run([FFMPEG,'-v','error','-y','-i',str(target),'-frames:v','1',str(OUT/f'comparison-{ident}.webp')],check=True)
    final_count, duration = imageio_ffmpeg.count_frames_and_secs(str(target))
    assert final_count == FRAMES
    assert metadata(target)['size'] == (2048,1696)
    # Contact frames for checking moving FOV, seams, and stage correspondence.
    subprocess.run([FFMPEG,'-v','error','-y','-i',str(target),'-vf',r'select=eq(n\,0)+eq(n\,160)+eq(n\,320)+eq(n\,476),scale=512:424','-fps_mode','vfr',str(WORK/f'check-{ident}-%02d.png')],check=True)
    record = {'id':ident,'title':row['title'],'panorama':str(panorama.relative_to(ROOT)), 'rendered':str(rendered.relative_to(ROOT)), 'refined':str(refined.relative_to(ROOT)), 'viewport':str(viewpath.relative_to(ROOT)), 'frames':final_count,'fps':FPS,'duration':duration,'last_frame_time':(FRAMES-1)/FPS,'output':str(target.relative_to(ROOT))}
    print(f"{ident}: completed, {target.stat().st_size/1e6:.1f} MB",flush=True)
    return record

if __name__ == '__main__':
    rows = [x for x in json.loads((ROOT/'figures/figure6_wan50/sources.json').read_text()) if x['col'] == 0]
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool: records = list(pool.map(build,rows))
    (OUT/'sources.json').write_text(json.dumps(records,indent=2)+'\n')
    sheet=Image.new('RGB',(512*4,424*6),'#14141a')
    for i in range(6):
        for j in range(4): sheet.paste(Image.open(WORK/f'check-{i+1}-{j+1:02d}.png'),(j*512,i*424))
    sheet.save(WORK/'contact-sheet.jpg',quality=90)
    print('All six comparison videos verified.',flush=True)
