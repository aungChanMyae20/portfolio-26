import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import type { Project } from "../../types";
import { Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await apiClient.get<{ projects: Project[] }>("/projects");
                setProjects(data.projects);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Extract unique tech stack for filtering
    const techFilters = ["All", ...Array.from(new Set(projects.flatMap(p => p.techStack)))].slice(0, 8); // Limit to top 8 filters

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter(p => p.techStack.includes(filter));

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                    My <span className="text-primary-600">Projects</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    A collection of things I've built. From web applications to open source side projects.
                </p>
            </motion.div>

            {/* Filters */}
            {techFilters.length > 2 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 mb-12"
                >
                    {techFilters.map(tech => (
                        <button
                            key={tech}
                            onClick={() => setFilter(tech)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === tech
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                                    : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
                                }`}
                        >
                            {tech}
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        layout
                        className="flex flex-col bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 group h-full"
                    >
                        <div className="h-48 bg-gray-200 dark:bg-dark-900 relative overflow-hidden shrink-0">
                            {project.imageUrl ? (
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 font-medium text-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-900 dark:to-dark-800">
                                    {project.title}
                                </div>
                            )}

                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {project.githubUrl && (
                                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg">
                                        <Github size={18} />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-primary-600/90 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 hover:bg-primary-600 transition-all shadow-lg">
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {project.title}
                                </h3>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-dark-900 text-gray-700 dark:text-gray-300">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-24 text-gray-500">
                    No projects found matching the selected filter.
                </div>
            )}
        </div>
    );
};

export default Projects;
