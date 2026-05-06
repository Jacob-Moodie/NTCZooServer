// ./js/security.js

// Safely get a required element or stop with an error
export const getElementOrError = function(id) {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Missing required DOM element with id="${id}"`);
  }

  return element;
};

// Sanitize text input to reduce XSS risk
export const sanitizeText = function(value) {
  return String(value)
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// Escape special characters before displaying user input
export const escapeHTML = function(value) {
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// Show messages on the page and in the console
export const showMessage = function(message, isError = false) {
  const messageArea = document.getElementById("errorMessage");

  if (messageArea) {
    messageArea.textContent = message;
    messageArea.style.color = isError ? "red" : "green";
  }

  if (isError) {
    console.error(message);
  } else {
//    console.log(message);
  }
};

// Create a secure CSRF token using the browser crypto API
const generateCSRFToken = function() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

// Hash a string so the raw token does not have to be stored directly
export const hashString = async function(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

// Store a new CSRF token for a form and place it into its hidden field
export const setCSRFToken = async function(formId, fieldId, storageKey) {
  const field = document.getElementById(fieldId);

  if (!field) {
    return;
  }

  const token = generateCSRFToken();
  const hashedToken = await hashString(token);

  sessionStorage.setItem(storageKey || `${formId}_csrf_hash`, hashedToken);
  field.value = token;
};

// Validate a submitted CSRF token against the stored hash
export const validateCSRFToken = async function(fieldId, storageKey) {
  const field = document.getElementById(fieldId);
  const storedHash = sessionStorage.getItem(storageKey);

  if (!field || !field.value) {
    throw new Error("Missing CSRF token.");
  }

  const submittedHash = await hashString(field.value);

  if (submittedHash !== storedHash) {
    throw new Error("Invalid CSRF token.");
  }

  return true;
};

// Track the last submit time to block repeated spam submissions
export const checkRateLimit = function() {
  const now = Date.now();
  const lastSubmit = Number(sessionStorage.getItem("lastSubmitTime")) || 0;
  const cooldown = 10000;

  if (now - lastSubmit < cooldown) {
    throw new Error("Please wait before submitting again.");
  }

  sessionStorage.setItem("lastSubmitTime", now);
  return now;
};

// Display sanitized values to the page without using unsafe HTML insertion
export const displaySafeData = function(dataObject) {
  const output = document.getElementById("xssOutput");

  if (!output) {
    return;
  }

  output.innerHTML = "";

  Object.entries(dataObject).forEach(([key, value]) => {
    const p = document.createElement("p");
    p.textContent = `${key}: ${value.sanitized}`;
    output.appendChild(p);
  });
};

// Log security tests in a table so results are easy to show
export const logTestResult = function(testCase, inputData, expectedResult, actualResult) {
  console.table([
    {
      testCase,
      inputData,
      expectedResult,
      actualResult,
      passFail: expectedResult === actualResult ? "PASS" : "FAIL"
    }
  ]);
};

// Cut input down to the maximum allowed length
const truncate = function(value, max) {
  return String(value).slice(0, max);
};

// Sanitize SQL form values before logging or display
const sanitize = function(value) {
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/;/g, "")
    .replace(/'/g, "&#039;")
    .replace(/--/g, "&#45;&#45;");
};

// Detect simple SQL injection patterns for testing
export const detectSQL = function(value) {
  return /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR\s+1=1)\b|(--|;|'|")/i.test(
    value
  );
};

// Log submitted form data to the console
export const logFormEntries = function(data) {
  for (const pair of data.entries()) {
    console.log(`"${pair[0]}", "${pair[1]}"`);
  }
};

// Log both original and sanitized values for testing
export const logSanitizedFormEntries = function(data) {
  for (const [key, value] of data.entries()) {
    const safeValue = escapeHTML(value);
    console.log(`${key}:`, value);
    console.log(`Sanitized ${key}:`, safeValue);
  }
};

// Simulate a JWT-based login and secure session system
export const auth = (() => {
  let currentUser = null;

  const createFakeJWT = function(payload) {
    return btoa(JSON.stringify(payload));
  };

  const decodeFakeJWT = function(token) {
    try {
      return JSON.parse(atob(token));
    } catch {
      return null;
    }
  };

  return {
    login(username, password) {
      const safeUsername = sanitizeText(username);

      if (safeUsername === "admin" && password === "zoo123") {
        const token = createFakeJWT({
          user: "admin",
          role: "admin",
          exp: Date.now() + 30 * 60 * 1000,
        });

        sessionStorage.setItem("zoo_token", token);
        currentUser = decodeFakeJWT(token);
        auditLogger.addLog("LOGIN", "Admin logged in");
        return currentUser;
      }

      if (safeUsername === "staff" && password === "zoo123") {
        const token = createFakeJWT({
          user: "staff",
          role: "staff",
          exp: Date.now() + 30 * 60 * 1000,
        });

        sessionStorage.setItem("zoo_token", token);
        currentUser = decodeFakeJWT(token);
        auditLogger.addLog("LOGIN", "Staff logged in");
        return currentUser;
      }

      throw new Error("Invalid login.");
    },

    logout() {
      sessionStorage.removeItem("zoo_token");
      currentUser = null;
      auditLogger.addLog("LOGOUT", "User logged out");
    },

    getSession() {
      if (currentUser) {
        return currentUser;
      }

      const token = sessionStorage.getItem("zoo_token");

      if (!token) {
        return null;
      }

      const decoded = decodeFakeJWT(token);

      if (!decoded || decoded.exp < Date.now()) {
        sessionStorage.removeItem("zoo_token");
        return null;
      }

      currentUser = decoded;
      return currentUser;
    },

    requireRole(role) {
      const session = this.getSession();

      if (!session) {
        throw new Error("You must be logged in.");
      }

      if (session.role !== role) {
        throw new Error("Access denied.");
      }

      return true;
    }
  };
})();