import { useEffect, useRef, useState } from "react";

const Spiral: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [scale, setScale] = useState(5);
    const [points, setPoints] = useState(5000);
    const [turns, setTurns] = useState(10);
    const [spiralType, setSpiralType] = useState<"archimedean" | "logarithmic" | "fermat">("archimedean");

    const drawSpiral = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);

        ctx.clearRect(0, 0, width, height);
        ctx.translate(width / 2, height / 2);

        ctx.beginPath();
        for (let i = 0; i < points; i++) {
            const theta = (2 * Math.PI * turns * i) / points;
            let r = 0;

            if (spiralType === "archimedean") {
                r = scale * theta;
            } else if (spiralType === "logarithmic") {
                const b = .02;
                r = scale * 20 * Math.exp(b * theta);
            } else if (spiralType === "fermat") {
                r = scale * 5 * Math.sqrt(theta);
            }

            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.resetTransform();
    };

    useEffect(() => {
        drawSpiral();
    }, [scale, points, turns, spiralType]);

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="p-4 flex flex-wrap gap-6 items-center border-b border-gray-700">
                <label className="flex items-center gap-2 text-sm">
                    Spiral Type:
                    <select
                        value={spiralType}
                        onChange={(e) => setSpiralType(e.target.value as any)}
                        className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
                    >
                        <option value="archimedean">Archimedean</option>
                        <option value="logarithmic">Logarithmic</option>
                        <option value="fermat">Fermat</option>
                    </select>
                </label>
                <label className="flex items-center gap-2 text-sm">
                    Scale:
                    <input
                        type="range"
                        min="0.1"
                        max="10"
                        step="0.5"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-32 accent-cyan-400 bg-gray-700 rounded"
                    />
                    {scale}
                </label>
                <label className="flex items-center gap-2 text-sm">
                    Points:
                    <input
                        type="range"
                        min="1000"
                        max="20000"
                        step="500"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        className="w-40 accent-cyan-400 bg-gray-700 rounded"
                    />
                    {points}
                </label>
                <label className="flex items-center gap-2 text-sm">
                    Turns:
                    <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={turns}
                        onChange={(e) => setTurns(Number(e.target.value))}
                        className="w-32 accent-cyan-400 bg-gray-700 rounded"
                    />
                    {turns}
                </label>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
        </div>
    );
};

export default Spiral;
