import Butterfly from "./components/Butterfly";
import Rose from "./components/Rose";
import Lissajous from "./components/Lissajous";
import Fractal from "./components/Fractal";
import IFSFractal from "./components/IFSFractal";

import {
  IconButterfly,
  IconRosette,
  IconInfinity,
  IconTree,
  IconLeaf,
} from "@tabler/icons-react";

export type RouteItem = {
	path: string;
	label: string;
	element: React.ReactNode;
	icon: any;
};

export const routes: RouteItem[] = [
	{
		path: "/butterfly",
		label: "Butterfly Curve",
		element: <Butterfly />,
		icon: IconButterfly,
	},
	{
		path: "/ifsfractal",
		label: "IFS Fractal",
		element: <IFSFractal />,
		icon: IconLeaf,
	},
	{
		path: "/rose",
		label: "Rose Curve",
		element: <Rose />,
		icon: IconRosette,
	},
	{
		path: "/lissajous",
		label: "Lissajous Curve",
		element: <Lissajous />,
		icon: IconInfinity,
	},
	{
		path: "/fractal",
		label: "Fractal",
		element: <Fractal />,
		icon: IconTree,
	},
];
