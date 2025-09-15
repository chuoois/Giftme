import api from "@/lib/axios";

const getToken = () => localStorage.getItem("admin-user");

// 📌 Get all content (optional: pagination, search)
const getAllContent = async (params = {}) => {
  try {
    const response = await api.get("/content", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

// 📌 Get enabled content (chỉ 1 cái được bật để hiển thị Home)
const getEnabledContent = async () => {
  try {
    const response = await api.get("/content/enabled");
    return response.data;
  } catch (error) {
    console.error("Error fetching enabled content:", error);
    throw error;
  }
};

// 📌 Create new content
const createContent = async (contentData) => {
  try {
    const response = await api.post("/content", contentData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating content:", error);
    throw error;
  }
};

// 📌 Update content
const updateContent = async (id, contentData) => {
  try {
    const response = await api.put(`/content/${id}`, contentData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating content:", error);
    throw error;
  }
};

// 📌 Delete content
const deleteContent = async (id) => {
  try {
    const response = await api.delete(`/content/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting content:", error);
    throw error;
  }
};

export const contentService = {
  getAllContent,
  getEnabledContent, 
  createContent,
  updateContent,
  deleteContent,
};
