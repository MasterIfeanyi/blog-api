import slugify from 'slugify';
import { Product } from '../models/product.model.js';

// Helper function to generate unique slugs
async function generateUniqueSlug(name) {
    // Create the base slug once
    const baseSlug = slugify(name, { lower: true, strict: true });

    let slug = baseSlug;
    let count = 1;

    // Check if the slug already exists
    let existingSlug = await Product.findOne({ slug });

    // Keep modifying the slug until it becomes unique
    while (existingSlug) {
        slug = `${baseSlug}-${count}`;
        // book-1
        // book-2
        // book-3
        existingSlug = await Product.findOne({ slug });
        count++;
    }

    return slug;
}

export default generateUniqueSlug;
