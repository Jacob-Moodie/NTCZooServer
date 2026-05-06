import express from "express";
import animalData from "../animals.json" with { type: "json" };

// Middleware imports
import limiter from "./middleware/rateLimit.js";
import { checkCSRF } from "./middleware/csrf.js";
import { sanitizeText } from "./middleware/sanitize.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Lets Express read JSON bodies.
app.use(express.json());

// Enables rate limiting on all routes.
app.use(limiter);

// Animal array from JSON file.
const animals = animalData.animals;

// Temporary visitor storage.
const visitors = [];

// Home route.
app.get("/", (req, res) => {
  res.json({
    message: "NTC Zoo Server is running."
  });
});

// Returns all animals.
app.get("/animals", (req, res) => {
  console.log("Animals requested.");

  res.json(animals);
});

// Returns only animal health info.
app.get("/health", (req, res) => {

  const healthList = animals.map((animal) => {
    return {
      name: animal.name,
      healthStatus: animal.healthStatus
    };
  });

  res.json(healthList);
});

// Updates animal health status.
app.put("/animals/:id/health", checkCSRF, (req, res) => {

  // Gets animal ID from URL.
  const animalId = Number(req.params.id);

  // Sanitizes user input.
  const newHealthStatus = sanitizeText(req.body.healthStatus);

  // Valid health options.
  const allowedStatuses = [
    "healthy",
    "sick",
    "recovering"
  ];

  // Makes sure health value is valid.
  if (!allowedStatuses.includes(newHealthStatus.toLowerCase())) {
    return res.status(400).json({
      message: "Invalid health status."
    });
  }

  // Finds matching animal.
  const foundAnimal = animals.find((animal) => {
    return animal.id === animalId;
  });

  // Animal not found.
  if (!foundAnimal) {
    return res.status(404).json({
      message: "Animal not found."
    });
  }

  // Updates animal health.
  foundAnimal.healthStatus = newHealthStatus.toLowerCase();

  console.log(
    `${foundAnimal.name} updated to ${newHealthStatus}`
  );

  res.json({
    message: "Animal health updated.",
    animal: foundAnimal
  });
});

// Adds visitor.
app.post("/visitors", checkCSRF, (req, res) => {

  // Builds visitor object.
  const visitor = {
    id: visitors.length + 1,
    name: sanitizeText(req.body.name),
    animalVisited: sanitizeText(req.body.animalVisited),
    visitTime: new Date().toISOString()
  };

  // Stores visitor.
  visitors.push(visitor);

  console.log("Visitor added:", visitor);

  res.status(201).json({
    message: "Visitor added successfully.",
    visitor
  });
});

// Returns visitor list.
app.get("/visitors", (req, res) => {
  res.json(visitors);
});

// Handles missing routes.
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found."
  });
});

// Starts server.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});