import api from "./api";

export const getDispatchesApi = async () => {
    const response = await api.get("/dispatches");
    return response.data;
};

export const createDispatchApi = async (dispatchData) => {
    const response = await api.post("/dispatches", dispatchData);
    return response.data;
};
