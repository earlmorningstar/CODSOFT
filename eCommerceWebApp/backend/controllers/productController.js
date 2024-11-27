const Product = require("../models/Products");

const sendError = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({ success: true, message, error });
};

const sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({ success: true, message, data });
};

const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let query = {};

    //filter by category
    if (category) {
      query.category = category;
    }
    //filter by priice range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    // search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query);
    if (products.length === 0) {
      return sendSuccess(res, 200, "No products match the criteria", []);
    }
    sendSuccess(res, 200, "Products retrieved successfully", products);
  } catch (error) {
    sendError(res, 500, "failed to retrieve products", error.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Products not found");
    }
    sendSuccess(res, 200, "Products retrieved successfully", product);
  } catch (error) {
    sendError(res, 500, "Failed to retrieve product", error.message);
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, stock, category, image } = req.body;
  if (!name || !description || !price || !stock || !category || !image) {
    return sendError(res, 400, "All fields are required");
  }
  try {
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image,
    });
    sendSuccess(res, 201, "Product created successfully", product);
  } catch (error) {
    sendError(res, 500, "Failed to create product", error.message);
  }
};

const updateProduct = async (req, res) => {
  const updates = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Product not found");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    sendSuccess(res, 200, "Product updated successfully", updatedProduct);
  } catch (error) {
    sendError(res, 500, "Failed to update product", error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Product not found");
    }
    await Product.deleteOne({ _id: req.params.id });
    sendSuccess(res, 200, "Product deleted successfully");
  } catch (error) {
    sendError(res, 500, "Failed to delete product", error.message);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
