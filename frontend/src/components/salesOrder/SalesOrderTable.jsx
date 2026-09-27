import React from "react";

import {
    formatCurrency,
    formatDate,
    formatStatus
} from "../../utils/formatters";

const SalesOrderTable = ({
    orders,
    role,
    onConfirm,
    onDispatch,
    onView
}) => {

    if (!orders.length) {
        return (
            <div className="empty-state">
                No sales orders found.
            </div>
        );
    }

    return (
        <div className="table-container">

            <table>

                <thead>
                    <tr>
                        <th>Order No.</th>
                        <th>Customer</th>
                        <th>Quotation</th>
                        <th>Order Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {orders.map((order) => (

                        <tr key={order.id}>

                            <td>
                                {order.order_number}
                            </td>

                            <td>
                                {order.company_name ||
                                    order.customer_name ||
                                    order.customer?.company_name ||
                                    "-"}
                            </td>

                            <td>
                                {order.quotation_number ||
                                    order.quotation?.quotation_number ||
                                    "-"}
                            </td>

                            <td>
                                {formatDate(
                                    order.order_date
                                )}
                            </td>

                            <td>
                                {formatCurrency(
                                    order.total_amount
                                )}
                            </td>

                            <td>
                                <span
                                    className={`status status-${String(
                                        order.status || ""
                                    ).toLowerCase()}`}
                                >
                                    {formatStatus(
                                        order.status
                                    )}
                                </span>
                            </td>

                            <td>

                                {/* View Order */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onView(order)
                                    }
                                >
                                    View
                                </button>


                                {/* ADMIN: Confirm */}
                                {role === "ADMIN" &&
                                    order.status === "PENDING" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onConfirm(
                                                order.id
                                            )
                                        }
                                    >
                                        Confirm
                                    </button>

                                )}


                                {/* ADMIN: Dispatch */}
                                {role === "ADMIN" &&
                                    order.status === "CONFIRMED" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDispatch(
                                                order
                                            )
                                        }
                                    >
                                        Dispatch
                                    </button>

                                )}


                                {/* Completed */}
                                {order.status === "DISPATCHED" && (
                                    <span>
                                        Completed
                                    </span>
                                )}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default SalesOrderTable;