// ./js/animals.js

import { sanitizeText, showMessage } from "./security.js";
import { animalDataSchema } from "./validation.js";

import data from "../animals.json" with { type: "json"};

export class Animal {
  #healthStatus;

  constructor(
    id,
    name,
    species,
    count = 0,
    gender = "unknown",
    status = "open",
    health = "healthy",
    enclosure = ""
  ) {
    this.id = Number(id);
    this.name = sanitizeText(name);
    this.species = sanitizeText(species);
    this.count = Number(count);
    this.gender = sanitizeText(gender);
    this.status = sanitizeText(status).toLowerCase();
    this.enclosure = sanitizeText(enclosure);
    this.health = health;
  }

  get health() {
    return this.#healthStatus;
  }

  get statusText() {
    return this.#healthStatus;
  }

  set health(value) {
    const safeValue = sanitizeText(value);
    const allowed = ["healthy", "sick", "recovering"];

    if (!allowed.includes(safeValue.toLowerCase())) {
      throw new Error('Animal health must be "healthy", "sick", or "recovering".');
    }

    this.#healthStatus =
      safeValue.charAt(0).toUpperCase() + safeValue.slice(1).toLowerCase();
  }

  set status(value) {
    const safeValue = sanitizeText(value).toLowerCase();
    const allowed = ["open", "closed"];

    if (!allowed.includes(safeValue)) {
      throw new Error('Animal status must be either "open" or "closed".');
    }

    this._status = safeValue;
  }

  get status() {
    return this._status;
  }

  describe() {
    return `${this.name} is a ${this.species} and is currently ${this.health}.`;
  }

  getCardData() {
    return {
      id: this.id,
      name: this.name,
      species: this.species,
      count: this.count,
      gender: this.gender,
      status: this.status,
      health: this.health,
      enclosure: this.enclosure,
    };
  }
}

export function loadAnimalsFromJSON() {
  return data.animals.map((a) => {
    return new Animal(
      a.id,
      a.name,
      a.species,
      a.count,
      a.gender,
      a.status,
      a.healthStatus,
      a.enclosure
    );
  });
}

export function validateAnimal(animal, existingAnimals) {
  if (!(animal instanceof Animal)) {
    throw new Error("Only Animal objects can be added.");
  }

  if (Number.isNaN(animal.id)) {
    throw new Error("Animal id is required and must be a number.");
  }

  if (!animal.name || typeof animal.name !== "string") {
    throw new Error("Animal name is required and must be a string.");
  }

  if (!animal.species || typeof animal.species !== "string") {
    throw new Error("Animal species is required and must be a string.");
  }

  if (typeof animal.count !== "number" || animal.count < 0) {
    throw new Error("Animal count is required and must be a non-negative number.");
  }

  if (!animal.gender || typeof animal.gender !== "string") {
    throw new Error("Animal gender is required and must be a string.");
  }

  const duplicateId = existingAnimals.some(
    (existingAnimal) => existingAnimal.id === animal.id
  );

  if (duplicateId) {
    throw new Error(`Animal id "${animal.id}" already exists.`);
  }

  return true;
}

export function findAnimalByName(list, name) {
  try {
    if (!Array.isArray(list)) {
      throw new Error("First argument must be an array.");
    }

    if (!name || typeof name !== "string") {
      throw new Error("Name must be a valid string.");
    }

    const lower = name.toLowerCase();

    const found = list.find((animal) => animal.name.toLowerCase() === lower);

 //
    if (found) {
  //    console.table([found.getCardData()]);
    } else {
      console.warn(`No animal found with name "${name}"`);
    }

    return found;
  } catch (error) {
    showMessage(error.message, true);
    return null;
  }
}

export function findAnimalsByStatus(list, status) {
  try {
    if (!Array.isArray(list)) {
      throw new Error("First argument must be an array.");
    }

    if (!status || typeof status !== "string") {
      throw new Error("Status must be a valid string.");
    }

    const lower = status.toLowerCase();

    const filtered = list.filter(
      (animal) => animal.status.toLowerCase() === lower
    );

 //   console.log(`Filtered animals with status="${status}":`);
 //   console.table(filtered.map((animal) => animal.getCardData()));

    return filtered;
  } catch (error) {
    showMessage(error.message, true);
    return [];
  }
}
