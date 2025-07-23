import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { routes } from "./routes";
import Loader from "./components/Loader";
import { useEffect, useRef, useState } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { getSession, getUpdateCheckCached, updateSession } from "./utils";
import { VersionCheckResult } from "./models";

const App: React.FC = () => {
	const unlistenRef = useRef<UnlistenFn | null>(null);
	const [result, setResult] = useState<VersionCheckResult>(getUpdateCheckCached());

	useEffect(() => {
		onLoad()

		return () => {
			unlistenRef.current?.();
		}
	}, []);

	async function onLoad() {
		unlistenRef.current = await listen<VersionCheckResult>("update-check", async (event) => {
			
			const checkResult = event.payload;
			const session = await getSession();
			session.updateCheckResult = checkResult;
			updateSession(session);

			if(checkResult.type == "Latest") {
				setResult(state => {
					return {
						type: "Checking",
						text: "You are using latest version"
					}
				});
				setTimeout(() => {
					setResult(checkResult);
				}, 1000);
			}
			else {
				setResult(checkResult);
			}
			
		});

		if(result.type === "Checking") {
			const session = await getSession();
			updateSession(session);
			setResult(session.updateCheckResult);
		}
	}

	let component;
	switch(result.type) {
		case "Checking":
			component = <Loader text={result.text}/>
			break;
		case "NewVersionOptional":
		case "Latest":
			component = <>
				<Sidebar />
				<div className="flex-1 flex flex-col">
					<section className="h-full">
						<Routes>
							{routes.map(({ path, element }) => (
								<Route key={path} path={path} element={element} />
							))}
						</Routes>
					</section>
				</div>
			</>
			break;
		case "NewVersion":
			component = <Loader text={`Upgrading to version ${result.version}`}/>
			break;
	};

	return (
	<main className="">
		<section className="h-screen w-full flex">
			{component}
		</section>
	</main>
	);
}

export default App;
