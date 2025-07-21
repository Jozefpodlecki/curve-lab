import React, { useEffect, useRef } from "react";

export type DrawFunction<T extends CanvasRenderingContext2D | WebGLRenderingContext | null> = (
  ctx: T,
  width: number,
  height: number
) => void;

interface Props<T extends CanvasRenderingContext2D | WebGLRenderingContext | null> {
    onDraw: DrawFunction<T>;
    className?: string;
    contextType: "2d" | "webgl";
}

const CanvasWrapper = <T extends CanvasRenderingContext2D | WebGLRenderingContext | null>({
  onDraw,
  className,
  contextType,
}: Props<T>) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }
        
        const ctx = canvas.getContext(contextType);
        
        if (!ctx) {
            return;
        }

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvas.width = width;
        canvas.height = height;

        onDraw(ctx as any, width, height);
  }, [onDraw]);

  return <canvas ref={canvasRef} className={className} />;
};

export default CanvasWrapper;
