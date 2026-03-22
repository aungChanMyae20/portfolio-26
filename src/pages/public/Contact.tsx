import { useState } from "react";
import { apiClient } from "../../api/client";
import { Mail, Send, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await apiClient.post("/contact", formData);
            toast.success("Message sent successfully! I'll get back to you soon.");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            toast.error("Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                    Get In <span className="text-primary-600">Touch</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Have a project in mind or just want to say hi? I'd love to hear from you.
                    Fill out the form below and I'll get back to you as soon as possible.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-10"
                >
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex items-center justify-center p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg mr-4">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">hello@yourdomain.com</p>
                                </div>
                            </div>

                            {/* Optional alternative contact methods - configure as needed
              <div className="flex items-start">
                <div className="flex items-center justify-center p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg mr-4">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">San Francisco, CA</p>
                </div>
              </div>
              */}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Connect with me</h2>
                        <div className="flex space-x-4">
                            <a href="#" className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-primary-600 hover:text-white transition-all duration-300">
                                <Github size={20} />
                            </a>
                            <a href="#" className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                                    placeholder="How can I help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex items-center justify-center py-4 px-6 rounded-lg text-white font-medium transition-all duration-300 ${isSubmitting
                                    ? "bg-primary-400 cursor-not-allowed"
                                    : "bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
