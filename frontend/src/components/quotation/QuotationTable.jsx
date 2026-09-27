import React from "react";

import {
    formatCurrency,
    formatDate,
    formatStatus
} from "../../utils/formatters";

const QuotationTable = ({
    quotations,
    onStatusChange,
    onConvert
}) => {

    if (!quotations.length) {
        return (
            <div className="empty-state">
                No quotations found.
            </div>
        );
    }

    return (
        <div className="table-container">

            <table>

                <thead>
                    <tr>
                        <th>Quotation</th>
                        <th>Customer</th>
                        <th>Enquiry</th>
                        <th>Total</th>
                        <th>Valid Until</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {quotations.map((quotation) => (

                        <tr key={quotation.id}>

                            <td>
                                {quotation.quotation_number}
                            </td>

                            <td>
                                {quotation.company_name ||
                                    quotation.customer_name ||
                                    quotation.customer?.company_name ||
                                    "-"}
                            </td>

                            <td>
                                {quotation.enquiry_number ||
                                    quotation.enquiry?.enquiry_number ||
                                    "-"}
                            </td>

                            <td>
                                {formatCurrency(
                                    quotation.grand_total
                                )}
                            </td>

                            <td>
                                {formatDate(
                                    quotation.valid_until
                                )}
                            </td>

                            <td>
                                {formatStatus(
                                    quotation.status
                                )}
                            </td>

                            <td>

                                {quotation.status === "DRAFT" && (
                                    <button
                                        onClick={() =>
                                            onStatusChange(
                                                quotation.id,
                                                "SENT"
                                            )
                                        }
                                    >
                                        Send
                                    </button>
                                )}

                                {quotation.status === "SENT" && (
                                    <>
                                        <button
                                            onClick={() =>
                                                onStatusChange(
                                                    quotation.id,
                                                    "ACCEPTED"
                                                )
                                            }
                                        >
                                            Accept
                                        </button>

                                        <button
                                            onClick={() =>
                                                onStatusChange(
                                                    quotation.id,
                                                    "REJECTED"
                                                )
                                            }
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                                {quotation.status === "ACCEPTED" && (
                                    <button
                                        onClick={() =>
                                            onConvert(
                                                quotation.id
                                            )
                                        }
                                    >
                                        Convert to Order
                                    </button>
                                )}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default QuotationTable;