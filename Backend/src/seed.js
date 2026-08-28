const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Review = require('./models/Review');

const seedData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/petcare';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Review.deleteMany({});
        console.log('Cleared existing users, categories, products, and reviews.');

        // 1. Create Users
        const adminUser = await User.create({
            name: 'Admin Master',
            email: 'admin@petcare.com',
            password: 'password123',
            role: 'admin'
        });

        const supplierUser = await User.create({
            name: 'Paws & Claws Supplies Co.',
            email: 'supplier@petcare.com',
            password: 'password123',
            role: 'supplier'
        });

        const customerUser = await User.create({
            name: 'Sarah Jenkins',
            email: 'customer@petcare.com',
            password: 'password123',
            role: 'customer'
        });

        console.log('Created Users: Admin, Supplier, and Customer.');

        // 2. Create Categories
        const categoriesData = [
            {
                name: 'Dog Food & Treats',
                slug: 'dog-food-treats',
                description: 'Nutritious kibble, wet food, and organic delicious treats for all breeds.',
                image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
                icon: 'Bone',
                isActive: true
            },
            {
                name: 'Cat Supplies',
                slug: 'cat-supplies',
                description: 'Gourmet feline nutrition, scratching posts, litter accessories and more.',
                image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
                icon: 'Cat',
                isActive: true
            },
            {
                name: 'Health & Medicine',
                slug: 'health-medicine',
                description: 'Veterinarian-recommended vitamins, flea control, dental care and wellness.',
                image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
                icon: 'ShieldAlert',
                isActive: true
            },
            {
                name: 'Toys & Play',
                slug: 'toys-play',
                description: 'Interactive enrichment toys, durable chews, agility sets, and teasers.',
                image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
                icon: 'Gamepad2',
                isActive: true
            },
            {
                name: 'Grooming & Care',
                slug: 'grooming-care',
                description: 'Organic shampoos, nail clippers, slicker brushes, and deshedding tools.',
                image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
                icon: 'Sparkles',
                isActive: true
            },
            {
                name: 'Beds & Accessories',
                slug: 'beds-accessories',
                description: 'Orthopedic memory foam beds, reflective leashes, collars, and travel carriers.',
                image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80',
                icon: 'BedDouble',
                isActive: true
            }
        ];

        const createdCategories = await Category.insertMany(categoriesData);
        console.log(`Created ${createdCategories.length} categories.`);

        const catMap = {};
        createdCategories.forEach(cat => {
            catMap[cat.slug] = cat._id;
        });

        // 3. Create Sample Products
        const sampleProducts = [
            {
                name: 'Organic Grain-Free Salmon & Sweet Potato Kibble',
                description: 'Crafted with wild-caught Alaskan salmon, farm-grown sweet potatoes, and essential omega-3 fatty acids for optimal coat shine and digestive health.',
                price: 49.99,
                stock: 45,
                category: catMap['dog-food-treats'],
                supplier: supplierUser._id,
                imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80'
                ],
                brand: 'NaturaPaw',
                petType: 'dog',
                features: ['Wild-caught salmon #1 ingredient', 'Grain-free, no corn or soy', 'Rich in DHA & Probiotics', 'Made in USA'],
                rating: 4.8,
                numReviews: 24,
                status: 'active'
            },
            {
                name: 'Crunchy Dental Chews with Mint & Spirulina',
                description: 'Freshens dog breath while scraping away plaque and tartar buildup with every rewarding bite.',
                price: 18.50,
                stock: 80,
                category: catMap['dog-food-treats'],
                supplier: supplierUser._id,
                imageUrl: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80'
                ],
                brand: 'PentaChew',
                petType: 'dog',
                features: ['VOHC Accepted', 'Natural peppermint extract', 'Easy to digest', 'Cleans teeth & gums'],
                rating: 4.6,
                numReviews: 15,
                status: 'active'
            },
            {
                name: 'Multi-Level Sisal Scratching Tree with Hammock',
                description: 'Durable solid wood construction wrapped with 100% natural sisal rope, plush lookout perches, and an ergonomic cozy hammock.',
                price: 89.00,
                stock: 12,
                category: catMap['cat-supplies'],
                supplier: supplierUser._id,
                imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
                ],
                brand: 'CatVenture',
                petType: 'cat',
                features: ['52-inch multi-tier tower', 'Heavy duty anti-toppling base', 'Dual condo hideouts', 'Washable faux-fur cushions'],
                rating: 4.9,
                numReviews: 38,
                status: 'active'
            },
            {
                name: 'Tuna & Chicken Gravy Gourmet Pouch Box (24pk)',
                description: 'Savory broth filled with shredded wild skipjack tuna and tender chicken breast. Hydration-boosting formula.',
                price: 32.99,
                stock: 60,
                category: catMap['cat-supplies'],
                supplier: supplierUser._id,
                imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'
                ],
                brand: 'FelinaBistro',
                petType: 'cat',
                features: ['100% human-grade proteins', 'No artificial colors or preservatives', 'High moisture content', 'Taurine enriched'],
                rating: 4.7,
                numReviews: 19,
                status: 'active'
            },
            {
                name: 'Advanced Hip & Joint Glucosamine Chewables',
                description: 'Powerful mobility formula with Glucosamine HCl, Chondroitin, MSM, and Turmeric to support cartilage repair and ease stiffness.',
                price: 36.00,
                stock: 4,
                category: catMap['health-medicine'],
                supplier: supplierUser._id,
                imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
                ],
                brand: 'VetGuard',
                petType: 'all',
                features: ['800mg Glucosamine per chew', 'Tasty duck flavor', 'Third-party lab tested', 'For adult & senior pets'],
                rating: 4.9,
                numReviews: 52,
                status: 'active'
            },
            {
                name: 'Ultra-Durable Indestructible Rubber Fetch Ball',
                description: 'Engineered for extreme power chewers from non-toxic puncture-resistant thermoplastic natural rubber. Bounces erratically!',
                price: 14.99,
                stock: 120,
                category: catMap['toys-play'],
                supplier: supplierUser._id,
                imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80'
                ],
                brand: 'K-Tuff',
                petType: 'dog',
                features: ['Lifetime replacement guarantee', 'Floats on water', 'Dishwasher safe', 'High bounce elasticity'],
                rating: 4.5,
                numReviews: 29,
                status: 'active'
            },
            {
                name: 'Soothing Oatmeal & Aloe Vera Pet Shampoo (16oz)',
                description: 'Hypoallergenic pH-balanced cleansing formula relieves itchy, dry, sensitive skin while leaving a clean lavender scent.',
                price: 16.99,
                stock: 35,
                category: catMap['grooming-care'],
                supplier: supplierUser._id,
                imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80'
                ],
                brand: 'PureCoat',
                petType: 'all',
                features: ['Soap-free & Tear-free', 'Organic colloidal oatmeal', 'Cruelty-free & Paraben-free', 'Vet endorsed'],
                rating: 4.8,
                numReviews: 41,
                status: 'active'
            },
            {
                name: 'Orthopedic Calming Donut Memory Foam Pet Bed',
                description: 'Designed with raised rim bolstering for head and neck support, deeply padded with human-grade high-density orthopedic memory foam.',
                price: 64.99,
                stock: 18,
                category: catMap['beds-accessories'],
                supplier: supplierUser._id,
                imageUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80'
                ],
                brand: 'CloudPaw',
                petType: 'all',
                features: ['Waterproof internal liner', 'Machine washable zip cover', 'Non-slip grip bottom', 'Relieves joint pressure'],
                rating: 4.9,
                numReviews: 67,
                status: 'active'
            }
        ];

        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`Created ${createdProducts.length} sample products.`);

        // 4. Create Sample Reviews
        const sampleReviews = [
            {
                user: customerUser._id,
                product: createdProducts[0]._id,
                name: customerUser.name,
                rating: 5,
                comment: 'My Golden Retriever absolutely thrives on this salmon formula! His coat has never been shinier and his digestion is perfect.'
            },
            {
                user: customerUser._id,
                product: createdProducts[2]._id,
                name: customerUser.name,
                rating: 5,
                comment: 'Extremely sturdy cat tree. My two adult cats jump around on it vigorously and it does not wobble at all.'
            }
        ];

        await Review.insertMany(sampleReviews);
        console.log(`Created sample reviews.`);

        console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
