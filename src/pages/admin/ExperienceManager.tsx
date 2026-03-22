import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import type { Experience } from "../../types";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const ExperienceManager = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Format for datetime-local input matches 'YYYY-MM-DDThh:mm'
    const formatDateForInput = (isoString: string | null) => {
        if (!isoString) return "";
        return new Date(isoString).toISOString().split("T")[0]; // Just YYYY-MM-DD is fine for this
    };

    const [formData, setFormData] = useState({
        company: "",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
        order: 0,
    });

    const fetchExperiences = async () => {
        try {
            setIsLoading(true);
            const { data } = await apiClient.get<{ experiences: Experience[] }>("/experience");
            setExperiences(data.experiences);
        } catch (error) {
            toast.error("Failed to fetch experiences");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
                // If current is checked, end date should be empty
                ...(name === 'current' && checked ? { endDate: "" } : {})
            }));
        } else if (type === "number") {
            setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData({
            company: "",
            role: "",
            description: "",
            startDate: "",
            endDate: "",
            current: false,
            order: 0,
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEdit = (exp: Experience) => {
        setFormData({
            company: exp.company,
            role: exp.role,
            description: exp.description,
            startDate: formatDateForInput(exp.startDate),
            endDate: formatDateForInput(exp.endDate),
            current: exp.current,
            order: exp.order,
        });
        setEditingId(exp.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string, company: string) => {
        if (!window.confirm(`Are you sure you want to delete experience at "${company}"?`)) return;

        try {
            await apiClient.delete(`/admin/experience/${id}`);
            toast.success("Experience deleted");
            fetchExperiences();
        } catch (error) {
            toast.error("Failed to delete experience");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare payload, format dates properly
        const payload = {
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: formData.current || !formData.endDate ? null : new Date(formData.endDate).toISOString(),
        };

        try {
            if (isEditing && editingId) {
                await apiClient.put(`/admin/experience/${editingId}`, payload);
                toast.success("Experience updated");
            } else {
                await apiClient.post("/admin/experience", payload);
                toast.success("Experience created");
            }

            resetForm();
            fetchExperiences();
        } catch (error) {
            toast.error(isEditing ? "Failed to update experience" : "Failed to create experience");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Work Experience</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your career history to be displayed on your timeline.
                </p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                        {isEditing ? "Edit Experience" : "Add Experience"}
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
                                <label className="block text-sm font-medium text-gray-700">Company / Organization *</label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role / Job Title *</label>
                                <input
                                    type="text"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your responsibilities and achievements..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    required
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    disabled={formData.current}
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm py-2 px-3 border ${formData.current ? "bg-gray-100 cursor-not-allowed" : "focus:border-primary-500 focus:ring-primary-500"
                                        }`}
                                />
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center">
                                    <input
                                        id="current"
                                        name="current"
                                        type="checkbox"
                                        checked={formData.current}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <label htmlFor="current" className="ml-2 block text-sm text-gray-900">
                                        I currently work here
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <label className="block text-sm font-medium text-gray-700">Ordering (lowest first)</label>
                                    <input
                                        type="number"
                                        name="order"
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
                                {isEditing ? "Update Experience" : "Add Experience"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <h2 className="text-lg font-medium text-gray-900">Experience History</h2>
                </div>

                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : experiences.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No experiences found. Add your first job above!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900">{exp.role}</h3>
                                        <div className="flex items-center mt-1 text-sm text-primary-600 font-medium">
                                            {exp.company}
                                        </div>

                                        <div className="flex items-center mt-2 text-xs text-gray-500 font-medium">
                                            <Calendar size={14} className="mr-1" />
                                            {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                            {" - "}
                                            {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ""}
                                        </div>

                                        <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">
                                            {exp.description}
                                        </p>
                                    </div>

                                    <div className="ml-4 flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id, exp.company)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperienceManager;
