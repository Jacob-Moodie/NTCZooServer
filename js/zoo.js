// ./js/zoo.js

import { sanitizeText, showMessage } from "./security.js";

function createAuditLogger() {
  const logs = [];

  return {
    addLog(action, details) {
      logs.push({
        time: new Date().toISOString(),
        action,
        details,
      });
    },

    getLogs() {
      return [...logs];
    },
  };
}

export const auditLogger = createAuditLogger();

export const zoo = {
  animals: [],

  addAnimal(animal, validateAnimal) {
    validateAnimal(animal, this.animals);
    this.animals.push(animal);
    auditLogger.addLog("ADD_ANIMAL", `Added animal ID ${animal.id}`);
  },

  removeAnimal(id) {
    this.animals = this.animals.filter((animal) => animal.id !== Number(id));
    auditLogger.addLog("REMOVE_ANIMAL", `Removed animal ID ${id}`);
  },

  getHealthyAnimals() {
    return this.animals.filter(
      (animal) => animal.health.toLowerCase() === "healthy"
    );
  },

  getBySpecies(species) {
    const safeSpecies = sanitizeText(species).toLowerCase();
    return this.animals.filter(
      (animal) => animal.species.toLowerCase() === safeSpecies
    );
  },

  updateAllStatuses(status) {
    this.animals.forEach((animal) => {
      animal.status = status;
    });

    auditLogger.addLog("UPDATE_STATUS", `Updated all animals to ${status}`);
  },

  updateAllHealth(health) {
    this.animals.forEach((animal) => {
      animal.health = health;
    });

    auditLogger.addLog("UPDATE_HEALTH", `Updated all animals to ${health}`);
  },
};

export function showZooStats(list) {
  try {
    if (!Array.isArray(list)) {
      throw new Error("showZooStats requires an array.");
    }

    const openCount = list.filter((animal) => animal.status === "open").length;
    const closedCount = list.filter((animal) => animal.status === "closed").length;
    const totalAnimals = list.reduce((sum, animal) => sum + animal.count, 0);

 //   console.log("Total count of animals:", totalAnimals);
//    console.log("Open species:", openCount);
  //  console.log("Closed species:", closedCount);
  } catch (error) {
    showMessage(error.message, true);
  }
}