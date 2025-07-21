import React, { useRef, useEffect } from "react";

const IFSFractal: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Affine transforms for Barnsley Fern (probabilities sum to 1)
  const transforms = [
    { a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, p: 0.01 },
    { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, p: 0.85 },
    { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, p: 0.07 },
    { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, p: 0.07 },
  ];

  // Choose transform based on probability
  const chooseTransform = (): typeof transforms[0] => {
    const r = Math.random();
    let sum = 0;
    for (const t of transforms) {
      sum += t.p;
      if (r <= sum) return t;
    }
    return transforms[transforms.length - 1];
  };

  useEffect(() => {
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

    ctx.fillStyle = "#34d399"; // bright green for fern

    let x = 0;
    let y = 0;

    const scaleX = width / 6;
    const scaleY = height / 10;
    const offsetX = width / 2;
    const offsetY = height;

    const totalPoints = 50000;

    for (let i = 0; i < totalPoints; i++) {
      const t = chooseTransform();

      const newX = t.a * x + t.b * y + t.e;
      const newY = t.c * x + t.d * y + t.f;
      x = newX;
      y = newY;

      if (i > 20) {
        const px = offsetX + x * scaleX;
        const py = offsetY - y * scaleY;
        ctx.fillRect(px, py, 1, 1);
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4">
      <h2 className="mb-4 text-xl font-semibold">Basic IFS Fractal: Barnsley Fern</h2>
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded border border-gray-700 bg-black"
      />
    </div>
  );
};

export default IFSFractal;
