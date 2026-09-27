import React, { useState } from "react";

import ErrorMessage from "../ErrorMessage";

const ConfirmOrderModal = ({
    order,
    onConfirm,
    onCancel
}) => {

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleConfirm = async () => {

        try {

            setLoading(true);
            setError("");

            await onConfirm(order.id);

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to confirm sales order."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div>

            <ErrorMessage message={error} />

            <p>
                Are you sure you want to confirm
                sales order{" "}
                <strong>
                    {order?.order_number}
                </strong>
                ?
            </p>

            <p>
                Confirming this order will reserve
                the required inventory.
            </p>


            <div className="form-actions">

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading
                        ? "Confirming..."
                        : "Confirm Order"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>

            </div>

        </div>
    );
};

export default ConfirmOrderModal;