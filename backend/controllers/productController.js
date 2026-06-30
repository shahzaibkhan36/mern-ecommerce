const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const query = {};

    if (keyword) query.name = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      'price-asc': { price: 1 }, 'price-desc': { price: -1 },
      'rating': { rating: -1 }, 'newest': { createdAt: -1 }, 'popular': { sold: -1 }
    };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = [
      {
        name: 'Premium Wireless Headphones',
        description: 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and ultra-comfortable over-ear design.',
        price: 299.99, originalPrice: 399.99,
        category: 'Electronics', brand: 'SoundPro',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80'],
        stock: 50, featured: true, tags: ['wireless', 'audio', 'headphones']
      },
      {
        name: 'Smart Watch Series X',
        description: 'Stay connected with the Smart Watch Series X. Tracks fitness, heart rate, sleep, and displays notifications. Water-resistant up to 50 meters.',
        price: 449.99, originalPrice: 549.99,
        category: 'Electronics', brand: 'TechWear',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80'],
        stock: 30, featured: true, tags: ['smartwatch', 'fitness', 'wearable']
      },
      {
        name: 'Ultra HD 4K Camera',
        description: 'Capture life in stunning 4K resolution. This professional-grade camera features optical image stabilization, 20MP sensor, and AI-powered autofocus.',
        price: 899.99, originalPrice: 1099.99,
        category: 'Electronics', brand: 'SnapPro',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'],
        stock: 20, featured: true, tags: ['camera', '4k', 'photography']
      },
      {
        name: 'Designer Leather Jacket',
        description: 'Premium genuine leather jacket with modern slim-fit design. Hand-crafted with attention to every detail, featuring YKK zippers and a luxurious inner lining.',
        price: 349.99, originalPrice: 499.99,
        category: 'Clothing', brand: 'UrbanEdge',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'],
        stock: 40, featured: true, tags: ['jacket', 'leather', 'fashion']
      },
      {
        name: 'Running Performance Shoes',
        description: 'Engineered for peak performance. Lightweight foam midsole, breathable mesh upper, and advanced traction outsole make these the perfect marathon companion.',
        price: 189.99, originalPrice: 229.99,
        category: 'Sports', brand: 'SwiftRun',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
        stock: 80, featured: true, tags: ['shoes', 'running', 'sports']
      },
      {
        name: 'Minimalist Laptop Backpack',
        description: 'Sleek and functional 30L backpack designed for the modern professional. Fits laptops up to 16", TSA-friendly, waterproof exterior with multiple organizer pockets.',
        price: 129.99, originalPrice: 159.99,
        category: 'Clothing', brand: 'NomadBag',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'],
        stock: 60, featured: false, tags: ['backpack', 'laptop', 'travel']
      },
      {
        name: 'Wireless Gaming Mouse',
        description: '25,000 DPI optical sensor with zero-latency wireless connection. Ergonomic design with 11 programmable buttons and 70-hour battery. RGB lighting with 16.8M colors.',
        price: 79.99, originalPrice: 99.99,
        category: 'Electronics', brand: 'GameForce',
        images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80'],
        stock: 100, featured: false, tags: ['gaming', 'mouse', 'wireless']
      },
      {
        name: 'Organic Skincare Set',
        description: 'Complete 5-piece skincare routine using 100% organic ingredients. Includes cleanser, toner, serum, moisturizer, and SPF 50 sunscreen. Dermatologist tested.',
        price: 89.99, originalPrice: 119.99,
        category: 'Beauty', brand: 'PureGlow',
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80'],
        stock: 70, featured: false, tags: ['skincare', 'organic', 'beauty']
      },
      {
        name: 'Premium Coffee Maker',
        description: 'Barista-quality coffee at home. Programmable 12-cup capacity, built-in grinder, milk frother, and temperature control. Compatible with all coffee pod systems.',
        price: 249.99, originalPrice: 329.99,
        category: 'Home & Garden', brand: 'BrewMaster',
        images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80'],
        stock: 25, featured: false, tags: ['coffee', 'kitchen', 'appliance']
      },
      {
        name: 'Yoga & Fitness Mat',
        description: 'Professional grade 6mm thick yoga mat with alignment lines. Non-slip surface, eco-friendly materials, and carrying strap included. Perfect for yoga, pilates, and stretching.',
        price: 69.99, originalPrice: 89.99,
        category: 'Sports', brand: 'ZenFit',
        images: ['https://images.unsplash.com/photo-1601925228946-6a0b89a17b0f?w=600&q=80'],
        stock: 90, featured: false, tags: ['yoga', 'fitness', 'mat']
      },
      {
        name: 'The Art of Code',
        description: 'A bestselling guide to writing clean, maintainable, and elegant code. Covers design patterns, refactoring techniques, and the philosophy behind great software.',
        price: 49.99, originalPrice: 59.99,
        category: 'Books', brand: 'TechPress',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'],
        stock: 200, featured: false, tags: ['programming', 'book', 'coding']
      },
      {
        name: 'Smart Home Speaker Hub',
        description: 'Control your smart home with voice commands. Features 360° surround sound, built-in AI assistant, Zigbee hub, and compatibility with 10,000+ smart devices.',
        price: 199.99, originalPrice: 249.99,
        category: 'Electronics', brand: 'SmartLife',
        images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&q=80'],
        stock: 45, featured: true, tags: ['smart home', 'speaker', 'AI']
      }
    ];
    const created = await Product.insertMany(products);
    res.json({ message: `Seeded ${created.length} products`, count: created.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
