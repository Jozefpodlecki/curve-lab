import { useEffect, useRef, useState } from "react";

const Fractal: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [iterations, setIterations] = useState(3);

    const drawFractal = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);

        const length = Math.min(width, height) * 0.6;
        const centerX = width / 2;
        const centerY = height / 2;
        const heightOffset = (Math.sqrt(3) / 2) * length;

        const p1 = [centerX - length / 2, centerY + heightOffset / 3];
        const p2 = [centerX + length / 2, centerY + heightOffset / 3];
        const p3 = [centerX, centerY - (2 * heightOffset) / 3];

        ctx.beginPath();
        drawKoch(ctx, p1, p2, iterations);
        drawKoch(ctx, p2, p3, iterations);
        drawKoch(ctx, p3, p1, iterations);
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    };

    const drawKoch = (ctx: CanvasRenderingContext2D, p1: number[], p2: number[], iter: number) => {
        if (iter === 0) {
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
        } else {
            const dx = (p2[0] - p1[0]) / 3;
            const dy = (p2[1] - p1[1]) / 3;

            const a = [p1[0], p1[1]];
            const b = [p1[0] + dx, p1[1] + dy];
            const d = [p1[0] + 2 * dx, p1[1] + 2 * dy];
            const e = [
                b[0] + (dx - Math.sqrt(3) * dy) / 2,
                b[1] + (dy + Math.sqrt(3) * dx) / 2
            ];

            drawKoch(ctx, a, b, iter - 1);
            drawKoch(ctx, b, e, iter - 1);
            drawKoch(ctx, e, d, iter - 1);
            drawKoch(ctx, d, p2, iter - 1);
        }
    };

    useEffect(() => {
        drawFractal();
    }, [iterations]);

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="p-4 flex gap-6 items-center border-b border-gray-700">
                <label className="flex items-center gap-2 text-sm">
                    Iterations:
                    <input
                        type="range"
                        min="0"
                        max="6"
                        value={iterations}
                        onChange={(e) => setIterations(Number(e.target.value))}
                        className="w-40 accent-gray-400 bg-gray-700 rounded"
                    />
                    {iterations}
                </label>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
        </div>
    );
};

export default Fractal;
