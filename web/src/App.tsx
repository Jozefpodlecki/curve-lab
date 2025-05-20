import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import { useApp } from "./providers/AppProvider";

const App: React.FC = () => {
	const app = useApp();
	
	return (
	<main className="">
		<Routes>
			<Route path="/" element={<Home />} />
		</Routes>
	</main>
	);
}

export default App;
