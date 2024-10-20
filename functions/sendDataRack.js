const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch data filtered by name.
 * If no filter is provided, it returns all racks.
 * @param {String|null} filterName - The name to filter rack by.
 * @returns {Promise<Array>} - A promise that resolves to an array of racks with total item count.
 */
async function sendDataRack(filterName = null) {
    try {
        // Build where conditions dynamically
        const whereConditions = {};

        if (filterName) {
            whereConditions.name = {
                contains: filterName,
                mode: 'insensitive', // Case-insensitive search
            };
        }

        // Fetch racks from the Rack model
        const rackData = await prisma.rack.findMany({
            where: whereConditions, // Apply filter if provided
            include: {
                Item: true, // Include associated items
            },
        });

        // Calculate the total number of items in each rack
        const rackDataWithTotal = rackData.map(rack => {
            const totalItems = rack.Item.length; // Count the number of items in the rack
            return {
                ...rack,
                totalItems, // Add the total count of items
            };
        });

        return rackDataWithTotal;
    } catch (error) {
        console.error("Error fetching racks:", error);
        return [];
    }
}

module.exports = sendDataRack;