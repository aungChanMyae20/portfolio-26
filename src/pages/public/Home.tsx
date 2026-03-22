import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../api/client";
import type { Profile, Project, Skill, Experience } from "../../types";
import { ArrowRight, Github, ExternalLink, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [profileRes, projectsRes, skillsRes, expRes] = await Promise.all([
                    apiClient.get<{ profile: Profile }>("/profile"),
                    apiClient.get<{ projects: Project[] }>("/projects/featured"),
                    apiClient.get<{ skills: Skill[] }>("/skills"),
                    apiClient.get<{ experiences: Experience[] }>("/experience"),
                ]);

                setProfile(profileRes.data.profile);
                setFeaturedProjects(projectsRes.data.projects);
                setSkills(skillsRes.data.skills);
                setExperiences(expRes.data.experiences);
            } catch (error) {
                console.error("Failed to load portfolio data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-32">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-primary-600 dark:text-primary-400 font-medium tracking-wide">
                                Hi, my name is
                            </h2>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                {profile?.fullName || "Developer"}
                            </h1>
                            <h3 className="text-3xl md:text-5xl font-bold text-gray-500 dark:text-gray-400">
                                {profile?.title || "I build things for the web."}
                            </h3>
                        </div>

                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed whitespace-pre-wrap">
                            {profile?.bio || "A passionate software developer specializing in building exceptional digital experiences."}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                to="/projects"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
                            >
                                View My Work
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-colors duration-200"
                            >
                                Get In Touch
                            </Link>
                        </div>
                    </motion.div>

                    {profile?.avatarUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex-1 flex justify-center md:justify-end"
                        >
                            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white dark:border-dark-800 shadow-2xl">
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.fullName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-primary-600/10 mix-blend-overlay"></div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
                <section className="bg-gray-50 dark:bg-dark-900/50 py-24 border-y border-gray-100 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <span className="w-8 h-1 bg-primary-600 mr-4 rounded-full"></span>
                                    Featured Projects
                                </h2>
                                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
                                    A selection of some of the projects I'm most proud of.
                                </p>
                            </div>
                            <Link to="/projects" className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-medium group">
                                View all projects
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 group"
                                >
                                    <div className="h-48 bg-gray-200 dark:bg-dark-900 relative overflow-hidden">
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
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:scale-110 transition-transform">
                                                    <Github size={20} />
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:scale-110 transition-transform">
                                                    <ExternalLink size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.map(tech => (
                                                <span key={tech} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 text-center md:hidden">
                            <Link to="/projects" className="inline-flex items-center text-primary-600 font-medium">
                                View all projects <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {skills.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                            <span className="w-8 h-1 bg-primary-600 mr-4 rounded-full"></span>
                            Technical Arsenal
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                        {Object.entries(
                            skills.reduce((acc, skill) => {
                                if (!acc[skill.category]) acc[skill.category] = [];
                                acc[skill.category].push(skill);
                                return acc;
                            }, {} as Record<string, Skill[]>)
                        ).map(([category, catSkills], index) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">{category}</h3>
                                <div className="space-y-4">
                                    {catSkills.map(skill => (
                                        <div key={skill.id}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                                                <span className="text-sm font-medium text-gray-500">{skill.level}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-dark-800 rounded-full h-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full"
                                                    style={{ width: `${skill.level}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience Section */}
            {experiences.length > 0 && (
                <section className="bg-gray-50 dark:bg-dark-900/50 py-24 border-y border-gray-100 dark:border-gray-800">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white inline-flex items-center">
                                <span className="w-8 h-1 bg-primary-600 mr-4 rounded-full"></span>
                                Experience
                                <span className="w-8 h-1 bg-primary-600 ml-4 rounded-full"></span>
                            </h2>
                        </div>

                        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                                >
                                    {/* Timeline dot */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-dark-900 bg-primary-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                                        <Briefcase size={16} />
                                    </div>

                                    {/* Card */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col space-y-2 mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                                            <h4 className="text-lg font-medium text-primary-600">{exp.company}</h4>
                                            <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                                                <Calendar size={14} className="mr-1.5" />
                                                {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                                {" - "}
                                                {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : ""}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed text-sm">
                                            {exp.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

// Lucide icon missing import above, adding it here. It's basically the small briefcase
function Briefcase(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    )
}

export default Home;
