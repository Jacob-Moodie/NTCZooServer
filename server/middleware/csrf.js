// Simple CSRF protection middleware.

// Token required for protected routes.
const CSRF_TOKEN = "ntc-zoo-secure-token";

// Checks if request contains correct token.
export function checkCSRF(req, res, next) {
  const token = req.headers["x-csrf-token"];

  // If token is wrong or missing block request.
  if (token !== CSRF_TOKEN) {
    return res.status(403).json({
      message: "Invalid or missing CSRF token."
    });
  }

  console.log("CSRF token validated.");

  // Allows request to continue.
  next();
}