import slugify from 'slugify';

// Helper function to generate unique slugs
async function generateUniqueSlug(name, Model) {
    // Create the base slug once
    const baseSlug = slugify(name, { lower: true, strict: true });

    let slug = baseSlug;
    let count = 1;

    // Check if the slug already exists
    let existingSlug = await Model.findOne({ slug });

    // Keep modifying the slug until it becomes unique
    while (existingSlug) {
        slug = `${baseSlug}-${count}`;
        // book-1
        // book-2
        // book-3
        existingSlug = await Model.findOne({ slug });
        count++;
    }

    return slug;
}

export default generateUniqueSlug;
