const toMoney = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;

/**
 * Calculates line amounts for a single quotation item.
 * @param {object} item - { quantity, unitPrice, discountPercent, gstPercent }
 * @returns {object} - { baseAmount, discountAmount, taxableAmount, gstAmount, lineAmount }
 */
const calculateLineItem = ({ quantity, unitPrice, discountPercent = 0, gstPercent = 18 }) => {
    const qty = Number(quantity);
    const price = Number(unitPrice);
    const discount = Number(discountPercent);
    const gst = Number(gstPercent);

    const baseAmount = toMoney(qty * price);
    const discountAmount = toMoney(baseAmount * (discount / 100));
    const taxableAmount = toMoney(baseAmount - discountAmount);
    const gstAmount = toMoney(taxableAmount * (gst / 100));
    const lineAmount = toMoney(taxableAmount + gstAmount);

    return { baseAmount, discountAmount, taxableAmount, gstAmount, lineAmount };
};

/**
 * Calculates grand total from an array of line items.
 * @param {Array} items - array of { quantity, unitPrice, discountPercent, gstPercent }
 * @returns {number} grandTotal
 */
const calculateGrandTotal = (items) => {
    return items.reduce((total, item) => {
        const { lineAmount } = calculateLineItem(item);
        return toMoney(total + lineAmount);
    }, 0);
};

module.exports = { toMoney, calculateLineItem, calculateGrandTotal };
