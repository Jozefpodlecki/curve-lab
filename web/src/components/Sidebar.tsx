import { Link, useLocation } from "react-router-dom";
import { routes } from "@/routes";

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside className="w-64 h-full bg-gray-800 text-white flex flex-col">
            <h1 className="text-2xl font-bold p-4">Curve Lab</h1>
            <nav className="flex flex-col gap-2 px-2">
                {routes.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;
                    return (
                        <Link
                        key={path}
                        to={path}
                        className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                            isActive ? "bg-gray-900 font-semibold" : "hover:bg-gray-700"
                        }`}
                        >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
