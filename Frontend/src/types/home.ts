export interface CategoryItem {
    _id?: string;
    name?: string;
    slug?: string;
    image?: string;
    imageUrl?: string;
    productCount?: number;
}

export interface HomeProduct {
    _id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    comparePrice?: number;
    brand?: string;
    category?: {
        _id?: string;
        name?: string;
        slug?: string;
    };
    supplier?: {
        _id?: string;
        name?: string;
    };
    imageUrl?: string;
    images?: string[];
    rating?: number;
    numReviews?: number;
    averageRating?: number;
    isFeatured?: boolean;
    isAvailable?: boolean;
}
