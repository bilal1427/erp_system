import api from "./api";

export const getQuotationsApi = async () => {
    const response = await api.get("/quotations");
    return response.data;
};

export const createQuotationApi = async (quotationData) => {
    const response = await api.post(
        "/quotations",
        quotationData
    );

    return response.data;
};

export const updateQuotationStatusApi = async (
    id,
    status
) => {
    const response = await api.patch(
        `/quotations/${id}/status`,
        { status }
    );

    return response.data;
};

export const convertQuotationApi = async (id) => {
    const response = await api.post(
        `/quotations/${id}/convert`
    );

    return response.data;
};