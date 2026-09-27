import React from "react";
import { formatCurrency } from "../../utils/formatters";

const QuotationSummary = ({ items }) => {
    let subtotal = 0;
    let discountTotal = 0;
    let gstTotal = 0;
    let grandTotal = 0;

    items.forEach((item) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.unit_price) || 0;
        const discount = Number(item.discount_percent) || 0;
        const gst = Number(item.gst_percent) || 0;

        const baseAmount = quantity * price;
        const discountAmount = baseAmount * discount / 100;
        const taxableAmount = baseAmount - discountAmount;
        const gstAmount = taxableAmount * gst / 100;

        subtotal += baseAmount;
        discountTotal += discountAmount;
        gstTotal += gstAmount;
        grandTotal += taxableAmount + gstAmount;
    });

    return (
        <div className="quotation-summary">
            <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="summary-row">
                <span>Discount</span>
                <strong>{formatCurrency(discountTotal)}</strong>
            </div>
            <div className="summary-row">
                <span>GST</span>
                <strong>{formatCurrency(gstTotal)}</strong>
            </div>
            <div className="summary-row total">
                <span>Grand Total</span>
                <strong>{formatCurrency(grandTotal)}</strong>
            </div>
        </div>
    );
};

export default QuotationSummary;
