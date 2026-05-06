// ./js/script.js

import {
   auth, 
  showMessage, 
  getElementOrError 
} from "./security.js";
import {
  validateAnimal,
  findAnimalByName,
  findAnimalsByStatus,
  loadAnimalsFromJSON,
} from "./animals.js";
import { 
  zoo, 
  showZooStats, 
  auditLogger
} from "./zoo.js";
import {
  runVisitorFieldChecks,
  runMemberFieldChecks,
  runXSSFieldChecks,
  validateFields,
  animalDataSchema
} from "./validation.js";
// import {
//    createRequest,
//    apiCryptoURL, 
//    failCryptoURL,  
//   } from "./apis/cryptoApi.js";
import {
  createAnimalRequest, 
  animalApiURL
} from "./apis/animalApi.js"

import { initializeForms } from "./forms.js";

import { fetchZooStatus } from "./apis/zooStatusApi.js";
import { fetchVisitors } from "./apis/visitorApi.js";
import { location, testOfflineStatus } from "./apis/geolocationApi.js" 
import { displayStorageAnimals, testBadStorageData } from "./apis/storageApi.js"


document.addEventListener("DOMContentLoaded", () => {
  "use strict";

const animals = loadAnimalsFromJSON();

animals.forEach((animal) => {
  zoo.addAnimal(animal, validateAnimal);
});
  // Show the starting animal data
  //console.log("Initial animals array:");
  //console.table(zoo.animals.map((animal) => animal.getCardData()));

  // Add an animal and refresh the screen safely
  function addAnimal(animal) {
    try {
      zoo.addAnimal(animal, validateAnimal);
      showMessage(`${animal.name} was added successfully.`);
      //console.log("Updated animals array after add:");
      //console.table(zoo.animals.map((item) => item.getCardData()));
      animalCard();
      updateZooStatusIndicator();
    } catch (error) {
      showMessage(error.message, true);
    }
  }

  // Use a broken animal on purpose to test error handling
  try {
    const badAnimal = new elephant.constructor(
      5,
      "",
      "giraffe",
      2,
      "female",
      "open",
      "healthy",
      "Tall Habitat"
    );

    validateAnimal(badAnimal, zoo.animals);
  } catch (error) {
  //  console.error("Intentional validation test:", error.message);
  }

  // Copy the first animal to demonstrate array slicing
  const bigAnimals = zoo.animals.slice(0, 1);
 // console.log("The big animals array:");
  //console.table(bigAnimals.map((animal) => animal.getCardData()));

  // Filter open animals to demonstrate array filtering
  const openAnimals = zoo.animals.filter((animal) => animal.status === "open");
 // console.log("Open status animals:");
//  console.table(openAnimals.map((animal) => animal.getCardData()));

  // Update a single animal to test data changes
  zoo.animals[1].count = 3;
  zoo.animals[1].status = "closed";

  // Show the updated tiger data
 // console.log("New tiger count/status:");
 // console.table([zoo.animals[1].getCardData()]);

  // Build the animal card section with safe DOM methods
  function animalCard() {
    try {
      const section = getElementOrError("animalCard");

      section.innerHTML = "";

      zoo.animals.forEach((animal) => {
        const animalCardElement = document.createElement("div");
        animalCardElement.classList.add("card");

        const name = document.createElement("span");
        name.classList.add("name");
        name.textContent = `Name: ${animal.name}, `;

        const species = document.createElement("span");
        species.classList.add("species");
        species.textContent = `Species: ${animal.species}, `;

        const count = document.createElement("span");
        count.classList.add("count");
        count.textContent = `Count: ${animal.count}, `;

        const gender = document.createElement("span");
        gender.classList.add("gender");
        gender.textContent = `Gender: ${animal.gender}, `;

        const status = document.createElement("span");
        status.classList.add("status");
        status.textContent = `Status: ${animal.status}, `;

        const health = document.createElement("span");
        health.classList.add("health");
        health.textContent = `Health: ${animal.health}, `;

        const enclosure = document.createElement("span");
        enclosure.classList.add("enclosure");
        enclosure.textContent = `Enclosure: ${animal.enclosure}`;

        animalCardElement.appendChild(name);
        animalCardElement.appendChild(species);
        animalCardElement.appendChild(count);
        animalCardElement.appendChild(gender);
        animalCardElement.appendChild(status);
        animalCardElement.appendChild(health);
        animalCardElement.appendChild(enclosure);

        section.appendChild(animalCardElement);
      });
    } catch (error) {
      showMessage(error.message, true);
    }
  }

  // Start the visitor count at zero
  let count = 0;

  // Keep a reference to the count display element
  let zooElement = null;

  // Build the visitor count display
  try {
    const section = getElementOrError("zooCount");
    zooElement = document.createElement("h1");
    zooElement.classList.add("visitorCount");
    zooElement.textContent = `Zoo Count ${count}`;
    section.appendChild(zooElement);
  } catch (error) {
    showMessage(error.message, true);
  }

  // Increase the visitor count and update the page
  function addZooCount() {
    try {
      if (!zooElement) {
        throw new Error("Visitor count display element is not available.");
      }

      count += 1;
      zooElement.textContent = `Zoo Count ${count}`;
     // console.log(`Visitor count updated to ${count}`);
    } catch (error) {
      showMessage(error.message, true);
    }
  }

  // Safely add a click event to a button if it exists
  function addSafeClickListener(id, handler) {
    try {
      const button = getElementOrError(id);
      button.addEventListener("click", handler);
    } catch (error) {
      showMessage(error.message, true);
    }
  }

  // Update the overall zoo status based on animal statuses
  function updateZooStatusIndicator() {
    try {
      const statusElement = getElementOrError("zooStatusIndicator");

      const hasOpenAnimals = zoo.animals.some((animal) => animal.status === "open");

      statusElement.textContent = hasOpenAnimals
        ? "Zoo Status: Open"
        : "Zoo Status: Closed";
    } catch (error) {
      showMessage(error.message, true);
    }
  }

  // Set every animal to open using array iteration
  const openStatus = () => {
    try {
      zoo.updateAllStatuses("open");
      animalCard();
      updateZooStatusIndicator();
     // console.log("All animals set to open.");
     // console.table(zoo.animals.map((animal) => animal.getCardData()));
      showMessage("All animal statuses updated to open.");
    } catch (error) {
      showMessage(error.message, true);
    }
  };

  // Set every animal to closed using array iteration
  const closedStatus = () => {
    try {
      zoo.updateAllStatuses("closed");
      animalCard();
      updateZooStatusIndicator();
     // console.log("All animals set to closed.");
     // console.table(zoo.animals.map((animal) => animal.getCardData()));
      showMessage("All animal statuses updated to closed.");
    } catch (error) {
      showMessage(error.message, true);
    }
  };

  // Heal every animal using the secure zoo method
  const healAnimals = () => {
    try {
      zoo.updateAllHealth("healthy");
      animalCard();
    //  console.log("All animals healed.");
     // console.table(zoo.animals.map((animal) => animal.getCardData()));
     // showMessage("All animals have been healed.");
    } catch (error) {
      showMessage(error.message, true);
    }
  };

  // Run the stats function
  showZooStats(zoo.animals);

  async function updateDashboard() {
  try {
    const statusEl = document.getElementById("dashboardStatus");
    const visitorEl = document.getElementById("dashboardVisitors");

    const statusData = await fetchZooStatus(zoo);
    const visitors = await fetchVisitors();

    if (statusEl) {
      statusEl.textContent = `Zoo is ${statusData.status} (${statusData.totalAnimals} animals)`;
    }

    if (visitorEl) {
      visitorEl.textContent = `Visitors stored: ${visitors.length}`;
    }

  } catch (error) {
    showMessage(error.message, true);
  }
  }

  updateDashboard();

  // Show search instructions in the console
//  console.log('To search for an animal by name, use findAnimalByName(list, name)');
 // console.log('To search for animals by status, use findAnimalsByStatus(list, status)'
  //);

  // Render the animal cards when the page starts
  animalCard();

  // Set the first zoo status display
  updateZooStatusIndicator();

  // Add all basic zoo control buttons
  addSafeClickListener("openStatus", openStatus);
  addSafeClickListener("closedStatus", closedStatus);
  addSafeClickListener("updateHealth", healAnimals);
  addSafeClickListener("visitorButton", addZooCount);

  // Add a protected admin-only action if the button exists
  const adminOnlyButton = document.getElementById("adminOnlyAction");

  if (adminOnlyButton) {
    adminOnlyButton.addEventListener("click", () => {
      try {
        auth.requireRole("admin");
        zoo.updateAllHealth("healthy");
        zoo.updateAllStatuses("open");
        animalCard();
        updateZooStatusIndicator();
        showMessage("Admin action complete. All animals reset safely.");
      } catch (error) {
        showMessage(error.message, true);
      }
    });
  }

  // Demonstrate array destructuring with the first three animals
  const [firstAnimal, secondAnimal, thirdAnimal] = zoo.animals;

 // console.log("Array destructuring example:");
 // console.log(firstAnimal.describe());
 // console.log(secondAnimal.describe());
 // console.log(thirdAnimal.describe());

  // Use array iteration to display each animal description
  zoo.animals.forEach((animal, index) => {
//    console.log(`Animal ${index + 1}: ${animal.describe()}`);
  });

  // Create filtered views using array methods
  const healthyAnimals = zoo.getHealthyAnimals();
  const pandaAnimals = zoo.getBySpecies("Panda");

 // console.log("Healthy animals:");
 // console.table(healthyAnimals.map((animal) => animal.getCardData()));

//console.log("Filtered by species = Panda:");
 // console.table(pandaAnimals.map((animal) => animal.getCardData()));

  // Use object destructuring to process animal data
  const { id, name, species, enclosure } = firstAnimal;

 // console.log("Object destructuring example:");
 // console.log({ id, name, species, enclosure });

  // Show all audit logs at the end
 // console.log("Audit logs:");
//  console.table(auditLogger.getLogs());

  // Expose search helpers to the browser console for testing
  window.findAnimalByName = findAnimalByName;
  window.findAnimalsByStatus = findAnimalsByStatus;

  // Initialize forms with dependencies
  initializeForms(addZooCount, auditLogger);

  const whitelist = [
    "api.coinlayer.com",
    "api.api-ninjas.com"
  ];

  // Successful AJAX request
  //createRequest(apiCryptoURL);

  // Invalid protocol attempt
  //createRequest(failCryptoURL);

  createAnimalRequest(animalApiURL);

  // ================== Sprint C1 Lab 1: JSON Data Processing and Validation ======

  
//Part 2: Basic JSON Operations
  // function to convert object to json string
  function convertObjectToJson(obj) {
  try {
    const jsonString = JSON.stringify(obj, null, 4);
   // console.log("Converted JavaScript object to JSON string:");
    //console.log(jsonString);
    return jsonString;
  } catch (error) {
    console.error("Error converting object to JSON:", error.message);
    return null;
  }
}

// Parses the json string to a js object.
function parseJsonToObject(jsonString) {
  try {
    const parsedObject = JSON.parse(jsonString);
   // console.log("Parsed JSON string back to JavaScript object:");
   // console.log(parsedObject);
    return parsedObject;
  } catch (error) {
  //  console.error("Error parsing JSON string:", error.message);
    return null;
  }
}

async function loadJsonData() {
  try {
  const response = await fetch("./animals.json")

    if (!response.ok) {
      throw new Error(`Failed to load data.json. Status: ${response.status}`);
    }

    const data = await response.json();

    const jsonString = convertObjectToJson(data);
    
    const parsedObject = parseJsonToObject(jsonString);

    const isValid = validateAnimalData(parsedObject, animalDataSchema);
   // console.log(parsedObject);
  } catch (error) {
    console.error("Fetch or JSON formatting error:", error.message);
  }
}

loadJsonData();
function validateAnimalData(animalData, animalDataSchema) {
  var productResult = tv4.validateMultiple(animalData, animalDataSchema);
  if (productResult.valid === true) {
 //   console.log("Valid product data");
  } else {
  //  console.log(productResult);
  }}

// Part 4: Error Handling and Debugging

  const missingFieldData = {
    animals: [
      {
        id: 1,
        species: "Lion",
        age: 8
      }
    ]
  };

  const wrongTypeData = {
    animals: [
      {
        id: "one",
        species: "Tiger",
        name: "Tasha",
        age: "five"
      }
    ]
  };

  const emptyObjectData = {};

  const nullData = null;

  // //console.log("Missing required field test:");
  // validateAnimalData(missingFieldData, animalDataSchema);

  // //console.log("Incorrect data type test:");
  // validateAnimalData(wrongTypeData, animalDataSchema);

  // //console.log("Empty object test:");
  // validateAnimalData(emptyObjectData, animalDataSchema);

  // console.log("Null value test:");
  // validateAnimalData(nullData, animalDataSchema);

  // console.log("Invalid JSON format test:");
  // parseJsonToObject("{ invalid json }");

// ============= Sprint C1 Lab 2: Web APIs Implementation ===================

  location();

  displayStorageAnimals();

  // Test will be successful.
  const testSuccessfulApi = async () => {
  try {
    const response = await fetch("./animals.json");

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    console.log("Successful API test:", data);
  } catch (error) {
    console.error("Successful API test failed:", error);
  }
};

// Test will fail.
const testFailedApi = async () => {
  try {
    const response = await fetch("bad-data.json");

    if (!response.ok) {
      throw new Error("Failed API call test passed: bad file not found");
    }
  } catch (error) {
    console.error("Expected failed API call:", error.message);
  }
};

const runStorageApiTests = () => {
  console.log("Running storage and API tests");

  testSuccessfulApi();
  testFailedApi();
  console.log("Bad storage data:")
  testBadStorageData();
  testOfflineStatus();
};

runStorageApiTests();

// Shows how much storage has been used.
const getStorageUsage = () => {
let total = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    // Each character in JS is 2 bytes (UTF-16)
    total += ((localStorage[key].length + key.length) * 2);
  }
}
console.log("Total localStorage used: " + (total / 1024).toFixed(2) + " KB");
}

getStorageUsage();

});