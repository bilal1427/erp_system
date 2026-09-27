const productService = require("../services/product.service");

const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getProducts();

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getProducts
};