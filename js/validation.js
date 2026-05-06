// ./js/validation.js

// Store custom browser validation messages for visitor fields
export const visitorValidityChecks = {
  visitorName: "You must enter your name.",
  selectAnimal: "You must select an animal.",
  visitDate: "You must select a visit date.",
  groupSize: "You must select a group size.",
};

// Apply the correct custom validation message to a field
export const checkVisitorFieldValid = function(field) {
  field.setCustomValidity("");

  if (!field.checkValidity()) {
    field.setCustomValidity(
      visitorValidityChecks[field.id] || "This field is invalid."
    );
  }
}

// Run browser checks on the visitor fields
export const runVisitorFieldChecks = function() {
  ["visitorName", "selectAnimal", "visitDate", "groupSize"].forEach((id) => {
    const field = document.getElementById(id);

    if (field) {
      checkVisitorFieldValid(field);
    }
  });
}

// Store custom validation messages for the member form
export const memberValidityChecks = {
  memberName: "You must enter your name.",
  email: "You must enter a valid email.",
  memberStartDate: "You must select a start date.",
};

// Apply member validation messages to invalid fields
export const checkMemberFieldValid = function(field) {
  field.setCustomValidity("");

  if (!field.checkValidity()) {
    field.setCustomValidity(
      memberValidityChecks[field.id] || "This field is invalid."
    );
  }
}

// Run checks on every important member field
export const runMemberFieldChecks = function() {
  ["memberName", "email", "memberStartDate"].forEach((id) => {
    const field = document.getElementById(id);

    if (field) {
      checkMemberFieldValid(field);
    }
  });
}

// Store custom validity messages for the XSS test form
export const xSSValidityChecks = {
  XSScontactName: "You must enter your name.",
  XSSvisitorEmail: "You must enter a valid email.",
};

// Apply XSS form validity messages
export const checkXSSFieldValid = function(field) {
  field.setCustomValidity("");

  if (!field.checkValidity()) {
    field.setCustomValidity(
      xSSValidityChecks[field.id] || "This field is invalid."
    );
  }
}

// Run checks across the XSS form fields
export const runXSSFieldChecks = function() {
  ["XSScontactName", "XSSvisitorEmail"].forEach((id) => {
    const field = document.getElementById(id);

    if (field) {
      checkXSSFieldValid(field);
    }
  });
}

// Store custom messages for SQL form validation
export const messages = {
  SQLcontactName: "You must enter your name.",
  SQLvisitorEmail: "You must enter a valid email.",
  SQLvisitorMessage: "You must enter a message.",
};

// Apply custom validation messages to SQL form fields
export const validateFields = function() {
  ["SQLcontactName", "SQLvisitorEmail", "SQLvisitorMessage"].forEach((id) => {
    const field = document.getElementById(id);

    if (!field) {
      return;
    }

    field.setCustomValidity("");

    if (!field.checkValidity()) {
      field.setCustomValidity(messages[id]);
    }
  });
}

// Part 3: JSON validation.
// Validation schema for json data. Ensures that it follows the same format as this.
export const animalDataSchema = {
  type: "object",
  properties: {
    animals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          species: { type: "string" },
          count: { type: "number" },
          gender: { type: "string" },
          status: { type: "string", enum: ["open", "closed"] },
          healthStatus: {
            type: "string",
            enum: ["healthy", "sick", "recovering"]
          },
          enclosure: { type: "string" },
          location: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" }
            },
            required: ["lat", "lng"]
          },
          feedingSchedule: {
            type: "array",
            items: { type: "string" }
          },
          maintenanceRecords: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string" },
                note: { type: "string" }
              },
              required: ["date", "note"]
            }
          }
        },
        required: [
          "id",
          "name",
          "species",
          "count",
          "gender",
          "status",
          "healthStatus",
          "enclosure",
          "location",
          "feedingSchedule",
          "maintenanceRecords"
        ]
      }
    }
  },
  required: ["animals"]
};
