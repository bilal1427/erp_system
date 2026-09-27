import React, { useState } from "react";

import ErrorMessage from "../ErrorMessage";
import QuotationItem from "./QuotationItems";
import QuotationSummary from "./QuotationSummary";

const QuotationForm = ({
    enquiries,
    products,
    onSubmit
}) => {

    const [enquiryId, setEnquiryId] =
        useState("");

    const [validUntil, setValidUntil] =
        useState("");

    const [items, setItems] = useState([
        {
            product_id: "",
            quantity: 1,
            unit_price: "",
            discount_percent: 0,
            gst_percent: 18
        }
    ]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleItemChange = (
        index,
        field,
        value
    ) => {

        setItems((previous) =>
            previous.map((item, itemIndex) => {

                if (itemIndex !== index) {
                    return item;
                }

                const updated = {
                    ...item,
                    [field]: value
                };

                // Automatically use product base price.
                if (field === "product_id") {

                    const product =
                        products.find(
                            (p) =>
                                String(p.id) ===
                                String(value)
                        );

                    if (product) {
                        updated.unit_price =
                            product.base_price;
                    }
                }

                return updated;
            })
        );
    };


    const addItem = () => {

        setItems((previous) => [
            ...previous,
            {
                product_id: "",
                quantity: 1,
                unit_price: "",
                discount_percent: 0,
                gst_percent: 18
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

        if (!enquiryId) {
            setError("Please select an enquiry.");
            return;
        }

        if (!validUntil) {
            setError("Please select validity date.");
            return;
        }

        const invalid = items.some(
            (item) =>
                !item.product_id ||
                Number(item.quantity) <= 0 ||
                Number(item.unit_price) < 0
        );

        if (invalid) {
            setError(
                "Please enter valid quotation items."
            );
            return;
        }

        try {

            setLoading(true);

            await onSubmit({
                enquiry_id: Number(enquiryId),
                valid_until: validUntil,
                items: items.map((item) => ({
                    product_id:
                        Number(item.product_id),
                    quantity:
                        Number(item.quantity),
                    unit_price:
                        Number(item.unit_price),
                    discount_percent:
                        Number(item.discount_percent),
                    gst_percent:
                        Number(item.gst_percent)
                }))
            });

            setEnquiryId("");
            setValidUntil("");

            setItems([
                {
                    product_id: "",
                    quantity: 1,
                    unit_price: "",
                    discount_percent: 0,
                    gst_percent: 18
                }
            ]);

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to create quotation."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>

            <ErrorMessage message={error} />

            <div className="form-row">

                <div className="form-group">

                    <label>Enquiry</label>

                    <select
                        value={enquiryId}
                        onChange={(e) =>
                            setEnquiryId(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            Select Enquiry
                        </option>

                        {enquiries.map((enquiry) => (
                            <option
                                key={enquiry.id}
                                value={enquiry.id}
                            >
                                {enquiry.enquiry_number}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="form-group">

                    <label>Valid Until</label>

                    <input
                        type="date"
                        value={validUntil}
                        onChange={(e) =>
                            setValidUntil(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>


            <h3>Quotation Items</h3>

            {items.map((item, index) => (

                <QuotationItem
                    key={index}
                    item={item}
                    index={index}
                    products={products}
                    onChange={handleItemChange}
                    onRemove={removeItem}
                    canRemove={items.length > 1}
                />

            ))}


            <button
                type="button"
                onClick={addItem}
            >
                + Add Product
            </button>


            <QuotationSummary
                items={items}
            />


            <button
                type="submit"
                disabled={loading}
            >
                {loading
                    ? "Creating..."
                    : "Create Quotation"}
            </button>

        </form>
    );
};

export default QuotationForm;