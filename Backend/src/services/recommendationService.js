const Product = require('../models/Product');
const Pet = require('../models/Pet');

/**
 * Normalizes string for keyword matching
 */
const hasKeyword = (text, keywords) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return keywords.some(kw => lower.includes(kw.toLowerCase()));
};

/**
 * Score a single product against a specific pet profile
 */
const scoreProductForPet = (product, pet) => {
    let score = 20; // Base baseline score
    const reasons = [];

    const prodText = `${product.name} ${product.description || ''} ${(product.features || []).join(' ')} ${product.brand || ''}`.toLowerCase();

    // 1. Species compatibility
    const speciesMap = {
        dog: ['dog', 'all'],
        cat: ['cat', 'all'],
        bird: ['bird', 'all'],
        fish: ['fish', 'all'],
        'small-pet': ['small-pet', 'all'],
        reptile: ['reptile', 'all']
    };

    const allowedPetTypes = speciesMap[pet.species] || ['all'];
    if (allowedPetTypes.includes(product.petType)) {
        score += 15;
    } else {
        // Penalty for mismatched species (e.g. cat food for a dog)
        score -= 40;
    }

    // 2. Age Stage Matching
    const petAge = Number(pet.age) || 1;
    if (petAge < 1.5) {
        // Puppy / Kitten / Young
        const puppyKeywords = ['puppy', 'kitten', 'growth', 'dha', 'starter', 'teething', 'junior', 'baby', 'young'];
        if (hasKeyword(prodText, puppyKeywords)) {
            score += 30;
            reasons.push(`Tailored for ${pet.name}'s growth stage (${petAge < 1 ? 'under 1 year' : `${petAge} yrs`})`);
        }
    } else if (petAge >= 7) {
        // Senior Pet
        const seniorKeywords = ['senior', 'joint', 'glucosamine', 'chondroitin', 'orthopedic', 'mobility', 'mature', 'soothing', 'memory foam'];
        if (hasKeyword(prodText, seniorKeywords)) {
            score += 30;
            reasons.push(`Vet-recommended senior vitality & joint support for ${pet.name} (Age ${petAge})`);
        }
    } else {
        // Adult Pet
        const adultKeywords = ['adult', 'active', 'energy', 'maintenance', 'enrichment', 'chew', 'nutrition'];
        if (hasKeyword(prodText, adultKeywords)) {
            score += 15;
            reasons.push(`Optimal daily nutrition & enrichment for adult ${pet.species}s`);
        }
    }

    // 3. Medical Conditions & Health Concerns Matching
    const conditions = (pet.medicalConditions || []).map(c => c.toLowerCase());
    
    // Joint / Arthritis
    if (conditions.some(c => c.includes('joint') || c.includes('arthrit') || c.includes('mobility') || c.includes('hip'))) {
        const jointKeywords = ['joint', 'glucosamine', 'chondroitin', 'mobility', 'orthopedic', 'memory foam', 'turmeric', 'msm', 'cartilage'];
        if (hasKeyword(prodText, jointKeywords)) {
            score += 35;
            reasons.push(`Targeted joint relief & cartilage support for ${pet.name}'s mobility`);
        }
    }

    // Sensitive Digestion / Allergies / Stomach
    if (conditions.some(c => c.includes('stomach') || c.includes('sensitiv') || c.includes('digest') || c.includes('allerg'))) {
        const sensitiveKeywords = ['grain-free', 'sensitive', 'salmon', 'sweet potato', 'probiotics', 'digestive', 'hypoallergenic', 'single protein', 'prebiotic'];
        if (hasKeyword(prodText, sensitiveKeywords)) {
            score += 35;
            reasons.push(`Gentle hypoallergenic & grain-free formula for sensitive digestion`);
        }
    }

    // Skin & Coat / Itching / Dryness
    if (conditions.some(c => c.includes('skin') || c.includes('coat') || c.includes('itch') || c.includes('dry') || c.includes('dander'))) {
        const coatKeywords = ['shampoo', 'oatmeal', 'aloe', 'omega', 'coat', 'skin', 'soothing', 'hypoallergenic', 'lavender', 'shiny'];
        if (hasKeyword(prodText, coatKeywords)) {
            score += 35;
            reasons.push(`Deeply soothing skin & coat revitalizing formula`);
        }
    }

    // Dental / Teeth / Bad Breath
    if (conditions.some(c => c.includes('dental') || c.includes('teeth') || c.includes('breath') || c.includes('plaque') || c.includes('tartar'))) {
        const dentalKeywords = ['dental', 'teeth', 'tartar', 'plaque', 'mint', 'spirulina', 'chew', 'breath', 'vohc'];
        if (hasKeyword(prodText, dentalKeywords)) {
            score += 35;
            reasons.push(`Active dental tartar defense & fresh breath support for ${pet.name}`);
        }
    }

    // Anxiety / Stress / Fear
    if (conditions.some(c => c.includes('anxiety') || c.includes('stress') || c.includes('calm') || c.includes('fear'))) {
        const anxietyKeywords = ['calming', 'soothing', 'donut', 'bed', 'anxiety', 'comfort', 'plush', 'relaxation'];
        if (hasKeyword(prodText, anxietyKeywords)) {
            score += 30;
            reasons.push(`Calming and stress-reducing design for emotional wellness`);
        }
    }

    // Weight Management
    if (conditions.some(c => c.includes('weight') || c.includes('obesity') || c.includes('diet'))) {
        const weightKeywords = ['weight', 'lean', 'low-calorie', 'active', 'fetch', 'rubber ball', 'exercise', 'toy'];
        if (hasKeyword(prodText, weightKeywords)) {
            score += 25;
            reasons.push(`Supports healthy weight management & active play`);
        }
    }

    // 4. Dietary Preferences
    const dietPrefs = (pet.dietaryPreferences || []).map(d => d.toLowerCase());
    if (dietPrefs.some(d => d.includes('grain-free')) && hasKeyword(prodText, ['grain-free', 'grain free'])) {
        score += 20;
        reasons.push(`Matches ${pet.name}'s Grain-Free dietary preference`);
    }

    // 5. Weight & Size Matching
    const petWeight = Number(pet.weight) || 5;
    if (petWeight >= 20) {
        // Large breed
        if (hasKeyword(prodText, ['large breed', 'indestructible', 'heavy duty', 'xl', 'durable rubber'])) {
            score += 15;
            reasons.push(`Built durable for large ${pet.species}s (${petWeight}kg)`);
        }
    } else if (petWeight < 10) {
        // Small breed
        if (hasKeyword(prodText, ['small breed', 'mini', 'small', 'soft chew', 'compact'])) {
            score += 15;
            reasons.push(`Ergonomically sized for small ${pet.species}s (${petWeight}kg)`);
        }
    }

    // 6. Rating & Quality Boost
    if (product.rating) {
        score += Math.round(product.rating * 4); // up to +20 pts
    }

    // Final fallback reason if none explicitly added
    if (reasons.length === 0) {
        reasons.push(`Top-rated vet-approved essential for ${pet.species}s`);
    }

    return {
        score,
        matchedPet: {
            _id: pet._id,
            name: pet.name,
            species: pet.species,
            age: pet.age,
            breed: pet.breed,
            imageUrl: pet.imageUrl
        },
        reasons,
        primaryReason: reasons[0]
    };
};

/**
 * Get smart product recommendations for a specific pet or all user's pets
 */
exports.getRecommendationsForPets = async (pets, options = {}) => {
    const limit = options.limit || 8;

    // Fetch active products with supplier and category populated
    const products = await Product.find({ status: 'active', stock: { $gt: 0 } })
        .populate('category', 'name slug')
        .populate('supplier', 'name')
        .lean();

    if (!products || products.length === 0) {
        return [];
    }

    // If no pets available (e.g. new user or guest), return top-rated active products
    if (!pets || pets.length === 0) {
        const genericRecommendations = products
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit)
            .map(product => ({
                product,
                relevanceScore: Math.round((product.rating || 4.5) * 18),
                primaryReason: '⭐ Top-Rated Vet-Approved Customer Favorite',
                reasons: ['Customer Favorite', '100% Vet-Approved Quality'],
                matchedPet: null
            }));
        return genericRecommendations;
    }

    // Map each product to its best pet match score across all owner's pets
    const scoredProducts = [];

    for (const product of products) {
        let bestMatch = null;
        let highestScore = -Infinity;

        for (const pet of pets) {
            const result = scoreProductForPet(product, pet);
            if (result.score > highestScore) {
                highestScore = result.score;
                bestMatch = result;
            }
        }

        if (bestMatch && highestScore > 0) {
            scoredProducts.push({
                product,
                relevanceScore: Math.min(100, Math.max(10, highestScore)),
                primaryReason: bestMatch.primaryReason,
                reasons: bestMatch.reasons,
                matchedPet: bestMatch.matchedPet
            });
        }
    }

    // Sort by relevance score descending
    scoredProducts.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scoredProducts.slice(0, limit);
};

/**
 * Get recommendations tailored to a single specific pet ID
 */
exports.getRecommendationsForSinglePet = async (pet, limit = 8) => {
    const products = await Product.find({ status: 'active', stock: { $gt: 0 } })
        .populate('category', 'name slug')
        .populate('supplier', 'name')
        .lean();

    const scored = products.map(product => {
        const match = scoreProductForPet(product, pet);
        return {
            product,
            relevanceScore: Math.min(100, Math.max(10, match.score)),
            primaryReason: match.primaryReason,
            reasons: match.reasons,
            matchedPet: match.matchedPet
        };
    });

    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return scored.slice(0, limit);
};
