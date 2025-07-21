import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { routes } from "./routes";

const App: React.FC = () => {
	
	return (
	<main className="">
		<section className="h-screen w-full flex">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				{/* <TopBar /> */}
				<section className="h-full">
					<Routes>
						{routes.map(({ path, element }) => (
							<Route key={path} path={path} element={element} />
						))}
					</Routes>
				</section>
			</div>
		</section>
	</main>
	);
}

export default App;
