import api from "@/lib/axios";

const getToken = localStorage.getItem("admin-user");

const getHotCombos = async () => {
    const response = await api.get("/combos/hot");
    return response.data;
};

const getComboList = async (params) => {
    const response = await api.get("/combos", { params });
    return response.data;
};

const addCombo = async (comboData) => {
    const response = await api.post("/combos", comboData, { headers: { Authorization: `Bearer ${getToken}` } });
    console.log(response.data);
    return response.data;
}

const deleteCombo = async (id) => {
    const response = await api.delete(`/combos/${id}`, { headers: { Authorization: `Bearer ${getToken}` } });
    return response.data;
}

const editCombo = async (id, comboData) => {
    const response = await api.put(`/combos/${id}`, comboData, { headers: { Authorization: `Bearer ${getToken}` } });
    return response.data;
}

const getComboById = async (id) => {
    const response = await api.get(`/combos/${id}`);
    return response.data;
}

const getSuggestedCombos = async (id) => {
    const response = await api.get(`/combos/suggested/${id}`);
    return response.data;
}

export const comboService = {
    getComboList,
    addCombo,
    deleteCombo,
    getSuggestedCombos,
    editCombo,
    getComboById,
    getHotCombos
};