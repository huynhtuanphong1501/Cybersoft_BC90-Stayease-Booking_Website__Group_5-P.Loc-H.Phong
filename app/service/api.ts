import axios, { type InternalAxiosRequestConfig } from "axios";

const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTQiLCJIZXRIYW5TdHJpbmciOiIyOC8wOC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3ODc4NzUyMDAwMDAiLCJuYmYiOjE3Njk1MzMyMDAsImV4cCI6MTc4ODAyMjgwMH0.cX4W082coiCPW_GttAh6P5fDK6QCHTATy3vjQnjDt9Q";

const api = axios.create({
    baseURL: "https://airbnbnew.cybersoft.edu.vn/api/",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
    if (typeof window !== "undefined") {
        const userAdmin = localStorage.getItem("USER_ADMIN");
        const userLogin = localStorage.getItem("USER_LOGIN");

        const adminToken = userAdmin ? JSON.parse(userAdmin).accessToken : "";
        const loginToken = userLogin ? JSON.parse(userLogin).accessToken : "";

        if (adminToken || loginToken) {
            config.headers["Authorization"] = `Bearer ${adminToken || loginToken}`;
        }
    }

    config.headers["TokenCybersoft"] = TOKEN_CYBERSOFT;

    return config;
});

export default api;