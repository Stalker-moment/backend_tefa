const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function sendAccount(searchKey) {
  try {
    // Initialize the search criteria
    const searchCriteria = {};

    // Only add criteria if the searchKey is provided
    if (searchKey) {
      searchCriteria.OR = [
        { email: { contains: searchKey, mode: 'insensitive' } },
        { contact: { phone: { contains: searchKey, mode: 'insensitive' } } },
        { contact: { noReg: { contains: searchKey, mode: 'insensitive' } } },
        { contact: { firstName: { contains: searchKey, mode: 'insensitive' } } },
        { contact: { lastName: { contains: searchKey, mode: 'insensitive' } } },
      ];
    }

    // Fetch accounts with optional search criteria and include contact information
    let accounts = await prisma.account.findMany({
      where: searchCriteria,
      include: {
        contact: true,
      },
    });

    // Remove the password field from the result
    accounts.forEach((account) => {
      delete account.password;
    });

    return accounts; // Return the filtered accounts
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
}

module.exports = sendAccount;