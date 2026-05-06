// ./js/api/storageApi.js
// selectors for animal form.

// =============Part 3: Storage APIs=================

const addStorageAnimalForm = document.querySelector("#addStorageAnimalForm");
const addStorageAnimalName = document.querySelector("#animalName");
const addStorageAnimalSpecies = document.querySelector("#animalSpecies");
const addStorageAnimalAge = document.querySelector("#animalAge");
const addStorageAnimalList = document.querySelector("#animalList");
const removeStorageAnimal = document.querySelector("#removeStorageAnimalForm");
const removeStorageAnimalName = document.querySelector("#removeAnimalName");

const storageKey = "zooAnimals"; 

// Key names for session storage.
const sessionKey = "zooSessionData";
const rateLimitKey = "zooRequestCount";
const maxRequests = 5;

// Saves the session data.
const saveSessionData = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      console.error("Session storage is full.");
    } else {
      console.error("Error saving session data:", error);
    }
  }
};

// Gets the session data.
const getSessionData = (key) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading session data:", error);
    return null;
  }
};

saveSessionData(sessionKey, {
  page: "storage",
  lastAction: "Added animal"
});

const currentSession = getSessionData(sessionKey);
console.log(currentSession);

// Checks the sessions rate limit and makes sure you arent over it.
const checkSessionRateLimit = () => {
  const currentCount = Number(sessionStorage.getItem(rateLimitKey)) || 0;

  if (currentCount >= maxRequests) {
    console.error("Rate limit reached. Try again later.");
    return false;
  }

  sessionStorage.setItem(rateLimitKey, String(currentCount + 1));
  return true;
};

// removes a specific session data.
const removeSessionData = (key) => {
  sessionStorage.removeItem(key);
};


  // Gets the animals from the local storage.
  const getStorageAnimals = () => {
  try {
    const storedAnimals = localStorage.getItem(storageKey);

    if (!storedAnimals) {
      return [];
    }

    return JSON.parse(storedAnimals);
  } catch (error) {
    console.error("error loading animals:", error);
    return [];
  }};

  // Saves the animals to the local storage.
  const saveStorageAnimals = (animals) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(animals));
    } catch (error) {
      console.error("error saving animals:", error);
    }
  };
  
  // Displays the storage animals.
  export const displayStorageAnimals = (animals) => {
    const storedAnimals = getStorageAnimals();

    addStorageAnimalList.innerHTML = "";

    storedAnimals.forEach((animal) => {
      const li = document.createElement("li");
      li.textContent = `Name: ${animal.name} Species: ${animal.species} Age: ${animal.age}`;
      addStorageAnimalList.appendChild(li);
    });
  };

  // Adds a storage animal to the storage list.
  const addStorageAnimal = (animal) => {
    const storedAnimals = getStorageAnimals();

    storedAnimals.push(animal);
    saveStorageAnimals(storedAnimals);
  };

  // Deletes a storage animal from the storage list.
const deleteStorageAnimalByName = (name) => {
  const storedAnimals = getStorageAnimals();
  const removeName = name.trim().toLowerCase();

  const updatedAnimals = storedAnimals.filter((animal) => {
    if (!animal.name) {
      return true;
    }

    return animal.name.trim().toLowerCase() !== removeName;
  });

  saveStorageAnimals(updatedAnimals);
  displayStorageAnimals();
};

// Updates a storage animal on the storage list.
const updateStorageAnimalByName = (name, updatedAnimal) => {
  const storedAnimals = getStorageAnimals();

  const updatedAnimals = storedAnimals.map((animal) =>
    animal.name.toLowerCase() === name.toLowerCase()
      ? { ...animal, ...updatedAnimal }
      : animal
  );

  saveStorageAnimals(updatedAnimals);
  displayStorageAnimals();
};

  // Event listener to add animal to the storage list.
  addStorageAnimalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!checkSessionRateLimit()) {
    return;
    }

    const newStorageAnimal = {
      name: addStorageAnimalName.value,
      species: addStorageAnimalSpecies.value,
      age: Number(addStorageAnimalAge.value)
    };

    addStorageAnimal(newStorageAnimal);

    displayStorageAnimals();

    addStorageAnimalForm.reset();

  });

  // Removes an animal from the storage list.
  removeStorageAnimal.addEventListener("submit", (event) => {
  event.preventDefault();

    if (!checkSessionRateLimit()) {
    return;
    }
  deleteStorageAnimalByName(removeStorageAnimalName.value);

  removeStorageAnimal.reset();
  });

  // Tests to prove bad storage data doesnt work.
  export const testBadStorageData = () => {
  localStorage.setItem("zooAnimals", "{ bad json ");

  const animals = getStorageAnimals();

  console.log("Bad storage test result:", animals);
};

