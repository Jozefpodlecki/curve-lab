export function drawBarnsleyFern(ctx: CanvasRenderingContext2D, width: number, height: number, totalPoints = 50000) {
	const transforms = [
		{ a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, p: 0.01 },
		{ a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, p: 0.85 },
		{ a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, p: 0.07 },
		{ a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, p: 0.07 },
	];

	const chooseTransform = () => {
			const r = Math.random();
			let sum = 0;

			for (const t of transforms) {
				sum += t.p;
				
				if (r <= sum) {
					return t;
				}
			}

			return transforms[transforms.length - 1];
	};

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = "#34d399";

	let x = 0;
	let y = 0;

	const padding = 20; 
	const scaleX = (width - 2 * padding) / 6;
	const scaleY = (height - 2 * padding) / 10;
	const offsetX = padding + (width - 2 * padding) / 2;
	const offsetY = height - padding;

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
}
