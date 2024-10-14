const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch data filtered by a specific date and calculate the differences
 * between planning and actual values.
 * @param {Date|null} filterDate - The date to filter logs by. If null, fetch logs for today.
 * @returns {Promise<Array>} - A promise that resolves to an array of logs with calculated differences.
 */
async function sendDataControl(filterDate = null) {
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
    const assyData = await prisma.controlAssy.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const castingData = await prisma.controlCasting.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const machiningData = await prisma.controlMachining.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Function to calculate differences between planning and actual values
    const calculateDifferences = (data, planningKeys, actualKeys) => {
      return data.map((entry) => {
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
    const assyPlanningKeys = ["planning"];
    const assyActualKeys = ["actual"];

    const castingPlanningKeys = ["cast_dc_planning", "cast_lp_planning"];
    const castingActualKeys = ["cast_dc_actual", "cast_lp_actual"];

    const machiningPlanningKeys = [
      "cylblock_planning",
      "cylhead_planning",
      "crankshaft_1nr_planning",
      "crankshaft_2nr_planning",
      "camshaft_conv_planning",
      "camshaft_hv_planning",
    ];
    const machiningActualKeys = [
      "cylblock_actual",
      "cylhead_actual",
      "crankshaft_1nr_actual",
      "crankshaft_2nr_actual",
      "camshaft_conv_actual",
      "camshaft_hv_actual",
    ];

    // Calculate differences for each dataset
    const assyWithDifferences = calculateDifferences(
      assyData,
      assyPlanningKeys,
      assyActualKeys
    );
    const castingWithDifferences = calculateDifferences(
      castingData,
      castingPlanningKeys,
      castingActualKeys
    );
    const machiningWithDifferences = calculateDifferences(
      machiningData,
      machiningPlanningKeys,
      machiningActualKeys
    );

    // Combine the results
    const allDataWithDifferences = {
      assy: assyWithDifferences,
      casting: castingWithDifferences,
      machining: machiningWithDifferences,
    };

    return allDataWithDifferences;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}

module.exports = sendDataControl;
//sendDataControl(new Date("2024-10-01")).then(console.log).catch(console.error);
