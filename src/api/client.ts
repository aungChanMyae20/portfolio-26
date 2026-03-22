import axios from "axios";
import { encryptInfo, decryptInfo } from "../utils/encryption";

// Default to localhost:4000 if not set in environment
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to inject the JWT token and encrypt payload
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("portfolio_admin_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (config.data) {
            try {
                const stringifiedData = JSON.stringify(config.data);
                const encryptedData = encryptInfo(stringifiedData);
                config.data = { payload: encryptedData };
            } catch (err) {
                console.error("Encryption failed for request:", err);
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to decrypt the response payload
apiClient.interceptors.response.use(
    (response) => {
        if (response.data && response.data.payload && typeof response.data.payload === "string") {
            try {
                const decryptedStr = decryptInfo(response.data.payload);
                response.data = JSON.parse(decryptedStr);
            } catch (err) {
                console.error("Decryption failed for response:", err);
            }
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.data && error.response.data.payload) {
            try {
                const decryptedStr = decryptInfo(error.response.data.payload);
                error.response.data = JSON.parse(decryptedStr);
            } catch (err) {
                console.error("Decryption failed for error response:", err);
            }
        }
        return Promise.reject(error);
    }
);
