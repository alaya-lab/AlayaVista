from pathlib import Path
import json, subprocess, concurrent.futures
from PIL import Image,ImageDraw
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'homepage/public/assets/refined';OUT.mkdir(parents=True,exist_ok=True)
F=imageio_ffmpeg.get_ffmpeg_exe()
SAMPLES=[
('Town square','b8/source_03_demo_0019/traj_01_wander'),
('Misty mountain trail','b12/source_01_demo_0092/traj_01_yaw18'),
('Wooded hillside','b16/source_03_demo_0054/traj_02_yaw18'),
('Flower meadow','b26/source_01_demo_0000/traj_02_yaw18'),
('Seaside promenade','b6/source_04_demo_0109/traj_02_pingpong'),
('Tidal beach','b9/source_04_demo_0041/traj_01_yaw18'),
('Coastal panorama','b17/source_01_demo_0075/traj_01_pingpong'),
('Lakeside beach','b23/source_03_demo_0081/traj_01_zoom_only'),
('Hillside path','b11/source_04_demo_0087/traj_02_zoom_only'),
('Rocky landscape','b3/source_03_demo_0040/traj_01_wander'),
('Sandy shoreline','b7/source_01_demo_0110/traj_01_wander'),
('Wooded hillside','b10/source_03_demo_0054/traj_01_zoom_only'),
('Flower meadow','b20/source_01_demo_0000/traj_02_pan_tilt'),
('Tidal beach','b3/source_04_demo_0041/traj_01_handheld'),
('Town square','b14/source_03_demo_0019/traj_01_pingpong'),
('Misty mountain trail','b24/source_01_demo_0092/traj_02_pan_tilt'),
('Seaside promenade','b6/source_04_demo_0109/traj_01_zoom_only'),
('Coastal panorama','b11/source_01_demo_0075/traj_02_tilt'),
]
def make(item):
 i,(name,src)=item
 source=ROOT/'video samples'/src/'stage2/wan50.mp4'
 dest=OUT/f'refined-{i}.mp4'
 subprocess.run([F,'-v','error','-y','-i',str(source),'-vf','scale=768:432','-an','-c:v','libx264','-threads','2','-crf','23','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart',str(dest)],check=True)
 subprocess.run([F,'-v','error','-y','-ss','0','-i',str(dest),'-frames:v','1',str(OUT/f'refined-{i}.webp')],check=True)
 frames,duration=imageio_ffmpeg.count_frames_and_secs(str(dest));assert frames==477
 motion=src.split('/')[-1].split('_',2)[-1].replace('_',' ').replace('yaw18','Yaw rotation').replace('pingpong','Back-and-forth sweep')
 print(f'{i}: {frames} frames',flush=True)
 return {'id':i,'name':name,'motion':motion,'src':f'/assets/refined/refined-{i}.mp4','poster':f'/assets/refined/refined-{i}.webp','source':str(source.relative_to(ROOT)),'frames':frames,'duration':duration}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: rows=list(pool.map(make,enumerate(SAMPLES,1)))
(OUT/'sources.json').write_text(json.dumps(rows,indent=2)+'\n')
(ROOT/'homepage/app/refined-samples.json').write_text(json.dumps([{k:r[k] for k in ['id','name','motion','src','poster']} for r in rows],indent=2)+'\n')
sheet=Image.new('RGB',(960,200*6),'#14141a');d=ImageDraw.Draw(sheet)
for j,r in enumerate(rows):
 im=Image.open(OUT/f"refined-{r['id']}.webp");im.thumbnail((320,180));x=j%3*320;y=j//3*200;sheet.paste(im,(x,y));d.text((x+4,y+183),str(r['id'])+' '+r['name'],fill='white')
sheet.save(ROOT/'homepage/work/refined/contact.jpg')
