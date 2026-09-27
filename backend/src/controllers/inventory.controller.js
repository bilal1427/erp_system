const inventoryService = require("../services/inventory.service");

const getInventory = async (req, res, next) => {
    try {
        const inventory = await inventoryService.getInventory();

        return res.status(200).json({
            success: true,
            data: inventory
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getInventory
};