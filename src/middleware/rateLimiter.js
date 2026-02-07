import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // I watch you for 2 minutes
    max: 100, // you can make 100 requests in the 2 minute window

    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    },

    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers (how many requests left, when the limit resets)
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers - This disables old, outdated headers.
    message: {
        status: 429,
        error: 'Too many requests, please try again later.',
    }, // When someone breaks the rules, this is the response they get.
});


// Rate limiter for sign-in
export const signInLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 5, // Limit each IP to 5 requests per windowMs

    keyGenerator: (req) => {
        const email = req.body.email?.toLowerCase();
        return email ? `login_${email}_${req.ip}` : req.ip;
    },

    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        error: 'Too many sign-in attempts, please try again later.',
    }
});

// Rate limiter for sign-up
export const signUpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 10 requests per windowMs

    keyGenerator: (req) => {
        const email = req.body.email?.toLowerCase();
        return email ? `signup_${email}_${req.ip}` : req.ip;
    },

    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        error: 'Too many sign-up attempts, please try again later.',
    }
});


export const userLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,

  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user_${req.user.id}_${req.ip}`;
    }
    return req.ip;
  },

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    status: 429,
    error: "Too many requests. Please slow down."
  }
});