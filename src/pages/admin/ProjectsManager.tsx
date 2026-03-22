import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import type { Project } from "../../types";
import { Plus, Edit2, Trash2, Link as LinkIcon, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const ProjectsManager = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        liveUrl: "",
        githubUrl: "",
        techStack: "", // Comma separated string for form input
        featured: false,
        order: 0,
    });

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const { data } = await apiClient.get<{ projects: Project[] }>("/projects");
            setProjects(data.projects);
        } catch (error) {
            toast.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox separately
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (type === "number") {
            setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            imageUrl: "",
            liveUrl: "",
            githubUrl: "",
            techStack: "",
            featured: false,
            order: 0,
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEdit = (project: Project) => {
        setFormData({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl || "",
            liveUrl: project.liveUrl || "",
            githubUrl: project.githubUrl || "",
            techStack: project.techStack.join(", "),
            featured: project.featured,
            order: project.order,
        });
        setEditingId(project.id);
        setIsEditing(true);

        // Scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await apiClient.delete(`/admin/projects/${id}`);
            toast.success("Project deleted");
            fetchProjects();
        } catch (error) {
            toast.error("Failed to delete project");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Parse tech stack into array
        const techStackArray = formData.techStack
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean);

        const payload = {
            ...formData,
            techStack: techStackArray,
        };

        try {
            if (isEditing && editingId) {
                await apiClient.put(`/admin/projects/${editingId}`, payload);
                toast.success("Project updated");
            } else {
                await apiClient.post("/admin/projects", payload);
                toast.success("Project created");
            }

            resetForm();
            fetchProjects();
        } catch (error) {
            toast.error(isEditing ? "Failed to update project" : "Failed to create project");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your portfolio projects.
                </p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                        {isEditing ? "Edit Project" : "Add New Project"}
                    </h2>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Project Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tech Stack (comma separated)</label>
                                <input
                                    type="text"
                                    name="techStack"
                                    placeholder="React, Node.js, Tailwind"
                                    value={formData.techStack}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Live Demo URL</label>
                                <input
                                    type="url"
                                    name="liveUrl"
                                    value={formData.liveUrl}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center">
                                    <input
                                        id="featured"
                                        name="featured"
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                                        Featured Project
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        min="0"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="block w-16 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-1 px-2 border"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                <Plus className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                                {isEditing ? "Update Project" : "Add Project"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <h2 className="text-lg font-medium text-gray-900">Current Projects</h2>
                </div>

                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No projects found. Add your first project above!
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {projects.map((project) => (
                            <li key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <h3 className="text-lg font-medium text-primary-700">{project.title}</h3>
                                            {project.featured && (
                                                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 text-sm text-gray-600 max-w-2xl line-clamp-2">
                                            {project.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {project.techStack.map((tech) => (
                                                <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex space-x-4">
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                                    <LinkIcon size={14} className="mr-1" /> Repo
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors">
                                                    <ExternalLink size={14} className="mr-1" /> Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="ml-4 flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id, project.title)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProjectsManager;
