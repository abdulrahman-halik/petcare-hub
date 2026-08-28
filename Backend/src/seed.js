const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Pet = require('./models/Pet');
const Reminder = require('./models/Reminder');
const Notification = require('./models/Notification');

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
        await Pet.deleteMany({});
        await Reminder.deleteMany({});
        await Notification.deleteMany({});
        console.log('Cleared existing users, categories, products, reviews, pets, reminders, and notifications.');

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
                name: 'Puppy Growth & DHA Brain Development Kibble',
                description: 'Complete balanced nutrition specially formulated for growing puppies under 18 months. Packed with pasture-raised chicken, DHA from salmon oil, and calcium for strong bones.',
                price: 42.50,
                stock: 50,
                category: catMap['dog-food-treats'],
                supplier: supplierUser._id,
                imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80'
                ],
                brand: 'PuppyBloom',
                petType: 'dog',
                features: ['DHA for puppy cognitive development', 'Small bite-sized kibbles for puppy jaws', 'Triple calcium & phosphorus for bone strength', 'Vet formulated'],
                rating: 4.9,
                numReviews: 31,
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
                stock: 40,
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
                product: createdProducts[3]._id,
                name: customerUser.name,
                rating: 5,
                comment: 'Extremely sturdy cat tree. My two adult cats jump around on it vigorously and it does not wobble at all.'
            }
        ];

        await Review.insertMany(sampleReviews);
        console.log(`Created sample reviews.`);

        // 5. Create Sample Pet Profiles for Customer (Sarah Jenkins)
        const samplePets = [
            {
                name: 'Bailey',
                species: 'dog',
                breed: 'Golden Retriever',
                age: 0.8,
                birthDate: new Date('2025-12-15'),
                gender: 'male',
                weight: 18,
                activityLevel: 'high',
                medicalConditions: ['Teething', 'Rapid Growth Stage'],
                allergies: [],
                dietaryPreferences: ['High-Protein', 'Grain-Free'],
                microchipNumber: '985141002341908',
                imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
                owner: customerUser._id
            },
            {
                name: 'Oliver',
                species: 'cat',
                breed: 'Persian Cat',
                age: 8,
                birthDate: new Date('2018-05-10'),
                gender: 'male',
                weight: 4.8,
                activityLevel: 'low',
                medicalConditions: ['Joint Stiffness / Arthritis', 'Hairballs'],
                allergies: ['Wheat / Grain'],
                dietaryPreferences: ['Grain-Free', 'Wet Gravy'],
                microchipNumber: '985141002341909',
                imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
                owner: customerUser._id
            },
            {
                name: 'Kiwi',
                species: 'bird',
                breed: 'Sun Conure',
                age: 2,
                birthDate: new Date('2024-03-20'),
                gender: 'female',
                weight: 0.12,
                activityLevel: 'high',
                medicalConditions: ['Beak Care Maintenance'],
                allergies: [],
                dietaryPreferences: ['Organic Seeds & Fresh Fruit'],
                imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
                owner: customerUser._id
            }
        ];

        const createdPets = await Pet.insertMany(samplePets);
        console.log(`Created ${createdPets.length} pets for customer ${customerUser.name}.`);

        // 6. Create Sample Pet Care Reminders
        const bailey = createdPets[0];
        const oliver = createdPets[1];

        const now = new Date();
        const addDays = (days) => {
            const d = new Date(now);
            d.setDate(d.getDate() + days);
            return d;
        };

        const sampleReminders = [
            {
                owner: customerUser._id,
                pet: bailey._id,
                title: 'Rabies & DHPP Puppy Booster Shot',
                type: 'vaccination',
                dueDate: addDays(14),
                time: '10:30 AM',
                frequency: 'yearly',
                notes: 'Visit Dr. Evans at Downtown Vet Clinic. Bring puppy vaccination booklet.',
                status: 'pending',
                isAutomated: true
            },
            {
                owner: customerUser._id,
                pet: bailey._id,
                title: 'Monthly Flea & Tick Chewable',
                type: 'medication',
                dueDate: addDays(3),
                time: '08:00 AM',
                frequency: 'monthly',
                notes: 'Give with morning meal. Brand: NexGard.',
                status: 'pending',
                isAutomated: false
            },
            {
                owner: customerUser._id,
                pet: bailey._id,
                title: 'Puppy Socialization & Grooming Bath',
                type: 'grooming',
                dueDate: addDays(-2),
                time: '02:00 PM',
                frequency: 'monthly',
                notes: 'Use gentle hypoallergenic oatmeal puppy wash and clean ear flaps.',
                status: 'overdue',
                isAutomated: false
            },
            {
                owner: customerUser._id,
                pet: oliver._id,
                title: 'Senior Joint Glucosamine Supplement',
                type: 'medication',
                dueDate: addDays(1),
                time: '09:00 AM',
                frequency: 'daily',
                notes: 'Mix 1 chew with Oliver’s morning wet salmon food pouch.',
                status: 'pending',
                isAutomated: false
            },
            {
                owner: customerUser._id,
                pet: oliver._id,
                title: 'Senior Vitality & Dental Checkup',
                type: 'vet-visit',
                dueDate: addDays(45),
                time: '11:00 AM',
                frequency: 'yearly',
                notes: 'Annual comprehensive geriatric wellness bloodwork and dental examination.',
                status: 'pending',
                isAutomated: true
            }
        ];

        const createdReminders = await Reminder.insertMany(sampleReminders);
        console.log(`Created ${createdReminders.length} sample pet care reminders.`);

        // 7. Create Sample In-App Notification
        await Notification.create({
            user: customerUser._id,
            title: '🐾 Pet Care Alert: Upcoming Medication',
            message: `Oliver's Senior Joint Glucosamine Supplement is scheduled for tomorrow at 09:00 AM.`,
            type: 'Reminder',
            isRead: false
        });

        console.log('--- PHASE 4 SEEDING COMPLETED SUCCESSFULLY ---');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
