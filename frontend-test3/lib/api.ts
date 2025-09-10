import axios from "axios";
import https from "https";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5117/api", 
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;