// const Product = require("../models/Products");
// const User = require("../models/User");
// const { sendSuccess, sendError } = require("../utils/response");

//Not in use since I'm fetching products from shopify and handling it on the frontend. I'm only working with the Product Schema.

// const getProducts = async (req, res) => {
//   try {
//     const {
//       category,
//       minPrice,
//       maxPrice,
//       search,
//       priceRange,
//       sort,
//       page = 1,
//       limit = 10,
//     } = req.query;
//     let query = {};
//     let sortCriteria = {};

//     //filter by category
//     if (category) {
//       query.category = category;
//     }

//     //filtering by price range (using either minPrice/maxPrice or priceRange)
//     if (priceRange) {
//       const [min, max] = priceRange.split("-");
//       query.price = { $gte: Number(min), $lte: Number(max) };
//     } else if (minPrice || maxPrice) {
//       query.price = {};
//       if (minPrice) query.price.$gte = parseFloat(minPrice);
//       if (maxPrice) query.price.$lte = parseFloat(maxPrice);
//     }

//     // search by name or description
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }

//     //sorting criteria
//     if (sort === "price") sortCriteria.price = 1;
//     if (sort === "-price") sortCriteria.price = -1;
//     if (sort === "rating") sortCriteria.averageRating = 1;

//     const skip = (page - 1) * limit;
//     const products = await Product.find(query)
//       .sort(sortCriteria)
//       .skip(skip)
//       .limit(Number(limit));

//     const totalProducts = await Product.countDocuments(query);

//     if (products.length === 0) {
//       return sendSuccess(res, 200, "No products match the criteria", {
//         products: [],
//         pagination: {
//           currentPage: Number(page),
//           totalPages: Math.ceil(totalProducts / limit),
//           totalProducts,
//         },
//       });
//     }
//     sendSuccess(res, 200, "Products retrieved successfully", {
//       products,
//       pagination: {
//         currentPage: Number(page),
//         totalPages: Math.ceil(totalProducts / limit),
//         totalProducts,
//       },
//     });
//   } catch (error) {
//     sendError(res, 500, "failed to retrieve products", error.message);
//   }
// };

// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return sendError(res, 404, "Products not found");
//     }
//     sendSuccess(res, 200, "Products retrieved successfully", product);
//   } catch (error) {
//     sendError(res, 500, "Failed to retrieve product", error.message);
//   }
// };

// const createProduct = async (req, res) => {
//   const { name, description, price, stock, category, image } = req.body;
//   if (!name || !description || !price || !stock || !category || !image) {
//     return sendError(res, 400, "All fields are required");
//   }
//   try {
//     const product = await Product.create({
//       name,
//       description,
//       price,
//       stock,
//       category,
//       image,
//     });
//     sendSuccess(res, 201, "Product created successfully", product);
//   } catch (error) {
//     sendError(res, 500, "Failed to create product", error.message);
//   }
// };

// const updateProduct = async (req, res) => {
//   const updates = req.body;

//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return sendError(res, 404, "Product not found");
//     }
//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       updates,
//       { new: true }
//     );
//     sendSuccess(res, 200, "Product updated successfully", updatedProduct);
//   } catch (error) {
//     sendError(res, 500, "Failed to update product", error.message);
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return sendError(res, 404, "Product not found");
//     }
//     await Product.deleteOne({ _id: req.params.id });
//     sendSuccess(res, 200, "Product deleted successfully");
//   } catch (error) {
//     sendError(res, 500, "Failed to delete product", error.message);
//   }
// };

// const addToRecentlyViewed = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const user = await User.findById(req.user.id);

//     const product = await Product.findById(productId);
//     if (!product) {
//       sendError(res, 404, "Product not found");
//     }

//     if (!user.recentlyViewed.includes(productId)) {
//       user.recentlyViewed.unshift(productId);
//       if (user.recentlyViewed.length > 10) {
//         user.recentlyViewed.pop();
//       }
//       await user.save();
//     }
//     sendSuccess(res, 200, "Product added to recently viewed");
//   } catch (error) {
//     sendError(res, 500, error.message);
//   }
// };

// const getRecommendations = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate("recentlyViewed");
//     if (!user) {
//       sendError(res, 404, "User not found");
//     }

//     const categories = user.recentlyViewed.map((product) => product.category);
//     const recommendations = await Product.find({
//       category: { $in: categories },
//     })
//       .sort({ rating: -1 })
//       .limit(10);
//     if (!recommendations) {
//       sendError(res, 404, "No recommendations available.");
//     }
//     sendSuccess(res, 200, recommendations);
//   } catch (error) {
//     sendError(res, 500, error.message);
//   }
// };

// const addProductReview = async (req, res) => {
//   try {
//     const { productId, rating, comment } = req.body;
//     const product = await Product.findById(productId);

//     if (!product) {
//       sendError(res, 404, "Product not found");
//       return;
//     }
//     const alreadyreviewed = product.reviews.find(
//       (r) => r.user.toString() === req.user.id.toString()
//     );
//     if (alreadyreviewed) {
//       sendError(res, 400, "Product already reviewed");
//       return;
//     }

//     const review = {
//       user: req.user.id,
//       name: req.user.name,
//       rating: Number(rating),
//       comment,
//     };

//     product.reviews.push(review);
//     product.numberOfRatings = product.reviews.length;
//     product.averageRating =
//       product.reviews.reduce((acc, r) => acc + r.rating, 0) /
//       product.reviews.length;

//     await product.save();

//     sendSuccess(res, 200, "Review added successfully");
//   } catch (error) {
//     sendError(res, 500, error.message);
//   }
// };

// module.exports = {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   addToRecentlyViewed,
//   getRecommendations,
//   addProductReview,
// };
