import React, { useEffect, useState } from "react";

import QuotationForm from "../components/quotation/QuotationForm";
import QuotationTable from "../components/quotation/QuotationTable";

import {
    getQuotationsApi,
    createQuotationApi,
    updateQuotationStatusApi,
    convertQuotationApi
} from "../services/quotationApi";

import { getProductsApi } from "../services/productApi";
import { getEnquiriesApi } from "../services/enquiryApi";

const Quotations = () => {

    const [quotations, setQuotations] = useState([]);
    const [products, setProducts] = useState([]);
    const [enquiries, setEnquiries] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                quotationsResponse,
                productsResponse,
                enquiriesResponse
            ] = await Promise.all([
                getQuotationsApi(),
                getProductsApi(),
                getEnquiriesApi()
            ]);

            setQuotations(
                quotationsResponse?.data ||
                quotationsResponse ||
                []
            );

            setProducts(
                productsResponse?.data ||
                productsResponse ||
                []
            );

            setEnquiries(
                enquiriesResponse?.data ||
                enquiriesResponse ||
                []
            );

        } catch (error) {

            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Failed to load quotation data."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadData();
    }, []);


    const handleCreate = async (data) => {

        await createQuotationApi(data);

        await loadData();
    };


    const handleStatusChange = async (
        id,
        status
    ) => {

        try {

            await updateQuotationStatusApi(
                id,
                status
            );

            await loadData();

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to update quotation."
            );
        }
    };


    const handleConvert = async (id) => {

        try {

            await convertQuotationApi(id);

            alert(
                "Sales Order created successfully."
            );

            await loadData();

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to convert quotation."
            );
        }
    };


    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Quotations</h1>

                    <p>
                        Create and manage customer
                        quotations.
                    </p>
                </div>

            </div>


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            <div className="content-card">

                <h2>Create Quotation</h2>

                <QuotationForm
                    enquiries={enquiries}
                    products={products}
                    onSubmit={handleCreate}
                />

            </div>


            <div className="content-card">

                <h2>Quotation List</h2>

                {loading ? (
                    <p>Loading quotations...</p>
                ) : (
                    <QuotationTable
                        quotations={quotations}
                        onStatusChange={
                            handleStatusChange
                        }
                        onConvert={handleConvert}
                    />
                )}

            </div>

        </div>
    );
};

export default Quotations;