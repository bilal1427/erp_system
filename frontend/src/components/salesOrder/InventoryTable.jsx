import React from "react";

const InventoryTable = ({
    inventory,
    loading
}) => {

    if (loading) {
        return (
            <p>
                Loading inventory...
            </p>
        );
    }


    if (!inventory.length) {
        return (
            <div className="empty-state">
                No inventory records found.
            </div>
        );
    }


    return (
        <div className="table-container">

            <table>

                <thead>

                    <tr>
                        <th>Product</th>
                        <th>Physical</th>
                        <th>Reserved</th>
                        <th>Available</th>
                    </tr>

                </thead>


                <tbody>

                    {inventory.map((item) => {

                        const physical =
                            Number(
                                item.physical_quantity
                            ) || 0;

                        const reserved =
                            Number(
                                item.reserved_quantity
                            ) || 0;

                        const available =
                            item.available_quantity ??
                            physical - reserved;


                        return (
                            <tr key={item.id}>

                                <td>
                                    {[item.product_code, item.product_name]
                                        .filter(Boolean)
                                        .join(" - ") || "-"}
                                </td>

                                <td>
                                    {physical}
                                </td>

                                <td>
                                    {reserved}
                                </td>

                                <td>
                                    <strong>
                                        {available}
                                    </strong>
                                </td>

                            </tr>
                        );

                    })}

                </tbody>

            </table>

        </div>
    );
};

export default InventoryTable;