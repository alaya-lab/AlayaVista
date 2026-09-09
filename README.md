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

所有数据来自 2026-09-09 版本的 AlayaVista.pdf，结果表按论文 Table 1 展示。Code 链接指向 https://github.com/alaya-lab/AlayaVista，BibTeX URL 使用论文提供的链接。视频为用户提供的 stage2/wan50.mp4 的网页压缩版本，不代表浏览器内实时生成。

六个样例的原始来源在上级 `figures/figure6_wan50/sources.json` 中；`scene-1` 至 `scene-6` 对应该文件的第 1 至 6 行场景。背景复用第 5 个样例。图表源自上级 `figures/pdf/`。

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

`app/refined-gallery.tsx` 展示 18 条约 30 秒的 Refined 完整视频，三行交错方向慢速循环滚动。悬停或键盘聚焦暂停该行滚动；全局按钮暂停滚动与播放；点击卡片打开可关闭的原生控件播放器。仅加载进入视区的预览，离开视区或切换浏览器标签后暂停。遵循系统减少动态效果偏好。

`scripts/build_refined_gallery.py` 从 18 组原始 `stage2/wan50.mp4` 生成 768×432 网页视频和首帧封面，均为 477 帧、16 fps。来源记录在 `public/assets/refined/sources.json`，页面数据在 `app/refined-samples.json`。
