import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import type { ContactMessage } from "../../types";
import { Trash2, Mail, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const MessagesManager = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const { data } = await apiClient.get<{ messages: ContactMessage[] }>("/admin/messages");
            setMessages(data.messages);
        } catch (error) {
            toast.error("Failed to fetch messages");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await apiClient.put(`/admin/messages/${id}/read`);
            toast.success("Message marked as read");
            // Update local state without refetching immediately
            setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
        } catch (error) {
            toast.error("Failed to mark message as read");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            await apiClient.delete(`/admin/messages/${id}`);
            toast.success("Message deleted");
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        Contact Messages
                        {unreadCount > 0 && (
                            <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                <Mail size={14} className="mr-1" />
                                {unreadCount} New
                            </span>
                        )}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Read and manage messages sent from your portfolio contact form.
                    </p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-md transition-colors"
                >
                    Refresh Inbox
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <Mail className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Inbox is empty</h3>
                        <p className="mt-1 text-gray-500">No one has sent you a message yet.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {messages.map((message) => (
                            <li
                                key={message.id}
                                className={`p-6 transition-colors hover:bg-gray-50 ${!message.read ? 'bg-primary-50/30' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 pr-6">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center">
                                                {!message.read && (
                                                    <div className="h-2.5 w-2.5 bg-primary-600 rounded-full mr-3" flex-shrink-0></div>
                                                )}
                                                <h3 className={`text-lg truncate ${!message.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                    {message.name}
                                                </h3>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                                                <Clock size={14} className="mr-1" />
                                                {new Date(message.createdAt).toLocaleString()}
                                            </div>
                                        </div>

                                        <a
                                            href={`mailto:${message.email}`}
                                            className="text-sm text-primary-600 hover:underline inline-block mb-3"
                                        >
                                            {message.email}
                                        </a>

                                        <div className={`text-sm ${!message.read ? 'text-gray-900 font-medium' : 'text-gray-600'} whitespace-pre-wrap`}>
                                            {message.message}
                                        </div>
                                    </div>

                                    <div className="ml-4 flex flex-col space-y-2 items-center">
                                        {!message.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(message.id)}
                                                className="p-2 text-primary-600 hover:bg-primary-100 transition-colors rounded-full"
                                                title="Mark as Read"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(message.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full"
                                            title="Delete Message"
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

export default MessagesManager;
