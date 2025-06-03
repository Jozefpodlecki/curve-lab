import { useCallback, useEffect, useRef, useState } from "react";

type FractalType = "Koch" | "Sierpinski" | "Tree";

const maxIterationsMap: Record<FractalType, number> = {
  Koch: 6,
  Sierpinski: 10,
  Tree: 20,
};

const FractalViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [type, setType] = useState<FractalType>("Tree");
  const [iterations, setIterations] = useState(3);
  const [angle, setAngle] = useState(25);
  const [branchLength, setBranchLength] = useState(100);

  const maxIterations = maxIterationsMap[type];

  // Clamp iterations when fractal type or maxIterations change
  useEffect(() => {
    if (iterations > maxIterations) {
      setIterations(maxIterations);
    }
  }, [type, maxIterations, iterations]);

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setType(e.target.value as FractalType);
    },
    []
  );

  const handleIterationsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIterations(Number(e.target.value));
    },
    []
  );

  const handleAngleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAngle(Number(e.target.value));
    },
    []
  );

  const handleLengthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBranchLength(Number(e.target.value));
    },
    []
  );

  const midpoint = (a: number[], b: number[]) => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    switch (type) {
      case "Koch":
        drawKochSnowflake(ctx, width, height);
        break;
      case "Sierpinski":
        drawSierpinski(ctx, width, height);
        break;
      case "Tree":
        drawFractalTree(
          ctx,
          width / 2,
          height - 10,
          branchLength,
          -90,
          iterations,
          angle
        );
        break;
    }
  };

  const drawKochSnowflake = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const length = Math.min(width, height) * 0.6;
    const h = (Math.sqrt(3) / 2) * length;
    const centerX = width / 2;
    const centerY = height / 2;

    const p1 = [centerX - length / 2, centerY + h / 3];
    const p2 = [centerX + length / 2, centerY + h / 3];
    const p3 = [centerX, centerY - (2 * h) / 3];

    ctx.beginPath();
    drawKoch(ctx, p1, p2, iterations);
    drawKoch(ctx, p2, p3, iterations);
    drawKoch(ctx, p3, p1, iterations);
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  const drawKoch = (
    ctx: CanvasRenderingContext2D,
    p1: number[],
    p2: number[],
    iter: number
  ) => {
    if (iter === 0) {
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      return;
    }

    const dx = (p2[0] - p1[0]) / 3;
    const dy = (p2[1] - p1[1]) / 3;
    const a = p1;
    const b = [p1[0] + dx, p1[1] + dy];
    const d = [p1[0] + 2 * dx, p1[1] + 2 * dy];
    const e = [
      b[0] + (dx - Math.sqrt(3) * dy) / 2,
      b[1] + (dy + Math.sqrt(3) * dx) / 2,
    ];

    drawKoch(ctx, a, b, iter - 1);
    drawKoch(ctx, b, e, iter - 1);
    drawKoch(ctx, e, d, iter - 1);
    drawKoch(ctx, d, p2, iter - 1);
  };

  const drawSierpinski = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const size = Math.min(width, height) * 0.8;
    const p1 = [width / 2, height / 2 - size / 2];
    const p2 = [width / 2 - size / 2, height / 2 + size / 2];
    const p3 = [width / 2 + size / 2, height / 2 + size / 2];
    sierpinski(ctx, p1, p2, p3, iterations);
  };

  const sierpinski = (
    ctx: CanvasRenderingContext2D,
    a: number[],
    b: number[],
    c: number[],
    depth: number
  ) => {
    if (depth === 0) {
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.lineTo(c[0], c[1]);
      ctx.closePath();
      ctx.fillStyle = "#34d399";
      ctx.fill();
      return;
    }

    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    sierpinski(ctx, a, ab, ca, depth - 1);
    sierpinski(ctx, ab, b, bc, depth - 1);
    sierpinski(ctx, ca, bc, c, depth - 1);
  };

  const drawFractalTree = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    length: number,
    angle: number,
    maxDepth: number,
    splitAngle: number
  ) => {
    const stack: {
      x: number;
      y: number;
      length: number;
      angle: number;
      depth: number;
    }[] = [];

    stack.push({ x, y, length, angle, depth: maxDepth });

    while (stack.length > 0) {
      const branch = stack.pop();
      if (!branch) continue;

      const { x, y, length, angle, depth } = branch;

      const rad = (angle * Math.PI) / 180;
      const x2 = x + Math.cos(rad) * length;
      const y2 = y + Math.sin(rad) * length;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = Math.max(1, depth);
      ctx.stroke();

      if (depth > 0) {
        const nextLength = length * 0.7;
        const nextDepth = depth - 1;
        stack.push({
          x: x2,
          y: y2,
          length: nextLength,
          angle: angle - splitAngle,
          depth: nextDepth,
        });
        stack.push({
          x: x2,
          y: y2,
          length: nextLength,
          angle: angle + splitAngle,
          depth: nextDepth,
        });
      }
    }
  };

  useEffect(() => {
    draw();
  }, [type, iterations, angle, branchLength]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 flex flex-wrap gap-6 items-center border-b border-gray-700 text-sm">
        <label className="flex gap-2 items-center">
          Type:
          <select
            value={type}
            onChange={handleTypeChange}
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
          >
            <option value="Koch">Koch Snowflake</option>
            <option value="Sierpinski">Sierpinski Triangle</option>
            <option value="Tree">Fractal Tree</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Iterations:
          <input
            type="range"
            min={1}
            max={maxIterations}
            value={iterations}
            onChange={handleIterationsChange}
            className="w-32"
          />
          {iterations}
        </label>
        {type === "Tree" && (
          <>
            <label className="flex items-center gap-2">
              Angle:
              <input
                type="range"
                min={5}
                max={85}
                value={angle}
                onChange={handleAngleChange}
                className="w-32"
              />
              {angle}°
            </label>
            <label className="flex items-center gap-2">
              Branch Length:
              <input
                type="range"
                min={20}
                max={200}
                value={branchLength}
                onChange={handleLengthChange}
                className="w-32"
              />
              {branchLength}
            </label>
          </>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default FractalViewer;
