import axios from "axios";

const TOKEN_CYBERSOFT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTQiLCJIZXRIYW5TdHJpbmciOiIyOC8wOC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3ODc4NzUyMDAwMDAiLCJuYmYiOjE3Njk1MzMyMDAsImV4cCI6MTc4ODAyMjgwMH0.cX4W082coiCPW_GttAh6P5fDK6QCHTATy3vjQnjDt9Q";

const api = axios.create({
    baseURL: "https://airbnbnew.cybersoft.edu.vn/api/",
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("USER_LOGIN");
        const userData = user ? JSON.parse(user) : null;

        const token =
            userData?.token ||
            userData?.content?.token;

        if (token) {
            config.headers.token = token;
        }
    }

    config.headers.tokenCybersoft = TOKEN_CYBERSOFT;
    return config;
});

export default api;
