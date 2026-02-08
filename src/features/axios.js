import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URI,
    withCredentials: true,
})

// NOTE: requrest intercepter is for development phase only not for production
// axios intercepters for request
api.interceptors.request.use(req => {
    console.log('Request:', req);
    return req;
});

// NOTE: response intercepter res logs is for development phase only not for production
// NOTE: response intecepter 401 statuscode error, for aunthorized(token expiry), for refreshing accesstoken
// axios intercepters for request
api.interceptors.response.use(res => {
    console.log('Response:', res);
    return res;
});

api.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes("/users/refresh-token")) {
            window.location.href = "/login";
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.post("/users/refresh-token");
                return api(originalRequest)
            } catch (refreshError) {
                console.log("refresh failed now login")

                window.location.href = "/auth/login";
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error);
    }
)


export default api;