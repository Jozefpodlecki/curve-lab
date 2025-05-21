import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { AppProvider } from "./providers/AppProvider";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<HashRouter>
		<React.StrictMode>
			<AppProvider>
					<App />
			</AppProvider>
		</React.StrictMode>	
	</HashRouter>
);
