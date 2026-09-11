# AlayaVista homepage

论文项目主页，参考 Evoke 的深色视觉风格，使用论文中的内容、图表和本地视频素材。

## 本地开发

需要 Node.js >= 22.13 和 pnpm。

```sh
pnpm install
pnpm dev
```

## 生产构建

```sh
pnpm build
```

- `app/page.tsx`：主页内容、作者、方法、视频展示、数据集和结果表。
- `app/globals.css`：主题、布局和移动端样式。
- `app/site-interactions.tsx`：背景视频播放/暂停、BibTeX 复制。
- `public/assets/`：网页压缩视频、WebP 图片和论文 PDF。

所有数据来自 2026-09-09 版本的 AlayaVista.pdf，结果表按论文 Table 1 展示。Code 链接指向 https://github.com/AlayaLab/AlayaVista，BibTeX URL 使用论文提供的链接。展示视频来自用户提供的本地素材，不代表浏览器内实时生成。

六个样例的原始来源在上级 `figures/figure6_wan50/sources.json` 中；`scene-1` 至 `scene-6` 对应该文件的第 1 至 6 行场景。当前背景来源见下方说明。图表源自上级 `figures/pdf/`。

网页支持小屏幕、键盘焦点、减少动态效果偏好，以及原生视频控件。无外部字体或媒体依赖。


## Figure 7 视频对比

Showcase 的六个样例使用同一场景和轨迹对应的三路完整视频，合成单个 MP4，保证播放、暂停、拖动和全屏时逐帧同步。

- 全景：`panorama_encode/input_panorama_roundtrip.mp4`
- Rendered：`stage2/renderer_low.mp4`
- Refined：`stage2/wan50.mp4`
- 视野轮廓：`renderer/viewport.json` 的逐帧 yaw、pitch、水平 FOV，按 16:9 针孔视野投影至 ERP；pitch 正方向向下，跨接缝分段。

全景在上，Rendered / Refined 在下方并列，均保留完整视野与宽高比。Refined 在合成视频中保留 1024×576 原生显示尺寸；未进行锐化、调色或补帧。477 帧、16 fps，末帧时间 29.75 秒。

素材目录：`public/assets/showcase/`，其中 `sources.json` 记录每条视频的来源和校验信息。

可使用 Python（需要 pillow、numpy、imageio-ffmpeg）运行 `scripts/build_showcase.py` 重建素材。生成所需的原始 `video samples` 和 `figures` 文件夹位于项目上一级。临时文件写入已忽略的 `work/showcase/`。仅本地预览，不自动发布。


## 更多 Refined 样例

`app/refined-gallery.tsx` 展示来自 `/Users/admin/Downloads/demo/sample` 的全部 16 段视频，每段约 20 秒。按文件名排序，分为三行循环展示；数量、行分配和时长均读取 `app/refined-samples.json`。悬停或键盘聚焦暂停该行滚动，点击卡片播放完整视频。

运行 `python3 scripts/build_refined_gallery.py /path/to/demo/sample` 可重建网页素材，需要 ffmpeg、ffprobe 和 Pillow。保留源视频 1024×576 分辨率、完整帧数和时长，编码为适合网页播放的 H.264 MP4。封面为各视频首帧，素材及校验记录位于 `public/assets/demos/`。

## 当前背景与 Showcase

首页背景使用上级 `back.mov`，转为 1920×1080 静音 H.264 MP4（`public/assets/hero-background.mp4`），保留完整时长并启用 faststart，封面取首帧。

Showcase 展示原始第 2、4、6 条：Misty mountain trail、Flower meadow、Tidal beach。页面依次编号 01–03，沿用对应的 `comparison-2`、`comparison-4`、`comparison-6` 三路同步视频。

## GitHub Pages

运行 `pnpm build:pages` 生成 `dist/pages/`。独立静态入口复用主页与交互组件，资源路径适配 `/AlayaVista/`，本地开发仍使用 `pnpm dev`。

仓库管理员需在 Settings → Pages 中将 Source 设置为 GitHub Actions。`.github/workflows/pages.yml` 会在 main 分支更新时自动构建和部署，也可以手动运行。私有组织仓库需要支持 Pages 的 GitHub 套餐。

## 介绍视频

作者信息下方嵌入 90 秒、1920×1080 的带音乐介绍视频，首页 “Watch video” 按钮直达播放器。使用原生播放、音量和全屏控件，点击后播放，默认不预加载视频。

`public/assets/AlayaVista_intro_homepage_music.mp4` 为上级 `output/intro_video/homepage_20260911/AlayaVista_intro_homepage_music.mp4` 的原文件副本（H.264 + AAC）；`intro-video-poster.webp` 为第 2 秒画面。
