import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import { FolderKanban, Wrench, MessageSquare, Briefcase } from "lucide-react";
import type { Project, Skill, Experience, ContactMessage } from "../../types";

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experiences: 0,
        unreadMessages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projectsRes, skillsRes, expRes, msgRes] = await Promise.all([
                    apiClient.get<{ projects: Project[] }>("/projects"),
                    apiClient.get<{ skills: Skill[] }>("/skills"),
                    apiClient.get<{ experiences: Experience[] }>("/experience"),
                    apiClient.get<{ messages: ContactMessage[] }>("/admin/messages"),
                ]);

                setStats({
                    projects: projectsRes.data.projects.length,
                    skills: skillsRes.data.skills.length,
                    experiences: expRes.data.experiences.length,
                    unreadMessages: msgRes.data.messages.filter((m) => !m.read).length,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            name: "Total Projects",
            value: stats.projects,
            icon: <FolderKanban className="h-6 w-6 text-white" />,
            color: "bg-blue-500",
        },
        {
            name: "Total Skills",
            value: stats.skills,
            icon: <Wrench className="h-6 w-6 text-white" />,
            color: "bg-indigo-500",
        },
        {
            name: "Experience Items",
            value: stats.experiences,
            icon: <Briefcase className="h-6 w-6 text-white" />,
            color: "bg-purple-500",
        },
        {
            name: "Unread Messages",
            value: stats.unreadMessages,
            icon: <MessageSquare className="h-6 w-6 text-white" />,
            color: "bg-emerald-500",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome back! Here's what's happening with your portfolio today.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => (
                    <div
                        key={item.name}
                        className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`rounded-md p-3 ${item.color}`}>
                                        {item.icon}
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {item.name}
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-bold text-gray-900">
                                                {item.value}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Add buttons later linking to specific pages */}
                    <p className="text-sm text-gray-500 col-span-full">Navigate using the sidebar to manage your portfolio content.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
