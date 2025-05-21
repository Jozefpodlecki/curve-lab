import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import { useApp } from "./providers/AppProvider";
import Sidebar from "./components/Sidebar";
import Butterfly from "./components/Butterfly";
import Rose from "./components/Rose";

const App: React.FC = () => {
	const app = useApp();
	
	return (
	<main className="">
		<section className="h-screen w-full flex">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				{/* <TopBar /> */}
				<section className="h-full">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/butterfly" element={<Butterfly />} />
						<Route path="/rose" element={<Rose />} />
					</Routes>
				</section>
			</div>
		</section>
	</main>
	);
}

export default App;
