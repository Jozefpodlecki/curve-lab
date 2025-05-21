import { useEffect, useRef, useState } from "react";

const Butterfly: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [scale, setScale] = useState(100);
    const [points, setPoints] = useState(10000);

    const drawButterfly = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        ctx.translate(width / 2, height / 2);

        ctx.beginPath();
        for (let i = 0; i < points; i++) {
            // https://en.wikipedia.org/wiki/Butterfly_curve_(transcendental)
            const t = (12 * Math.PI * i) / points;
            const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5);
            const x = Math.sin(t) * r * scale;
            const y = Math.cos(t) * r * scale;
            if (i === 0) ctx.moveTo(x, -y);
            else ctx.lineTo(x, -y);
        }

        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.resetTransform();
    };

    useEffect(() => {
        drawButterfly();
    }, [scale, points]);

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="p-4 flex gap-6 items-center border-b border-gray-700">
                <label className="flex items-center gap-2 text-sm">
                    Scale:
                     <input
                        type="range"
                        min="50"
                        max="200"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-32 accent-gray-400 bg-gray-700 rounded"
                    />
                    {scale}
                </label>
                <label className="flex items-center gap-2 text-sm">
                    Points:
                    <input
                        type="range"
                        min="1000"
                        max="20000"
                        step="1000"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        className="w-40 accent-gray-400 bg-gray-700 rounded"
                    />
                    {points}
                </label>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
        </div>
    );
};

export default Butterfly;
