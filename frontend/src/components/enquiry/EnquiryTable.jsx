import React from "react";
import {
    formatDate,
    formatStatus
} from "../../utils/formatters";

const EnquiryTable = ({ enquiries, loading }) => {

    if (loading) {
        return <p>Loading enquiries...</p>;
    }

    if (!enquiries.length) {
        return (
            <div className="empty-state">
                No enquiries found.
            </div>
        );
    }

    return (
        <div className="table-container">

            <table>

                <thead>

                    <tr>
                        <th>Enquiry No.</th>
                        <th>Customer</th>
                        <th>Enquiry Date</th>
                        <th>Required Date</th>
                        <th>Products</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    {enquiries.map((enquiry) => (

                        <tr key={enquiry.id}>

                            <td>
                                {enquiry.enquiry_number}
                            </td>

                            <td>
                                {enquiry.company_name ||
                                    enquiry.customer_name ||
                                    enquiry.customer?.company_name ||
                                    "-"}
                            </td>

                            <td>
                                {formatDate(
                                    enquiry.enquiry_date
                                )}
                            </td>

                            <td>
                                {formatDate(
                                    enquiry.required_date
                                )}
                            </td>

                            <td>
                                {enquiry.items?.length || 0}
                            </td>

                            <td>
                                <span
                                    className={`status status-${String(
                                        enquiry.status || ""
                                    ).toLowerCase()}`}
                                >
                                    {formatStatus(
                                        enquiry.status
                                    )}
                                </span>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default EnquiryTable;