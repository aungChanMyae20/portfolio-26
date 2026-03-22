import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import type { Skill } from "../../types";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const SkillsManager = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "Frontend",
        level: 50,
        order: 0,
    });

    const CATEGORIES = ["Frontend", "Backend", "DevOps", "Design", "Other"];

    const fetchSkills = async () => {
        try {
            setIsLoading(true);
            const { data } = await apiClient.get<{ skills: Skill[] }>("/skills");
            setSkills(data.skills);
        } catch (error) {
            toast.error("Failed to fetch skills");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "number" || type === "range") {
            setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            category: "Frontend",
            level: 50,
            order: 0,
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEdit = (skill: Skill) => {
        setFormData({
            name: skill.name,
            category: skill.category,
            level: skill.level,
            order: skill.order,
        });
        setEditingId(skill.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await apiClient.delete(`/admin/skills/${id}`);
            toast.success("Skill deleted");
            fetchSkills();
        } catch (error) {
            toast.error("Failed to delete skill");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing && editingId) {
                await apiClient.put(`/admin/skills/${editingId}`, formData);
                toast.success("Skill updated");
            } else {
                await apiClient.post("/admin/skills", formData);
                toast.success("Skill created");
            }

            resetForm();
            fetchSkills();
        } catch (error) {
            toast.error(isEditing ? "Failed to update skill" : "Failed to create skill");
        }
    };

    // Group skills by category for display
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your technical skills and proficiency levels.
                </p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                        {isEditing ? "Edit Skill" : "Add New Skill"}
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Skill Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. React, Docker, UI Design"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category *</label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border bg-white"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Proficiency Level: {formData.level}%
                                </label>
                                <input
                                    type="range"
                                    name="level"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    className="mt-4 block w-full accent-primary-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    min="0"
                                    value={formData.order}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full md:w-32 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                <Plus className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                                {isEditing ? "Update Skill" : "Add Skill"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <h2 className="text-lg font-medium text-gray-900">Current Skills</h2>
                </div>

                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : skills.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No skills added yet.
                    </div>
                ) : (
                    <div className="p-6 space-y-8">
                        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                            <div key={category}>
                                <h3 className="text-md font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                                    {category}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categorySkills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="group border border-gray-100 rounded-lg p-4 hover:border-primary-200 hover:shadow-sm transition-all bg-white relative"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {skill.level}%
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                                <div
                                                    className="bg-primary-500 h-1.5 rounded-full"
                                                    style={{ width: `${skill.level}%` }}
                                                ></div>
                                            </div>

                                            {/* Action buttons (show on hover) */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-100 flex items-center p-1">
                                                <button
                                                    onClick={() => handleEdit(skill)}
                                                    className="p-1.5 text-gray-500 hover:text-primary-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                                <button
                                                    onClick={() => handleDelete(skill.id, skill.name)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillsManager;
