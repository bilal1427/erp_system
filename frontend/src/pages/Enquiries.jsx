import { useEffect, useState } from "react";

import Modal from "../components/Modal";
import CustomerForm from "../components/enquiry/CustomerForm";
import EnquiryForm from "../components/enquiry/EnquiryForm";
import EnquiryTable from "../components/enquiry/EnquiryTable";

import {
    getCustomersApi,
    createCustomerApi
} from "../services/customerApi";

import {
    getProductsApi
} from "../services/productApi";

import {
    getEnquiriesApi,
    createEnquiryApi
} from "../services/enquiryApi";

import { useAuth } from "../context/AuthContext";

const Enquiries = () => {

    const { role } = useAuth();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [enquiries, setEnquiries] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [customerModalOpen, setCustomerModalOpen] =
        useState(false);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                customersResponse,
                productsResponse,
                enquiriesResponse
            ] = await Promise.all([
                getCustomersApi(),
                getProductsApi(),
                getEnquiriesApi()
            ]);

            setCustomers(
                customersResponse?.data ||
                customersResponse ||
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
                "Failed to load enquiry data."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadData();
    }, []);


    const handleCreateCustomer = async (customerData) => {

        try {

            const response =
                await createCustomerApi(customerData);

            const customer =
                response?.data || response;

            setCustomers((previous) => [
                ...previous,
                customer
            ]);

            setCustomerModalOpen(false);

        } catch (error) {

            throw error;
        }
    };


    const handleCreateEnquiry = async (enquiryData) => {

        try {

            await createEnquiryApi(enquiryData);

            await loadData();

        } catch (error) {

            throw error;
        }
    };


    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Enquiries</h1>

                    <p>
                        Manage customer enquiries and
                        requested products.
                    </p>
                </div>

            </div>


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            <div className="content-card">

                <h2>Create Enquiry</h2>

                <EnquiryForm
                    customers={customers}
                    products={products}
                    onSubmit={handleCreateEnquiry}
                    onAddCustomer={() =>
                        setCustomerModalOpen(true)
                    }
                />

            </div>


            <div className="content-card">

                <h2>Enquiry List</h2>

                <EnquiryTable
                    enquiries={enquiries}
                    loading={loading}
                />

            </div>


            <Modal
                isOpen={customerModalOpen}
                onClose={() =>
                    setCustomerModalOpen(false)
                }
                title="Create Customer"
            >

                <CustomerForm
                    createCustomer={createCustomerApi}
                    onCustomerCreated={(customer) => {

                        setCustomers((previous) => [
                            ...previous,
                            customer
                        ]);

                        setCustomerModalOpen(false);
                    }}
                    onCancel={() =>
                        setCustomerModalOpen(false)
                    }
                />

            </Modal>

        </div>
    );
};

export default Enquiries;