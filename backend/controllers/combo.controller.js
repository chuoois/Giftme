const Combos = require('../models/combo.model');
const mongoose = require('mongoose');

const getSuggestedCombos = async (req, res) => {
  try {
    const { id } = req.params; // id combo hiện tại

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid combo ID format",
      });
    }

    // Lấy combo hiện tại để biết occasion
    const currentCombo = await Combos.findById(id);
    if (!currentCombo) {
      return res.status(404).json({
        success: false,
        message: "Combo not found",
      });
    }

    // Tìm 3 combo khác có cùng occasion
    const combos = await Combos.find({
      _id: { $ne: id },
      occasion: currentCombo.occasion,
    })
      .limit(3)
      .select("-__v");

    res.status(200).json({
      success: true,
      data: combos,
      message: "Suggested combos retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getSuggestedCombos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

const getHotCombos = async (req, res) => {
    try {
        const hotCombos = await Combos.find({ badge: "HOT" })
            .sort({ createdAt: -1 })
            .limit(4);

        return res.status(200).json({
            success: true,
            data: hotCombos,
        });
    } catch (error) {
        console.error("Error fetching hot combos:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy sản phẩm HOT",
        });
    }
};


/**
 * GET - Lấy danh sách combo (có sẵn từ trước)
 */
const getComboList = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search = '',
            category = '',
            occasion = '',
            minPrice = 0,
            maxPrice = 0,
            badge = '',
            sortBy = 'popular'
        } = req.query;

        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const filter = {};
        if (search && search.trim()) {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }
        if (category && category.trim()) filter.category = category.trim();
        if (occasion && occasion.trim()) filter.occasion = occasion.trim();
        if (badge && badge.trim()) filter.badge = badge.trim();

        const minPriceNum = parseInt(minPrice) || 0;
        const maxPriceNum = parseInt(maxPrice) || 0;
        if (minPriceNum > 0 || maxPriceNum > 0) {
            filter.price = {};
            if (minPriceNum > 0) filter.price.$gte = minPriceNum;
            if (maxPriceNum > 0) filter.price.$lte = maxPriceNum;
        }

        // Build sort
        let sort = {};
        switch (sortBy) {
            case 'popular':
                sort = { popularity: -1, viewCount: -1, orderCount: -1, createdAt: -1 };
                break;
            case 'price_low':
                sort = { price: 1 };
                break;
            case 'price_high':
                sort = { price: -1 };
                break;
            case 'discount':
                sort = { discount: -1, price: 1 };
                break;
            case 'name_az':
                sort = { name: 1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        const [combos, total] = await Promise.all([
            Combos.find(filter).sort(sort).skip(skip).limit(limitNum).select('-__v').lean(),
            Combos.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            success: true,
            data: {
                combos,
                pagination: {
                    currentPage: pageNum,
                    totalPages: totalPages,
                    totalItems: total,
                    itemsPerPage: limitNum,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1
                }
            },
            message: `Found ${total} combos`
        });

    } catch (error) {
        console.error('Error in getComboList:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * GET - Lấy chi tiết 1 combo
 */
const getComboById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid combo ID format'
            });
        }

        const combo = await Combos.findById(id).select('-__v');

        if (!combo) {
            return res.status(404).json({
                success: false,
                message: 'Combo not found'
            });
        }

        // Tăng view count
        await Combos.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

        res.status(200).json({
            success: true,
            data: combo,
            message: 'Combo retrieved successfully'
        });

    } catch (error) {
        console.error('Error in getComboById:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * POST - Thêm combo mới
 */
const addCombo = async (req, res) => {
    try {
        const {
            name,
            price,
            originalPrice,
            image,
            badge,
            discount,
            category,
            occasion,
            priceRange,
            description,
            features,
            includes,
            gallery
        } = req.body;

        // Validation
        if (!name || !price || !originalPrice || !image || !category || !occasion) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, price, originalPrice, image, category, occasion'
            });
        }

        if (price < 0 || originalPrice < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price and originalPrice must be positive numbers'
            });
        }

        if (price > originalPrice) {
            return res.status(400).json({
                success: false,
                message: 'Price cannot be higher than original price'
            });
        }

        // Validate badge enum
        if (badge && !['HOT', 'NEW', 'SALE', 'LIMITED'].includes(badge)) {
            return res.status(400).json({
                success: false,
                message: 'Badge must be one of: HOT, NEW, SALE, LIMITED'
            });
        }

        // Tự động tính discount nếu không có
        const calculatedDiscount = discount || Math.round(((originalPrice - price) / originalPrice) * 100);

        // Tự động set priceRange nếu không có
        let autoPriceRange = priceRange;
        if (!autoPriceRange) {
            if (price < 100000) autoPriceRange = 'Dưới 100K';
            else if (price < 300000) autoPriceRange = '100K-300K';
            else if (price < 500000) autoPriceRange = '300K-500K';
            else if (price < 1000000) autoPriceRange = '500K-1M';
            else autoPriceRange = 'Trên 1M';
        }

        const newCombo = new Combos({
            name: name.trim(),
            price,
            originalPrice,
            image,
            badge: badge || null,
            discount: calculatedDiscount,
            category: category.trim(),
            occasion: occasion.trim(),
            priceRange: autoPriceRange,
            description: description?.trim() || '',
            features: features || [],
            includes: includes || [],
            gallery: gallery || [],
            popularity: 0,
            viewCount: 0,
            orderCount: 0
        });

        const savedCombo = await newCombo.save();

        res.status(201).json({
            success: true,
            data: savedCombo,
            message: 'Combo created successfully'
        });

    } catch (error) {
        console.error('Error in addCombo:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Combo name already exists'
            });
        }

        // Handle validation error
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * PUT - Cập nhật combo
 */
const editCombo = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid combo ID format'
            });
        }

        // Check if combo exists
        const existingCombo = await Combos.findById(id);
        if (!existingCombo) {
            return res.status(404).json({
                success: false,
                message: 'Combo not found'
            });
        }

        // Validate price fields if provided
        if (updateData.price !== undefined && updateData.price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a positive number'
            });
        }

        if (updateData.originalPrice !== undefined && updateData.originalPrice < 0) {
            return res.status(400).json({
                success: false,
                message: 'Original price must be a positive number'
            });
        }

        // Validate price logic
        const newPrice = updateData.price !== undefined ? updateData.price : existingCombo.price;
        const newOriginalPrice = updateData.originalPrice !== undefined ? updateData.originalPrice : existingCombo.originalPrice;

        if (newPrice > newOriginalPrice) {
            return res.status(400).json({
                success: false,
                message: 'Price cannot be higher than original price'
            });
        }

        // Validate badge enum
        if (updateData.badge && !['HOT', 'NEW', 'SALE', 'LIMITED'].includes(updateData.badge)) {
            return res.status(400).json({
                success: false,
                message: 'Badge must be one of: HOT, NEW, SALE, LIMITED'
            });
        }

        // Auto-calculate discount if price changed
        if (updateData.price !== undefined || updateData.originalPrice !== undefined) {
            updateData.discount = Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100);
        }

        // Auto-set priceRange if price changed and priceRange not provided
        if (updateData.price !== undefined && updateData.priceRange === undefined) {
            if (newPrice < 100000) updateData.priceRange = 'Dưới 100K';
            else if (newPrice < 300000) updateData.priceRange = '100K-300K';
            else if (newPrice < 500000) updateData.priceRange = '300K-500K';
            else if (newPrice < 1000000) updateData.priceRange = '500K-1M';
            else updateData.priceRange = 'Trên 1M';
        }

        // Trim string fields
        if (updateData.name) updateData.name = updateData.name.trim();
        if (updateData.category) updateData.category = updateData.category.trim();
        if (updateData.occasion) updateData.occasion = updateData.occasion.trim();
        if (updateData.description) updateData.description = updateData.description.trim();

        // Update combo
        const updatedCombo = await Combos.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('-__v');

        res.status(200).json({
            success: true,
            data: updatedCombo,
            message: 'Combo updated successfully'
        });

    } catch (error) {
        console.error('Error in editCombo:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Combo name already exists'
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * DELETE - Xóa combo
 */
const deleteCombo = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid combo ID format'
            });
        }

        const deletedCombo = await Combos.findByIdAndDelete(id);

        if (!deletedCombo) {
            return res.status(404).json({
                success: false,
                message: 'Combo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: deletedCombo,
            message: 'Combo deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteCombo:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

module.exports = {
    getHotCombos,
    getComboList,
    getComboById,
    addCombo,
    editCombo,
    deleteCombo,
    getSuggestedCombos
};