const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch data filtered by name.
 * If no filter is provided, it returns all category.
 * @param {String|null} filterName - The name to filter category by.
 * @returns {Promise<Array>} - A promise that resolves to an array of category with total item count.
 */
async function sendDataCategory(filterName = null) {
    try {
        // Build where conditions dynamically
        const whereConditions = {};

        if (filterName) {
            whereConditions.name = {
                contains: filterName,
                mode: 'insensitive', // Case-insensitive search
            };
        }

        // Fetch category from the category model
        const categoryData = await prisma.category.findMany({
            where: whereConditions, // Apply filter if provided
            include: {
                Item: true, // Include associated items
            },
        });

        // Calculate the total number of items in each category
        const categoryDataWithTotal = categoryData.map(category => {
            const totalItems = category.Item.length; // Count the number of items in the category
            return {
                ...category,
                totalItems, // Add the total count of items
            };
        });

        return categoryDataWithTotal;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

module.exports = sendDataCategory;