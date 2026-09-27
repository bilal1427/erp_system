import React, { useState } from "react";

import ErrorMessage from "../ErrorMessage";

const EnquiryForm = ({
    customers,
    products,
    onSubmit,
    onAddCustomer
}) => {

    const [formData, setFormData] = useState({
        customer_id: "",
        enquiry_date: "",
        required_date: "",
        notes: ""
    });

    const [items, setItems] = useState([
        {
            product_id: "",
            quantity: 1
        }
    ]);

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


    const handleItemChange = (
        index,
        field,
        value
    ) => {

        setItems((previous) =>
            previous.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        [field]: value
                    }
                    : item
            )
        );
    };


    const addItem = () => {

        setItems((previous) => [
            ...previous,
            {
                product_id: "",
                quantity: 1
            }
        ]);
    };


    const removeItem = (index) => {

        if (items.length === 1) {
            return;
        }

        setItems((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!formData.customer_id) {
            setError("Please select a customer.");
            return;
        }

        if (!formData.enquiry_date) {
            setError("Please select enquiry date.");
            return;
        }

        if (!formData.required_date) {
            setError("Please select required date.");
            return;
        }

        if (
            new Date(formData.required_date) <
            new Date(formData.enquiry_date)
        ) {
            setError(
                "Required date cannot be before enquiry date."
            );
            return;
        }

        const invalidItem = items.some(
            (item) =>
                !item.product_id ||
                Number(item.quantity) <= 0
        );

        if (invalidItem) {
            setError(
                "Each product must have a valid quantity."
            );
            return;
        }

        try {

            setLoading(true);

            await onSubmit({
                customer_id: Number(
                    formData.customer_id
                ),
                enquiry_date:
                    formData.enquiry_date,
                required_date:
                    formData.required_date,
                notes: formData.notes,
                items: items.map((item) => ({
                    product_id: Number(
                        item.product_id
                    ),
                    quantity: Number(
                        item.quantity
                    )
                }))
            });

            setFormData({
                customer_id: "",
                enquiry_date: "",
                required_date: "",
                notes: ""
            });

            setItems([
                {
                    product_id: "",
                    quantity: 1
                }
            ]);

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to create enquiry."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>

            <ErrorMessage message={error} />

            <div className="form-group">

                <label>Customer</label>

                <div className="inline-field">

                    <select
                        name="customer_id"
                        value={formData.customer_id}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Customer
                        </option>

                        {customers.map((customer) => (
                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.company_name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={onAddCustomer}
                    >
                        + New Customer
                    </button>

                </div>

            </div>


            <div className="form-row">

                <div className="form-group">

                    <label>Enquiry Date</label>

                    <input
                        type="date"
                        name="enquiry_date"
                        value={formData.enquiry_date}
                        onChange={handleChange}
                    />

                </div>


                <div className="form-group">

                    <label>Required Date</label>

                    <input
                        type="date"
                        name="required_date"
                        value={formData.required_date}
                        onChange={handleChange}
                    />

                </div>

            </div>


            <h3>Products</h3>

            {items.map((item, index) => (

                <div
                    className="enquiry-item"
                    key={index}
                >

                    <select
                        value={item.product_id}
                        onChange={(event) =>
                            handleItemChange(
                                index,
                                "product_id",
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Select Product
                        </option>

                        {products.map((product) => (
                            <option
                                key={product.id}
                                value={product.id}
                            >
                                {product.product_code} -
                                {" "}
                                {product.product_name}
                            </option>
                        ))}

                    </select>


                    <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) =>
                            handleItemChange(
                                index,
                                "quantity",
                                event.target.value
                            )
                        }
                    />


                    <button
                        type="button"
                        onClick={() =>
                            removeItem(index)
                        }
                    >
                        Remove
                    </button>

                </div>

            ))}


            <button
                type="button"
                onClick={addItem}
            >
                + Add Product
            </button>


            <div className="form-group">

                <label>Notes</label>

                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Additional enquiry notes..."
                />

            </div>


            <button
                type="submit"
                disabled={loading}
            >
                {loading
                    ? "Creating..."
                    : "Create Enquiry"}
            </button>

        </form>
    );
};

export default EnquiryForm;