import api from "@/lib/axios";

const login = async (email, pwd) => {
    const response = await api.post("/auth/login", { email, pwd });
    return response.data;
};

export const authService = {
    login,
};
