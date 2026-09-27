import React, { useState } from "react";

import ErrorMessage from "../ErrorMessage";

const CustomerForm = ({
    onCustomerCreated,
    onCancel,
    createCustomer
}) => {

    const [formData, setFormData] = useState({
        company_name: "",
        contact_person: "",
        mobile: "",
        email: "",
        city: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (
            !formData.company_name ||
            !formData.contact_person ||
            !formData.mobile ||
            !formData.email ||
            !formData.city
        ) {
            setError("All customer fields are required.");
            return;
        }

        try {

            setLoading(true);

            const response = await createCustomer(formData);

            const customer =
                response?.data || response;

            onCustomerCreated(customer);

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to create customer."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>

            <ErrorMessage message={error} />

            <div className="form-group">
                <label>Company Name</label>
                <input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="ABC Manufacturing Pvt Ltd"
                />
            </div>

            <div className="form-group">
                <label>Contact Person</label>
                <input
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    placeholder="Rajesh Kumar"
                />
            </div>

            <div className="form-group">
                <label>Mobile</label>
                <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="customer@example.com"
                />
            </div>

            <div className="form-group">
                <label>City</label>
                <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                />
            </div>

            <div className="form-actions">

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Customer"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>

            </div>

        </form>
    );
};

export default CustomerForm;