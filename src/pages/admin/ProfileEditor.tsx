import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import type { Profile } from "../../types";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

const ProfileEditor = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<Profile>>({
        fullName: "",
        title: "",
        bio: "",
        avatarUrl: "",
        resumeUrl: "",
        githubUrl: "",
        linkedinUrl: "",
        email: "",
    });

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const { data } = await apiClient.get<{ profile: Profile | null }>("/profile");

            if (data.profile) {
                setFormData({
                    fullName: data.profile.fullName || "",
                    title: data.profile.title || "",
                    bio: data.profile.bio || "",
                    avatarUrl: data.profile.avatarUrl || "",
                    resumeUrl: data.profile.resumeUrl || "",
                    githubUrl: data.profile.githubUrl || "",
                    linkedinUrl: data.profile.linkedinUrl || "",
                    email: data.profile.email || "",
                });
            }
        } catch (error) {
            toast.error("Failed to fetch profile");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await apiClient.put("/admin/profile", formData);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Update your public portfolio information and links.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-8">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Professional Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        placeholder="e.g. Full Stack Developer"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Biography *</label>
                                    <p className="mt-1 text-xs text-gray-500 mb-1">
                                        Write a brief introduction about yourself. This will appear on your home page.
                                    </p>
                                    <textarea
                                        name="bio"
                                        required
                                        rows={5}
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media & Links */}
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b border-gray-200 pb-2 mb-4 mt-8">
                                Links & Media
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Avatar Image URL</label>
                                    <input
                                        type="url"
                                        name="avatarUrl"
                                        value={formData.avatarUrl || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Resume URL</label>
                                    <input
                                        type="url"
                                        name="resumeUrl"
                                        value={formData.resumeUrl || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Public Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">GitHub Profile URL</label>
                                    <input
                                        type="url"
                                        name="githubUrl"
                                        value={formData.githubUrl || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
                                    <input
                                        type="url"
                                        name="linkedinUrl"
                                        value={formData.linkedinUrl || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${isSaving ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 -ml-1 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditor;
