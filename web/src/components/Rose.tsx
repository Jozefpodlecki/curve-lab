// https://mathworld.wolfram.com/RoseCurve.html

import { useEffect, useRef, useState } from "react";

const Rose: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [k, setK] = useState(4);
    const [scale, setScale] = useState(200);
    const [points, setPoints] = useState(2000);
    const [mode, setMode] = useState<"cos" | "sin">("cos");

    const drawRose = () => {
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
        console.log(k);
        for (let i = 0; i <= points; i++) {
            const theta = (2 * Math.PI * i) / points;
            const r = mode === "cos" ? Math.cos(k * theta) : Math.sin(k * theta);
            const x = r * Math.cos(theta) * scale;
            const y = r * Math.sin(theta) * scale;
            // console.log(x,y);
            if (i === 0) ctx.moveTo(x, -y);
            else ctx.lineTo(x, -y);
        }

        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.resetTransform();
    };

    useEffect(() => {
        drawRose();
    }, [k, scale, points, mode]);

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="p-4 flex flex-wrap gap-6 items-center border-b border-gray-700">
               k:
                <input
                    type="number"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={k}
                    onChange={(e) => setK(parseFloat(e.target.value))}
                    className="w-24 bg-gray-700 text-white rounded px-2 py-1"
                />
                <div className="flex gap-1">
                    <button
                        onClick={() => setK(Math.PI)}
                        className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                    >
                        π
                    </button>
                    <button
                        onClick={() => setK(Math.SQRT2)}
                        className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                    >
                        √2
                    </button>
                    <button
                        onClick={() => setK(Math.E)}
                        className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                    >
                        e
                    </button>
                </div>
                <label className="flex items-center gap-2 text-sm">
                    Scale:
                    <input
                        type="range"
                        min="50"
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
                <div className="flex items-center gap-2 text-sm">
                    Mode:
                    <button
                        onClick={() => setMode("cos")}
                        className={`px-2 py-1 rounded ${
                            mode === "cos" ? "bg-gray-600" : "bg-gray-700"
                        }`}
                    >
                        cos
                    </button>
                    <button
                        onClick={() => setMode("sin")}
                        className={`px-2 py-1 rounded ${
                            mode === "sin" ? "bg-gray-600" : "bg-gray-700"
                        }`}
                    >
                        sin
                    </button>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
        </div>
    );
};

export default Rose;