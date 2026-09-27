import api from "./api";

export const getEnquiriesApi = async () => {
    const response = await api.get("/enquiries");
    return response.data;
};

export const createEnquiryApi = async (enquiryData) => {
    const response = await api.post(
        "/enquiries",
        enquiryData
    );

    return response.data;
};