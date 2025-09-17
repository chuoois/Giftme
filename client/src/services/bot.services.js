import api from "@/lib/axios";

const getToken = () => localStorage.getItem("admin-user");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const botService = {
  getAllBots: async (params = {}) => {
    try {
      const response = await api.get("/bot", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching bots:", error);
      throw error;
    }
  },

  createBot: async (data) => {
    try {
      const response = await api.post("/bot", data, authHeader());
      return response.data;
    } catch (error) {
      console.error("Error creating bot:", error);
      throw error;
    }
  },

  updateBot: async (id, data) => {
    try {
      const response = await api.put(`/bot/${id}`, data, authHeader());
      return response.data;
    } catch (error) {
      console.error("Error updating bot:", error);
      throw error;
    }
  },

  deleteBot: async (id) => {
    try {
      const response = await api.delete(`/bot/${id}`, authHeader());
      return response.data;
    } catch (error) {
      console.error("Error deleting bot:", error);
      throw error;
    }
  },

  getBotResponse: async (message) => {
    try {
      const response = await api.post("/bot/response", { message });
      return response.data;
    } catch (error) {
      console.error("Error getting bot response:", error);
      throw error;
    }
  },
};
