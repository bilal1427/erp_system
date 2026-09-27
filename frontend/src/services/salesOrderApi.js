import api from "./api";

export const getSalesOrdersApi = async () => {
    const response = await api.get("/sales-orders");

    return response.data;
};


export const confirmSalesOrderApi = async (id) => {
    const response = await api.post(
        `/sales-orders/${id}/confirm`
    );

    return response.data;
};