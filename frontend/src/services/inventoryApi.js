import api from "./api";

export const getInventoryApi = async () => {
    const response = await api.get("/inventory");
    return response.data;
};