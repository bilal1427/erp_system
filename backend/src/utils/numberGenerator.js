/**
 * Generates a padded reference number string.
 * @param {string} prefix - e.g. "ENQ", "QUO", "SO", "DSP"
 * @param {number} nextNumber - the next sequential number
 * @returns {string} e.g. "ENQ-00001"
 */
const generateNumber = (prefix, nextNumber) => {
    return `${prefix}-${String(nextNumber).padStart(5, "0")}`;
};

module.exports = { generateNumber };
