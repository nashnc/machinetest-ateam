const Joi = require("joi");
const freeEmailData = require("../data/freeEmailDomains.json");

// Get free email domains from JSON file
const freeEmailDomains = freeEmailData.domains;

const isWorkEmail = (email) => {
  const domain = email.split("@")[1];
  return !freeEmailDomains.includes(domain.toLowerCase());
};

const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .custom((value, helpers) => {
      if (!isWorkEmail(value)) {
        return helpers.message("Only work emails are allowed");
      }
      return value;
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 number, and 1 special character",
    }),
});

const userValidation = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  email: Joi.string()
    .email()
    .required()
    .custom((value, helpers) => {
      if (!isWorkEmail(value)) {
        return helpers.message("Only work emails are allowed");
      }
      return value;
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 number, and 1 special character",
    }),
  userType: Joi.string().valid("Admin", "Manager").required(),
  profilePicture: Joi.string().optional(),
});

const userUpdateValidation = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.string()
    .email()
    .custom((value, helpers) => {
      if (!isWorkEmail(value)) {
        return helpers.message("Only work emails are allowed");
      }
      return value;
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 number, and 1 special character",
    }),
  userType: Joi.string().valid("Admin", "Manager"),
  profilePicture: Joi.string(),
}).options({ allowUnknown: true });

const vegetableValidation = Joi.object({
  name: Joi.string().required().trim(),
  color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .required()
    .messages({
      "string.pattern.base": "Color must be a valid hexadecimal color code",
    }),
  price: Joi.number().positive().required(),
});

module.exports = {
  loginValidation,
  userValidation,
  userUpdateValidation,
  vegetableValidation,
  isWorkEmail,
};
