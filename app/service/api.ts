import axios, { InternalAxiosRequestConfig } from "axios";

const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTQiLCJIZXRIYW5TdHJpbmciOiIyOC8wOC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3ODc4NzUyMDAwMDAiLCJuYmYiOjE3Njk1MzMyMDAsImV4cCI6MTc4ODAyMjgwMH0.cX4W082coiCPW_GttAh6P5fDK6QCHTATy3vjQnjDt9Q"
const api = axios.create({
    baseURL: "https://airbnbnew.cybersoft.edu.vn/api/",
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
        if (typeof window !== "undefined") {
            const userLogin = localStorage.getItem("USER_LOGIN");
            const userAdmin = localStorage.getItem("USER_ADMIN");

            const userLoginData = userLogin ? JSON.parse(userLogin) : null;
            const userAdminData = userAdmin ? JSON.parse(userAdmin) : null;

            const token =
                userLoginData?.token ||
                userLoginData?.content?.token ||
                userAdminData?.token ||
                userAdminData?.content?.token;

            if (token) {
                config.headers.token = token;
            } else {
                delete config.headers.token;
            }
        }

        config.headers.TokenCybersoft = TOKEN_CYBERSOFT;
        return config;
    }
);

export default api;
