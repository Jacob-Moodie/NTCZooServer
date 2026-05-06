// ./js/forms.js

// Return membership options for the select list
function membershipList() {
  return ["Individual", "Family", "Senior"];
}

// Return animal names for the select list
function animalsList() {
  return zoo.animals.map((animal) => animal.species.charAt(0).toUpperCase() + animal.species.slice(1));
}

// Fill select lists after the page fully loads
window.addEventListener("load", () => {
  try {
    const membershipSelect = document.getElementById("membershipTypeList");
    const animalList = document.getElementById("animalList");

    if (membershipSelect) {
      const memberships = membershipList();

      for (const name of memberships) {
        const option = document.createElement("option");
        option.setAttribute("value", name);
        option.textContent = name;
        membershipSelect.appendChild(option);
      }
    }

    if (animalList) {
      const listedAnimals = animalsList();

      for (const name of listedAnimals) {
        const option = document.createElement("option");
        option.setAttribute("value", name);
        option.textContent = name;
        animalList.appendChild(option);
      }
    }
  } catch (error) {
    showMessage(error.message, true);
  }
});

// Use a separate member form if it exists on the page
const memberForm = document.getElementById("memberForm");

// Build member form data safely
function buildMemberFormData() {
  if (!memberForm) {
    throw new Error("Member form is missing.");
  }

  const data = new FormData(memberForm);
  logFormEntries(data);
}

// Get the XSS test form from the page
const xSSForm = document.getElementById("XSSvisitorForm");

// Build test results showing original and sanitized values
function buildXSSFormData() {
  if (!xSSForm) {
    throw new Error("XSS form is missing.");
  }

  const data = new FormData(xSSForm);
  const testResults = [];

  for (const [key, value] of data.entries()) {
    const originalValue = String(value);
    const sanitizedValue = escapeHTML(originalValue);

    let testType = "Normal text";

    if (/<script/i.test(originalValue)) {
      testType = "Text with script tags";
    } else if (/<[^>]+>/.test(originalValue)) {
      testType = "Text with HTML tags";
    } else if (/[&<>"']/.test(originalValue)) {
      testType = "Special characters";
    }

    console.log(`Before ${key}:`, originalValue);
    console.log(`After ${key}:`, sanitizedValue);

    testResults.push({
      fieldName: key,
      testType,
      originalInput: originalValue,
      sanitizedOutput: sanitizedValue,
      changed: originalValue !== sanitizedValue ? "Yes" : "No",
    });
  }

  console.log("XSS Form Test Results:");
  console.table(testResults);
}

// Get the visitor form from the page
const visitorForm = document.getElementById("visitForm");

// Build visitor form data safely
function buildVisitorFormData() {
  if (!visitorForm) {
    throw new Error("Visitor form is missing.");
  }

  const data = new FormData(visitorForm);
  logFormEntries(data);
}

// Handle visitor form submission with validation, XSS prevention, and CSRF
if (visitorForm) {
  setCSRFToken("visitForm", "visitorCSRFToken", "visitForm_csrf_hash");

  visitorForm.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      if (!visitorForm.checkValidity()) {
        runVisitorFieldChecks();
        visitorForm.reportValidity();
        return;
      }

      await validateCSRFToken("visitorCSRFToken", "visitForm_csrf_hash");

      const selectedAnimalField = document.getElementById("selectAnimal");

      if (!selectedAnimalField) {
        throw new Error('Missing "selectAnimal" field.');
      }

      const selectedAnimal = selectedAnimalField.value.trim().toLowerCase();
      const validAnimals = zoo.animals.map((a) => a.species.toLowerCase());

      if (!validAnimals.includes(selectedAnimal)) {
        selectedAnimalField.setCustomValidity(
          "Please select an animal from the list."
        );
        visitorForm.reportValidity();
        return;
      } else {
        selectedAnimalField.setCustomValidity("");
      }

      const data = new FormData(visitorForm);
      logFormEntries(data);
      logSanitizedFormEntries(data);

      const safeVisitorSubmission = {};

      for (const [key, value] of data.entries()) {
        if (key === "visitorCSRFToken") {
          continue;
        }

        safeVisitorSubmission[key] = sanitizeText(value);
      }

      secureStore("lastVisitorSubmission", safeVisitorSubmission);

      addZooCount();
      visitorForm.reset();
      await setCSRFToken("visitForm", "visitorCSRFToken", "visitForm_csrf_hash");
      showMessage("Visitor form submitted successfully.");
      auditLogger.addLog(
        "VISITOR_FORM_SUBMIT",
        `Visitor submitted form for ${safeVisitorSubmission.selectAnimal || "unknown animal"}`
      );
    } catch (error) {
      showMessage(error.message, true);
    }
  });
} else {
  console.warn('Visitor form with id="visitForm" was not found.');
}

// Handle the member form safely if it exists
if (memberForm) {
  setCSRFToken("memberForm", "memberCSRFToken", "memberForm_csrf_hash");

  memberForm.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      if (!memberForm.checkValidity()) {
        runMemberFieldChecks();
        memberForm.reportValidity();
        return;
      }

      await validateCSRFToken("memberCSRFToken", "memberForm_csrf_hash");

      buildMemberFormData();

      const data = new FormData(memberForm);
      const safeMemberSubmission = {};

      for (const [key, value] of data.entries()) {
        if (key === "memberCSRFToken") {
          continue;
        }

        safeMemberSubmission[key] = sanitizeText(value);
      }

      secureStore("lastMemberSubmission", safeMemberSubmission);

      addZooCount();
      memberForm.reset();
      await setCSRFToken("memberForm", "memberCSRFToken", "memberForm_csrf_hash");
      showMessage("Member form submitted successfully.");
    } catch (error) {
      showMessage(error.message, true);
    }
  });
} else {
  console.warn('Member form with id="memberForm" was not found.');
}

// Handle the XSS test form
if (xSSForm) {
  xSSForm.addEventListener("submit", (e) => {
    try {
      e.preventDefault();

      if (!xSSForm.checkValidity()) {
        runXSSFieldChecks();
        xSSForm.reportValidity();
        showMessage("Please fix the highlighted fields.", true);
        return;
      }

      buildXSSFormData();
      xSSForm.reset();
      showMessage("XSS form submitted successfully.");
    } catch (error) {
      showMessage(error.message, true);
    }
  });
} else {
  console.warn('XSS form with id="XSSvisitorForm" was not found.');
}

// Get the protected CSRF/XSRF test form and hidden token field
const contactForm = document.getElementById("XSRFvisitorForm");
const csrfField = document.getElementById("csrfToken");

// Protect the CSRF/XSRF form with token validation and rate limiting
if (contactForm) {
  setCSRFToken("XSRFvisitorForm", "csrfToken", "csrfTokenHash");

  contactForm.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        throw new Error("Invalid form input.");
      }

      await validateCSRFToken("csrfToken", "csrfTokenHash");

      const submitTime = checkRateLimit();
      const formData = new FormData(contactForm);
      const submission = {};

      for (const [key, value] of formData.entries()) {
        if (key === "csrfToken") {
          continue;
        }

        const original = String(value);
        const sanitized = escapeHTML(original);

        submission[key] = {
          original,
          sanitized,
          changed: original !== sanitized,
        };
      }

      console.log("Submission Data:");
      console.table(submission);

      displaySafeData(submission);

      logTestResult(
        "Normal submission",
        `Submitted at ${new Date(submitTime).toLocaleTimeString()}`,
        "Allowed",
        "Allowed"
      );

      contactForm.reset();
      await setCSRFToken("XSRFvisitorForm", "csrfToken", "csrfTokenHash");
    } catch (error) {
      alert(error.message);

      logTestResult(
        "Blocked submission",
        error.message,
        "Allowed or blocked",
        "Blocked"
      );
    }
  });
}

// Get the SQL security test form from the page
const SQLvisitorForm = document.getElementById("SQLvisitorForm");

// Set max lengths for each field to help prevent oversized inputs
const limits = {
  SQLcontactName: 35,
  SQLvisitorEmail: 50,
  SQLvisitorMessage: 250,
};

// Handle oversized text and SQL injection testing
if (SQLvisitorForm) {
  SQLvisitorForm.addEventListener("submit", (e) => {
    try {
      e.preventDefault();

      if (!SQLvisitorForm.checkValidity()) {
        validateFields();
        SQLvisitorForm.reportValidity();
        showMessage("Please fix the highlighted fields.", true);
        return;
      }

      const data = new FormData(SQLvisitorForm);
      const results = [];

      for (const [key, value] of data.entries()) {
        const original = String(value);
        const max = limits[key];
        const truncated = truncate(original, max);
        const sanitized = sanitize(truncated);
        const sqlDetected = detectSQL(original);

        if (sqlDetected) {
          console.warn(`SQL pattern detected in ${key}:`, original);
        }

        let type = "Normal text";

        if (original.length > max) {
          type = "Oversized data string";
        } else if (sqlDetected) {
          type = "SQL command detected";
        } else if (/[&<>"']/.test(original)) {
          type = "Special characters";
        }

        const restrictedArray = new Array(max).fill("");

        for (let i = 0; i < truncated.length; i++) {
          restrictedArray[i] = truncated[i];
        }

        results.push({
          field: key,
          testType: type,
          original,
          truncated,
          sanitized,
          exceededLimit: original.length > max ? "Yes" : "No",
          sqlDetected: sqlDetected ? "Yes" : "No",
        });
      }

      console.log("Security Test Results:");
      console.table(results);

      showMessage("SQL visitor form submitted successfully.");
      SQLvisitorForm.reset();
    } catch (err) {
      showMessage(err.message, true);
    }
  });
} else {
  console.warn('Form "SQLvisitorForm" not found.');
}

// Get the admin login form if it exists
const loginForm = document.getElementById("adminLoginForm");

// Handle login using the fake JWT system
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    try {
      e.preventDefault();

      const data = new FormData(loginForm);
      const username = data.get("adminUsername");
      const password = data.get("adminPassword");

      const session = auth.login(username, password);

      console.log("Logged in session:");
      console.table([session]);

      showMessage(`Logged in as ${session.role}.`);
      loginForm.reset();
    } catch (error) {
      showMessage(error.message, true);
    }
  });
}