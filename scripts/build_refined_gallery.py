"""Build the More Results gallery from a directory of demo MP4 files.

Usage: python3 scripts/build_refined_gallery.py /path/to/demo/sample
Requires ffmpeg, ffprobe, and Pillow. Keeps full sequences at source resolution.
"""
from pathlib import Path
import argparse
import concurrent.futures
import hashlib
import io
import json
import subprocess
from PIL import Image

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / 'public/assets/demos'
NAMES = {
    '000': 'Snowy lakeshore', '002': 'Winter forest', '004': 'Sheltered beach',
    '005': 'Country road', '006': 'Harbor boats', '008': 'Historic arcade',
    '009': 'Rural village', '010': 'Sandy coast', '012': 'Bridge at night',
    '014': 'City marina', '015': 'Forest trail', '016': 'Coastal overlook',
    '018': 'Country church', '020': 'Forest at sunset',
    '024': 'Waterfront promenade', '025': 'Wooden village',
}


def probe(path):
    return json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height,nb_frames,duration',
        '-of', 'json', str(path),
    ]))['streams'][0]


def make(item):
    index, source = item
    dest = OUT / source.name
    original = probe(source)
    subprocess.run([
        'ffmpeg', '-v', 'error', '-y', '-i', str(source), '-map', '0:v:0',
        '-an', '-c:v', 'libx264', '-threads', '2', '-crf', '20',
        '-preset', 'fast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(dest),
    ], check=True)
    result = probe(dest)
    for key in ['width', 'height', 'nb_frames']:
        assert result[key] == original[key], (source.name, key, original, result)
    assert abs(float(result['duration']) - float(original['duration'])) < .01
    frame = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', str(dest), '-frames:v', '1',
        '-f', 'image2pipe', '-c:v', 'png', '-',
    ])
    with Image.open(io.BytesIO(frame)) as poster:
        poster.save(dest.with_suffix('.webp'), quality=85)
    code = source.stem.split('_')[1]
    row = {
        'id': index, 'name': NAMES.get(code, f'Scene {code}'),
        'motion': 'Camera rotation', 'duration': round(float(result['duration']), 2),
        'src': f'assets/demos/{dest.name}',
        'poster': f'assets/demos/{dest.stem}.webp',
        'source': source.name, 'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'frames': int(result['nb_frames']), 'width': result['width'], 'height': result['height'],
    }
    print(f"{index}: {source.name}, {row['frames']} frames verified", flush=True)
    return row


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source_dir', type=Path)
    args = parser.parse_args()
    sources = sorted(args.source_dir.glob('*.mp4'))
    if not sources:
        parser.error('No MP4 files found in the source directory')
    OUT.mkdir(parents=True, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        rows = list(pool.map(make, enumerate(sources, 1)))
    (OUT / 'sources.json').write_text(json.dumps(rows, indent=2) + '\n')
    keys = ['id', 'name', 'motion', 'duration', 'src', 'poster']
    (REPO / 'app/refined-samples.json').write_text(
        json.dumps([{k: row[k] for k in keys} for row in rows], indent=2) + '\n')


if __name__ == '__main__':
    main()
