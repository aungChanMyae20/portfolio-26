import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, FolderKanban, Wrench, Briefcase, MessageSquare, LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react";

export const AdminLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
        { name: "Profile", path: "/admin/profile", icon: <UserIcon size={20} /> },
        { name: "Projects", path: "/admin/projects", icon: <FolderKanban size={20} /> },
        { name: "Skills", path: "/admin/skills", icon: <Wrench size={20} /> },
        { name: "Experience", path: "/admin/experience", icon: <Briefcase size={20} /> },
        { name: "Messages", path: "/admin/messages", icon: <MessageSquare size={20} /> },
        { name: "Settings", path: "/admin/settings", icon: <SettingsIcon size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/admin' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-primary-50 text-primary-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {user?.name?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 truncate">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden">
                    <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600">
                        <LogOut size={20} />
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
