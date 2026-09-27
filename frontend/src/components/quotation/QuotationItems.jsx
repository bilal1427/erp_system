import React from "react";

const QuotationItem = ({
    item,
    index,
    products,
    onChange,
    onRemove,
    canRemove
}) => {

    return (
        <div className="quotation-item">

            <select
                value={item.product_id}
                onChange={(e) =>
                    onChange(
                        index,
                        "product_id",
                        e.target.value
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
                        {product.product_code} -{" "}
                        {product.product_name}
                    </option>
                ))}
            </select>

            <input
                type="number"
                min="1"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                    onChange(
                        index,
                        "quantity",
                        e.target.value
                    )
                }
            />

            <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Unit Price"
                value={item.unit_price}
                onChange={(e) =>
                    onChange(
                        index,
                        "unit_price",
                        e.target.value
                    )
                }
            />

            <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Discount %"
                value={item.discount_percent}
                onChange={(e) =>
                    onChange(
                        index,
                        "discount_percent",
                        e.target.value
                    )
                }
            />

            <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="GST %"
                value={item.gst_percent}
                onChange={(e) =>
                    onChange(
                        index,
                        "gst_percent",
                        e.target.value
                    )
                }
            />

            <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={!canRemove}
            >
                Remove
            </button>

        </div>
    );
};

export default QuotationItem;