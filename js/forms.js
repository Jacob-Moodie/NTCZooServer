// ./js/forms.js

import {
  showMessage,
  sanitizeText,
  escapeHTML,
  setCSRFToken,
  validateCSRFToken,
  logFormEntries,
  logSanitizedFormEntries
} from "./security.js";

import { zoo, auditLogger } from "./zoo.js";

import {
  runVisitorFieldChecks,
  runMemberFieldChecks,
  runXSSFieldChecks
} from "./validation.js";

// Export initializer so script.js controls this module
export function initializeForms(addZooCount, auditLogger) {

  const visitorForm = document.getElementById("visitForm");
  const memberForm = document.getElementById("memberForm");

  if (visitorForm) {
    setCSRFToken("visitForm", "visitorCSRFToken", "visitForm_csrf_hash");

    visitorForm.addEventListener("submit", async (e) => {
      try {
        e.preventDefault();

        if (!visitorForm.checkValidity()) {
          visitorForm.reportValidity();
          return;
        }

        await validateCSRFToken("visitorCSRFToken", "visitForm_csrf_hash");

        const data = new FormData(visitorForm);
        const safeData = {};

        for (const [key, value] of data.entries()) {
          if (key === "visitorCSRFToken") continue;
          safeData[key] = sanitizeText(value);
        }

        // Update zoo count (passed in from script.js)
        addZooCount();

        auditLogger.addLog(
          "VISITOR_FORM_SUBMIT",
          `Visitor submitted form for ${safeData.selectAnimal || "unknown"}`
        );

        visitorForm.reset();
        showMessage("Visitor submitted successfully!");

      } catch (error) {
        showMessage(error.message, true);
      }
    });
  }

  if (memberForm) {
    setCSRFToken("memberForm", "memberCSRFToken", "memberForm_csrf_hash");

    memberForm.addEventListener("submit", async (e) => {
      try {
        e.preventDefault();

        if (!memberForm.checkValidity()) {
          memberForm.reportValidity();
          return;
        }

        await validateCSRFToken("memberCSRFToken", "memberForm_csrf_hash");

        const data = new FormData(visitorForm);
        const safeData = {};

        for (const [key, value] of data.entries()) {
          if (key === "visitorCSRFToken") continue;
          safeData[key] = sanitizeText(value);
        }

        // Update zoo count (passed in from script.js)
        addZooCount();

        auditLogger.addLog(
          "VISITOR_FORM_SUBMIT",
          `Visitor submitted form for ${safeData.selectAnimal || "unknown"}`
        );

        memberForm.reset();
        showMessage("Message submitted successfully!");

      } catch (error) {
        showMessage(error.message, true);
      }
    });
  }
}