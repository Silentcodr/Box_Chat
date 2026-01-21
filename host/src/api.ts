
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((req) => {
    const user = localStorage.getItem("user");
    if (user) {
        const { token } = JSON.parse(user);
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
