const Product = require('../../models/Product');



const productController = { 
    //Product Options
    addProductOption: async (req, res) => {
        const { productId, optionName, regularPrice, scopeOnPrice, discount, monthlyVoucherCap } = req.body;

        try {
          // Find the product to which the option will be added
          const product = await Product.findById(productId);
          if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }
      
          // Create the new ProductOption with productId
          const newProductOption = {
            optionName,
            regularPrice,
            scopeOnPrice,
            discount,
            monthlyVoucherCap,
            productId, // Set the productId in the ProductOption
          };
      
          // Add the new product option to the product's productOptions array
          product.productOptions.push(newProductOption);
      
          // Save the updated product
          await product.save();
      
          res.status(201).json({
            message: 'Product option created successfully',
            productOption: newProductOption,
          });
        } catch (err) {
          console.error('Error creating product option:', err);
          res.status(500).json({ message: 'Server error' });
        }
    },
    updateProductOption : async (req, res) => {
        const { optionName, regularPrice, scopeOnPrice, discount, monthlyVoucherCap } = req.body;
        const { productId, optionId } = req.params; // Get both productId and optionId from route parameters
      
        try {
          // Find the product to update the option in
          const product = await Product.findById(productId);
          if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }
      
          // Find the product option to update
          const productOption = product.productOptions.id(optionId); // Find by optionId from params
          if (!productOption) {
            return res.status(404).json({ message: 'Product option not found' });
          }
      
          // Update the fields of the product option
          productOption.optionName = optionName || productOption.optionName;
          productOption.regularPrice = regularPrice || productOption.regularPrice;
          productOption.scopeOnPrice = scopeOnPrice || productOption.scopeOnPrice;
          productOption.discount = discount || productOption.discount;
          productOption.monthlyVoucherCap = monthlyVoucherCap || productOption.monthlyVoucherCap;
      
          // Save the updated product
          await product.save();
      
          res.status(200).json({
            message: 'Product option updated successfully',
            productOption: productOption
          });
        } catch (err) {
          console.error('Error updating product option:', err);
          res.status(500).json({ message: 'Server error' });
        }
    },
    deleteProductOption: async (req, res) => {
        const { productId, optionId } = req.params; // Get both productId and optionId from route parameters

        try {
            // Find the product to remove the option from
            const product = await Product.findById(productId);
            if (!product) {
            return res.status(404).json({ message: 'Product not found' });
            }

            // Find the product option to remove by optionId
            const productOption = product.productOptions.id(optionId);
            if (!productOption) {
            return res.status(404).json({ message: 'Product option not found' });
            }

            // Remove the product option
            product.productOptions.pull(optionId); // Remove the option by ID

            // Save the updated product
            await product.save();

            res.status(200).json({
            message: 'Product option deleted successfully',
            deletedOption: productOption
            });
        } catch (err) {
            console.error('Error deleting product option:', err);
            res.status(500).json({ message: 'Server error' });
        }
      },
    getAllProductOptions: async (req, res) => {
        try {
            // Retrieve all products
            const products = await Product.find();
        
            // Extract all product options from the products
            const allProductOptions = products.flatMap(product => product.productOptions);
        
            if (allProductOptions.length === 0) {
              return res.status(404).json({ message: 'No product options found' });
            }
        
            res.status(200).json({
              message: 'Product options retrieved successfully',
              productOptions: allProductOptions
            });
          } catch (err) {
            console.error('Error retrieving product options:', err);
            res.status(500).json({ message: 'Server error' });
          }
      },
    getProductOptionById: async (req, res) => {
        const { productId, optionId } = req.params; // Extract productId and optionId from route parameters

        try {
            // Find the product by productId
            const product = await Product.findById(productId);
            if (!product) {
            return res.status(404).json({ message: 'Product not found' });
            }

            // Find the product option by optionId
            const productOption = product.productOptions.id(optionId); // Use the id method to find the product option by optionId
            if (!productOption) {
            return res.status(404).json({ message: 'Product option not found' });
            }

            res.status(200).json({
            message: 'Product option retrieved successfully',
            productOption: productOption
            });
        } catch (err) {
            console.error('Error retrieving product option:', err);
            res.status(500).json({ message: 'Server error' });
        }
      },


    //Product
 createProduct: async (req, res) => {
  const { title, category, highlight, description, productOptions } = req.body; // Extract product details from the request body

  try {
    // Create a new product using the provided details
    const newProduct = new Product({
      title,
      category,
      highlight,
      description,
      productOptions
    });

    // Save the new product to the database
    await newProduct.save();

    // Return a success response
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
},
 updateProduct : async (req, res) => {
    const { productId } = req.params; // Extract the productId from route parameters
    const { title, category, highlight, description, productOptions } = req.body; // Extract updated product details from the request body
  
    try {
      // Find the product by its ID
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Update the product fields with new data
      product.title = title || product.title;
      product.category = category || product.category;
      product.highlight = highlight || product.highlight;
      product.description = description || product.description;
      product.productOptions = productOptions || product.productOptions; // Only update if provided
  
      // Save the updated product to the database
      await product.save();
  
      // Return a success response with updated product data
      res.status(200).json({
        message: 'Product updated successfully',
        product: product
      });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
// Function to delete a product by ID
deleteProduct: async (req, res) => {
    const { productId } = req.params; // Extract the productId from route parameters
  
    try {
      // Find the product by its ID and delete it
      const product = await Product.findByIdAndDelete(productId); // Use findByIdAndDelete instead
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Return a success response
      res.status(200).json({
        message: 'Product deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
  

 getAllProducts : async (req, res) => {
    try {
      // Retrieve all products from the database
      const products = await Product.find();
  
      // If no products are found
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
      }
  
      // Return the list of products
      res.status(200).json({
        message: 'Products retrieved successfully',
        products: products
      });
    } catch (err) {
      console.error('Error retrieving products:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
   getProductById : async (req, res) => {
    const { id } = req.params; // Get the product ID from route parameters
  
    try {
      // Find the product by its ID
      const product = await Product.findById(id);
  
      // If the product is not found
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Return the found product
      res.status(200).json({
        message: 'Product retrieved successfully',
        product: product
      });
    } catch (err) {
      console.error('Error retrieving product:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

};

module.exports = productController;

