import React from "react";
import { formatCurrency, formatDate, formatStatus } from "../../utils/formatters";

const SalesOrderDetails = ({ order }) => {
    if (!order) return null;

    return (
        <div className="sales-order-details">
            <div className="detail-row">
                <span>Order</span>
                <strong>{order.order_number}</strong>
            </div>
            <div className="detail-row">
                <span>Customer</span>
                <strong>{order.company_name || order.customer_name || "-"}</strong>
            </div>
            <div className="detail-row">
                <span>Quotation</span>
                <strong>{order.quotation_number || "-"}</strong>
            </div>
            <div className="detail-row">
                <span>Date</span>
                <strong>{formatDate(order.order_date)}</strong>
            </div>
            <div className="detail-row">
                <span>Status</span>
                <strong>
                    <span className={`status status-${String(order.status || "").toLowerCase()}`}>
                        {formatStatus(order.status)}
                    </span>
                </strong>
            </div>
            <div className="detail-row">
                <span>Total</span>
                <strong>{formatCurrency(order.total_amount)}</strong>
            </div>

            <div className="order-items">
                <h3>Items</h3>
                {order.items?.length ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.product_id}>
                                        <td>
                                            {[item.product_code, item.product_name]
                                                .filter(Boolean)
                                                .join(" - ") || `Product ${item.product_id}`}
                                        </td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No items found.</p>
                )}
            </div>
        </div>
    );
};

export default SalesOrderDetails;
