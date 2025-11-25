const sanitizeHtml = require("sanitize-html");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    });
  } else if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  } else if (typeof input === "object" && input !== null) {
    const sanitizedObj = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitizedObj[key] = sanitizeInput(input[key]);
      }
    }
    return sanitizedObj;
  }
  return input;
};

module.exports = {
  sanitizeInput,
  csrfProtection,
};
