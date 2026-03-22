import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const PublicLayout = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)]">
            {/* Header */}
            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                        ? "bg-white/80 dark:bg-dark-900/80 backdrop-blur-md shadow-sm py-3"
                        : "bg-transparent py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="text-2xl font-bold tracking-tighter">
                            <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
                                Portfolio
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${location.pathname === link.path
                                            ? "text-primary-600 dark:text-primary-400"
                                            : "text-gray-600 dark:text-gray-300"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white dark:bg-dark-900 pt-24 px-4 pb-6 flex flex-col md:hidden"
                    >
                        <nav className="flex flex-col space-y-6 text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-2xl font-semibold ${location.pathname === link.path
                                            ? "text-primary-600 dark:text-primary-400"
                                            : "text-gray-900 dark:text-white"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 pt-24 pb-16">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-dark-950 py-12 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} Portfolio. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <span className="sr-only">GitHub</span>
                            <Github size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <span className="sr-only">Email</span>
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
