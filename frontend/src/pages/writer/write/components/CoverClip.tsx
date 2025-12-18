// 封面裁剪

import { useEffect, useRef } from "react";

function RenderOverlayCanvas() {
  const crop = { x: 50, y: 50, w: 200, h: 200 };
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleSize = 10;

  let overlayCtx: CanvasRenderingContext2D | null = null;
  const init = async () => {
    overlayCtx = overlayCanvasRef.current!.getContext('2d');
  }

  type IHandleName = 'nw' | 'ne' | 'se' | 'sw'

  /** 获取手柄的位置 */
  function getHandles(): Array<{
    name: IHandleName;
    x: number;
    y: number;
  }> {
    const { x, y, w, h } = crop;
    return [
      { name: 'nw', x, y },
      { name: 'ne', x: x + w, y },
      { name: 'se', x: x + w, y: y + h },
      { name: 'sw', x, y: y + h },
    ];
  }



  /** 设置鼠标形状 */
  function setCursor(mx: number, my: number) {
    for (const h of getHandles()) {
      if (Math.abs(mx - h.x) < handleSize && Math.abs(my - h.y) < handleSize) {
        const cursors: Record<IHandleName, string> = {
          nw: 'nwse-resize', se: 'nwse-resize',
          ne: 'nesw-resize', sw: 'nesw-resize',
        };
        overlayCanvasRef.current!.style.cursor = cursors[h.name];
        return h.name;
      }
    }
    if (mx > crop.x && mx < crop.x + crop.w && my > crop.y && my < crop.y + crop.h) {
      overlayCanvasRef.current!.style.cursor = 'move';
      return 'move';
    }
    overlayCanvasRef.current!.style.cursor = 'default';
    return null;
  }


  let startX: number = 0;
  let startY: number = 0;
  let dragging: boolean;
  let resizing: string | null = null;
  function handleMouseDown(e: MouseEvent) {
    const rect = overlayCanvasRef.current!.getBoundingClientRect();

    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    resizing = setCursor(startX, startY);
    if (resizing) {
      dragging = true;
    }
  }


  function handleMouseMove(e: MouseEvent) {
    const rect = overlayCanvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragging) {
      if (resizing === 'move') {
        moveCrop(mx, my);
      } else {
        resizeCrop(mx, my);
      }
      drawOverlay();
    } else {
      setCursor(mx, my);
    }
  }

  function handleMouseUp() {
    dragging = false;
  }
  function handleMouseLeave() {
    dragging = false;
  }
  function moveCrop(mx: number, my: number) {
    const dx = mx - startX;
    const dy = my - startY;
    crop.x = Math.min(Math.max(0, crop.x + dx), overlayCanvasRef.current!.width - crop.w);
    crop.y = Math.min(Math.max(0, crop.y + dy), overlayCanvasRef.current!.height - crop.h);
    startX = mx;
    startY = my;
  }

  function resizeCrop(mx: number, my: number) {
    const dx = mx - startX;
    const dy = my - startY;
    const old = { ...crop };

    switch (resizing) {
      case 'nw': crop.x += dx; crop.y += dy; crop.w -= dx; crop.h -= dy; break;
      case 'ne': crop.y += dy; crop.w += dx; crop.h -= dy; break;
      case 'sw': crop.x += dx; crop.w -= dx; crop.h += dy; break;
      case 'se': crop.w += dx; crop.h += dy; break;
    }

    const aspectRatio = 4 / 3;
    const ratio = crop.w / crop.h;
    if (ratio > aspectRatio) crop.w = crop.h * aspectRatio;
    else crop.h = crop.w / aspectRatio;


    // 限制范围
    if (crop.x < 0) crop.x = 0;
    if (crop.y < 0) crop.y = 0;
    if (crop.x + crop.w > overlayCanvasRef.current!.width) crop.w = overlayCanvasRef.current!.width - crop.x;
    if (crop.y + crop.h > overlayCanvasRef.current!.height) crop.h = overlayCanvasRef.current!.height - crop.y;

    startX = mx;
    startY = my;

    if (crop.w < 20 || crop.h < 20) Object.assign(crop, old);
  }


  const drawOverlay = async () => {
    overlayCtx!.clearRect(0, 0, overlayCanvasRef.current!.width, overlayCanvasRef.current!.height);

    // 灰色蒙层
    overlayCtx!.fillStyle = 'rgba(0,0,0,0.5)';
    overlayCtx!.fillRect(0, 0, overlayCanvasRef.current!.width, overlayCanvasRef.current!.height);

    // 清除裁剪区域（透明）
    overlayCtx!.clearRect(crop.x, crop.y, crop.w, crop.h);

    // 绘制橙色边框
    overlayCtx!.strokeStyle = '#ff6600';
    overlayCtx!.lineWidth = 2;
    overlayCtx!.strokeRect(crop.x, crop.y, crop.w, crop.h);

    // 绘制手柄
    // 绘制四角的“尖角”效果
    const len = 16; // 角线长度
    overlayCtx!.lineWidth = 3;
    overlayCtx!.strokeStyle = 'white';

    overlayCtx!.beginPath();

    // 左上角 ↖
    overlayCtx!.moveTo(crop.x, crop.y + len);
    overlayCtx!.lineTo(crop.x, crop.y);
    overlayCtx!.lineTo(crop.x + len, crop.y);

    // 右上角 ↗
    overlayCtx!.moveTo(crop.x + crop.w - len, crop.y);
    overlayCtx!.lineTo(crop.x + crop.w, crop.y);
    overlayCtx!.lineTo(crop.x + crop.w, crop.y + len);

    // 右下角 ↘
    overlayCtx!.moveTo(crop.x + crop.w, crop.y + crop.h - len);
    overlayCtx!.lineTo(crop.x + crop.w, crop.y + crop.h);
    overlayCtx!.lineTo(crop.x + crop.w - len, crop.y + crop.h);

    // 左下角 ↙
    overlayCtx!.moveTo(crop.x + len, crop.y + crop.h);
    overlayCtx!.lineTo(crop.x, crop.y + crop.h);
    overlayCtx!.lineTo(crop.x, crop.y + crop.h - len);

    overlayCtx!.stroke();
  }

  useEffect(() => {
    init();

    const el = overlayCanvasRef.current!;

    el!.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    return (() => {
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mousedown', handleMouseDown);
    })
  }, []);

  return (
    <canvas id="imageCanvas" ref={overlayCanvasRef}></canvas>
  )
}


function RenderImageCanvas() {
  const ref = useRef(null);
  return (
    <canvas ref={ref}></canvas>
  )
}

const CoverClip: React.FC = ()=> {
  return (
    <div>
      <div>
        <RenderImageCanvas></RenderImageCanvas>
        <RenderOverlayCanvas></RenderOverlayCanvas>
      </div>

    </div>
  )
}

export default CoverClip;
