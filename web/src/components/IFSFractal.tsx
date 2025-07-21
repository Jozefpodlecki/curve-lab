import { drawBarnsleyFern } from "@/drawers/ifsFern";
import CanvasWrapper, { DrawFunction } from "./CanvasWrapper";
import { ChangeEventHandler, useCallback, useState } from "react";

const IFSFractal: React.FC = () => {
  	const [totalPoints, setTotalPoints] = useState(50000);

	const onPointsChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
		const value = Number(event.currentTarget.value);
		setTotalPoints(value)
	}, []);

	const onDraw: DrawFunction<CanvasRenderingContext2D> = (context, width, height) => {
		drawBarnsleyFern(context, width, height, totalPoints)
	}

	return (
	<div className="flex flex-col h-full bg-gray-900 text-white p-4">
      	<h2 className="mb-4 text-xl font-semibold">Basic IFS Fractal:Barnsley Fern</h2>

      	<div className="mb-4 flex flex-wrap gap-6">
			<label className="flex flex-col">
			Total Points: {totalPoints}
			<input
				type="range"
				min={1000}
				max={100000}
				step={1000}
				value={totalPoints}
				onChange={onPointsChange}
				className="w-48"
			/>
			</label>
   		</div>

		<CanvasWrapper contextType="2d" onDraw={onDraw} className="w-full h-full rounded border border-gray-700 bg-black" />
	</div>
  );
};

export default IFSFractal;