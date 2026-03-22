export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface Profile {
    id: string;
    fullName: string;
    title: string;
    bio: string;
    avatarUrl: string | null;
    resumeUrl: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    email: string | null;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    liveUrl: string | null;
    githubUrl: string | null;
    techStack: string[];
    featured: boolean;
    order: number;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    order: number;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    description: string;
    startDate: string; // ISO string
    endDate: string | null; // ISO string
    current: boolean;
    order: number;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: string; // ISO string
}
