import api from "./api";

export const getCustomersApi = async () => {
    const response = await api.get("/customers");
    return response.data;
};

export const createCustomerApi = async (customerData) => {
    const response = await api.post(
        "/customers",
        customerData
    );

    return response.data;
};