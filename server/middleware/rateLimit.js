import rateLimit from "express-rate-limit";

// Limits repeated requests to help stop spam.
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // max requests
  message: {
    message: "Too many requests. Try again later."
  }
});

export default limiter;