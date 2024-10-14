const prisma = require('@prisma/client');
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

const getTriggerTimes = async () => {
  const timeSet = await prismaClient.timeSet.findUnique({
    where: {
      id_timeSet: 1
    }
  });

  if (timeSet) {
    return {
      triggerDS: timeSet.triggerDS,
      triggerNS: timeSet.triggerNS
    };
  } else {
    return {
      triggerDS: 21600, // Default to 06:00:00 (6 AM)
      triggerNS: 68400  // Default to 19:00:00 (7 PM)
    };
  }
};

async function saveTimeSet() {
  const now = new Date();
  const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const { triggerDS, triggerNS } = await getTriggerTimes();

  let state = 'DS'; // Default to DS (Day Shift)
  if (secondsSinceMidnight >= triggerNS || secondsSinceMidnight < triggerDS) {
    state = 'NS'; // Night Shift
  }

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const generatedId = `${day}-${month}-${year}-${state}`;

  // Upsert the record with id 1
  const timeSetRecord = await prismaClient.timeSet.upsert({
    where: { id_timeSet: 1 }, // Always use id 1
    update: {
      datenow: now,
      state: state,
      triggerDS: triggerDS,
      triggerNS: triggerNS,
      generatedId: generatedId
    },
    create: {
      id_timeSet: 1, // Set id to 1 when creating
      datenow: now,
      state: state,
      triggerDS: triggerDS,
      triggerNS: triggerNS,
      generatedId: generatedId
    }
  });
  return timeSetRecord;
};

module.exports = saveTimeSet;