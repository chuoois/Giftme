import api from "@/lib/axios";

const getToken = localStorage.getItem("admin-user");

const getNewsList = async (params) => {
    const response = await api.get("/news", { params });
    return response.data;
}

const getNewsDetail = async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
}

const createNews = async (data) => {
    const response = await api.post("/news", data, { headers: { Authorization: `Bearer ${getToken}` } });
    return response.data;
}

const updateNews = async (id, data) => {
    const response = await api.put(`/news/${id}`, data, { headers: { Authorization: `Bearer ${getToken}` } });
    return response.data;
}

const deleteNews = async (id) => {
    const response = await api.delete(`/news/${id}`, { headers: { Authorization: `Bearer ${getToken}` } });
    return response.data;
}

const getSuggestedNews = async (id) => {
    const response = await api.get(`/news/suggested/${id}`);
    return response.data;
}

export const newsService = {
    getNewsList,
    getNewsDetail,
    createNews,
    getSuggestedNews,
    updateNews,
    deleteNews
}