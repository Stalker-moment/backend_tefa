const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch data filtered by name, category, and rack.
 * @param {String|null} filterName - The name to filter items by.
 * @param {String|null} filterCategory - The category to filter items by.
 * @param {String|null} filterRack - The rack to filter items by.
 * @returns {Promise<Array>} - A promise that resolves to an array of items with calculated differences.
 */
async function sendDataItems(filterName = null, filterCategory = null, filterRack = null) {
  try {
    // Build where conditions dynamically
    const whereConditions = {
      AND: []
    };

    if (filterName) {
      whereConditions.AND.push({
        name: {
          contains: filterName,
          mode: 'insensitive', // case-insensitive search
        },
      });
    }

    if (filterCategory) {
      whereConditions.AND.push({
        category: {
          name: {
            contains: filterCategory,
            mode: 'insensitive',
          },
        },
      });
    }

    if (filterRack) {
      whereConditions.AND.push({
        rack: {
          name: {
            contains: filterRack,
            mode: 'insensitive',
          },
        },
      });
    }

    // Fetch data from the Item model based on filters
    const itemsData = await prisma.item.findMany({
      where: whereConditions,
      include: {
        category: true,
        rack: true,
        pictures: true, // Include pictures in the query
      },
    });

    // Adding base URL to picture paths
    const baseUrl = 'https://apitefa.akti.cloud/files/img/items';

    const itemsWithPictures = itemsData.map(item => {
      const picturesWithUrl = item.pictures.map(picture => {
        return {
          ...picture,
          fullPath: `${baseUrl}${picture.path}` // Add the full path for each picture
        };
      });

      return {
        ...item,
        pictures: picturesWithUrl // Replace pictures with the new array that includes fullPath
      };
    });

    // Assuming you want to calculate differences or other logic on the items here
    const calculateDifferences = (data) => {
      return data.map(item => {
        // Placeholder for any difference calculation logic
        // For now, we just return the item as is
        return item;
      });
    };

    const itemsWithDifferences = calculateDifferences(itemsWithPictures);

    return itemsWithDifferences;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}

module.exports = sendDataItems;
// Usage: sendDataItems("ItemName", "CategoryName", "RackName").then(console.log).catch(console.error);