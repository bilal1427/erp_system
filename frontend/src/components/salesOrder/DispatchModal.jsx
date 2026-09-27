import React, { useState } from "react";

import ErrorMessage from "../ErrorMessage";

const DispatchModal = ({
    order,
    onDispatch,
    onCancel
}) => {

    const [vehicleNumber, setVehicleNumber] =
        useState("");

    const [driverName, setDriverName] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!vehicleNumber.trim()) {
            setError(
                "Vehicle number is required."
            );
            return;
        }

        if (!driverName.trim()) {
            setError(
                "Driver name is required."
            );
            return;
        }


        try {

            setLoading(true);

            await onDispatch({
                sales_order_id: order.id,
                vehicle_number:
                    vehicleNumber.trim(),
                driver_name:
                    driverName.trim()
            });

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to process dispatch."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>

            <ErrorMessage message={error} />


            <div className="form-group">

                <label>
                    Sales Order
                </label>

                <input
                    value={
                        order?.order_number || ""
                    }
                    disabled
                />

            </div>


            <div className="form-group">

                <label>
                    Vehicle Number
                </label>

                <input
                    value={vehicleNumber}
                    onChange={(event) =>
                        setVehicleNumber(
                            event.target.value
                        )
                    }
                    placeholder="MH 04 AB 1234"
                />

            </div>


            <div className="form-group">

                <label>
                    Driver Name
                </label>

                <input
                    value={driverName}
                    onChange={(event) =>
                        setDriverName(
                            event.target.value
                        )
                    }
                    placeholder="Enter driver name"
                />

            </div>


            <div className="form-actions">

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Processing..."
                        : "Create Dispatch"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>

            </div>

        </form>
    );
};

export default DispatchModal;