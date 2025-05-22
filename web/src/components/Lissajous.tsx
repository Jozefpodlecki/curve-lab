import { useEffect, useRef, useState } from "react";

const Lissajous: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [a, setA] = useState(3);
    const [b, setB] = useState(2);
    const [delta, setDelta] = useState(Math.PI / 2);
    const [points, setPoints] = useState(1000);
    const [scale, setScale] = useState(150);

    const drawLissajous = () => {
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
            const t = (2 * Math.PI * i) / points;
            const x = scale * Math.sin(a * t + delta);
            const y = scale * Math.sin(b * t);
            if (i === 0) ctx.moveTo(x, -y);
            else ctx.lineTo(x, -y);
        }

        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.resetTransform();
    };

    useEffect(() => {
        drawLissajous();
    }, [a, b, delta, points, scale]);

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="p-4 flex gap-6 items-center border-b border-gray-700">
                <label className="flex items-center gap-2 text-sm">
                    a:
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={a}
                        onChange={(e) => setA(Number(e.target.value))}
                        className="w-32 accent-gray-400 bg-gray-700 rounded"
                    />
                    {a}
                </label>
                <label className="flex items-center gap-2 text-sm">
                    b:
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={b}
                        onChange={(e) => setB(Number(e.target.value))}
                        className="w-32 accent-gray-400 bg-gray-700 rounded"
                    />
                    {b}
                </label>
                <label className="flex items-center gap-2 text-sm">
                    δ:
                    <input
                        type="range"
                        min="0"
                        max={Math.PI * 2}
                        step="0.01"
                        value={delta}
                        onChange={(e) => setDelta(Number(e.target.value))}
                        className="w-32 accent-gray-400 bg-gray-700 rounded"
                    />
                    {(delta / Math.PI).toFixed(2)}π
                </label>
                <label className="flex items-center gap-2 text-sm">
                    Scale:
                    <input
                        type="range"
                        min="150"
                        max="300"
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
                        min="500"
                        max="5000"
                        step="100"
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

export default Lissajous;
