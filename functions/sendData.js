const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch data filtered by a specific date and calculate the differences
 * between planning and actual values.
 * @param {Date|null} filterDate - The date to filter logs by. If null, fetch logs for today.
 * @returns {Promise<Array>} - A promise that resolves to an array of logs with calculated differences.
 */
async function sendData(filterDate = null) {
  try {
    let startOfDay, endOfDay;

    if (filterDate) {
      startOfDay = new Date(filterDate);
      startOfDay.setHours(0, 0, 0, 0);

      endOfDay = new Date(filterDate);
      endOfDay.setHours(23, 59, 59, 999);
    } else {
      const today = new Date();
      startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);

      endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
    }

    // Fetch data from Assy, Casting, and Machining models
    const assyData = await prisma.assy.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const castingData = await prisma.casting.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const machiningData = await prisma.machining.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Function to calculate differences between planning and actual values
    const calculateDifferences = (data, planningKeys, actualKeys) => {
      return data.map(entry => {
        const differences = {};
        planningKeys.forEach((planningKey, index) => {
          const actualKey = actualKeys[index];
          const valueDiff = entry[actualKey] - entry[planningKey];
    
          // Tambahkan simbol + atau - berdasarkan nilai difference
          const diffString = valueDiff > 0 ? `+${valueDiff}` : `${valueDiff}`;
          
          differences[`${planningKey}_diff`] = diffString;
        });
        return { ...entry, ...differences };
      });
    };    

    // Define the keys for planning and actual values for each model
    const assyPlanningKeys = [
      "NR_elbow_planning", "NR_ball_planning", "NR_hev_planning",
      "NR_2_elbow_planning", "NR_2_ball_planning", "NR_2_hev_planning"
    ];
    const assyActualKeys = [
      "NR_elbow_actual", "NR_ball_actual", "NR_hev_actual",
      "NR_2_elbow_actual", "NR_2_ball_actual", "NR_2_hev_actual"
    ];

    const castingPlanningKeys = [
      "LP_planning", "DC_conv_planning", "DC_hev_planning", "CB_conv_planning",
      "CB_hev_planning", "CH_conv_planning", "CH_hev_planning", "CA_IN_conv_planning",
      "CA_IN_hev_planning", "CA_EX_conv_planning", "CA_EX_hev_planning", "CR_1NR_planning",
      "CR_2NR_planning", "elbow_1NR_planning", "ball_1NR_planning", "hev_1NR_planning",
      "elbow_2NR_planning", "ball_2NR_planning", "hev_2NR_planning"
    ];
    const castingActualKeys = [
      "LP_actual", "DC_conv_actual", "DC_hev_actual", "CB_conv_actual",
      "CB_hev_actual", "CH_conv_actual", "CH_hev_actual", "CA_IN_conv_actual",
      "CA_IN_hev_actual", "CA_EX_conv_actual", "CA_EX_hev_actual", "CR_1NR_actual",
      "CR_2NR_actual", "elbow_1NR_actual", "ball_1NR_actual", "hev_1NR_actual",
      "elbow_2NR_actual", "ball_2NR_actual", "hev_2NR_actual"
    ];

    const machiningPlanningKeys = [
      "CB_conv_planning", "CB_hev_planning", "CH_conv_planning",
      "CH_hev_planning", "CA_IN_conv_planning", "CA_IN_hev_planning"
    ];
    const machiningActualKeys = [
      "CB_conv_actual", "CB_hev_actual", "CH_conv_actual",
      "CH_hev_actual", "CA_IN_conv_actual", "CA_IN_hev_actual"
    ];

    // Calculate differences for each dataset
    const assyWithDifferences = calculateDifferences(assyData, assyPlanningKeys, assyActualKeys);
    const castingWithDifferences = calculateDifferences(castingData, castingPlanningKeys, castingActualKeys);
    const machiningWithDifferences = calculateDifferences(machiningData, machiningPlanningKeys, machiningActualKeys);

    // Combine the results
    const allDataWithDifferences = {
      assy: assyWithDifferences,
      casting: castingWithDifferences,
      machining: machiningWithDifferences
    };

    return allDataWithDifferences;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}

module.exports = sendData;
//sendData(new Date("2024-10-01")).then(console.log).catch(console.error);