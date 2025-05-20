import { useApp } from "../providers/AppProvider";
import { IconBrandGithub, IconHome } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

const TopBar: React.FC = () => {
    const { version, githubLink } = useApp();
    const location = useLocation();
    const isLandingPage = location.pathname === "/";

    return <nav className="bg-gray-900 text-white h-8 flex items-center">
        <div className="flex flex-row">
            {isLandingPage ? null : <Link to="/" className="w-10 flex justify-center items-center">
                <IconHome size={20} />
            </Link>}
            <a href={githubLink} className="w-10 flex justify-center items-center">
                <IconBrandGithub size={20} />
            </a>
        </div>
    </nav>
}

export default TopBar;