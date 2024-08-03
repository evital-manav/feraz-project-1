import joi from "joi";
import moment from "moment";

// const moment = require('moment');

// Define a custom date format validation schema using Joi's custom method
const person_schema = joi.object({
  first_name: joi
    .string()
    .trim()
    .min(3)
    .max(255)
    .pattern(/^[A-Za-z]+$/)
    .required(),
  last_name: joi
    .string()
    .trim()
    .min(3)
    .max(255)
    .pattern(/^[A-Za-z]+$/)
    .required(),
  dob: joi.date().iso().required(),
});

const customDateFormat = joi
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .custom((value, helpers) => {
    const date = moment(value, "YYYY-MM-DD", true);
    if (!date.isValid()) {
      return helpers.error("any.invalid");
    }

    const now = moment();
    const maxDate = moment().add(4, "months");

    if (date.isBefore(now, "day")) {
      return helpers.error("date.min", { limit: now.format("YYYY-MM-DD") });
    }

    if (date.isAfter(maxDate, "day")) {
      return helpers.error("date.max", { limit: maxDate.format("YYYY-MM-DD") });
    }

    return value;
  })
  .messages({
    "string.pattern.base": `"date" must be in the format YYYY-MM-DD`,
    "date.min": `"date" cannot be in the past. Minimum allowed date is today`,
    "date.max": `"date" cannot be more than four months in the future.`,
    "any.invalid": `"date" must be a valid date in the format YYYY-MM-DD`,
  });

export const signupSchema = joi.object({
  firstName: joi
    .string()
    .trim()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(255)
    .required(),
  lastName: joi
    .string()
    .trim()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(255)
    .required(),
  mobile: joi
    .string()
    .trim()
    .pattern(/^[1-9]\d*$/)
    .length(10)
    .required(),
  email: joi.string().trim().email().required(),
  password: joi.string().trim().min(8).required(),
});

export const login_schema = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().min(8).max(255).required(),
});

export const reserve_ticket_schema = joi.object({
  from: joi.string().min(2).max(255).required(),
  to: joi.string().min(2).max(255).required(),
  startdate: customDateFormat.required(),
  trainnumber: joi
    .string()
    .pattern(/^[1-9]\d*$/)
    .length(5)
    .required(),
  mobile: joi
    .string()
    .pattern(/^[1-9]\d*$/)
    .length(10)
    .required(),
  familymobile: joi
    .string()
    .pattern(/^[1-9]\d*$/)
    .length(10)
    .required(),
  customers: joi.array().items(person_schema).min(1).max(4).required(),
  email: joi.string().email().required(),
  district: joi.string().min(3).max(255),
  country: joi.string().min(3).max(255),
  pincode: joi
    .string()
    .pattern(/^[1-9]\d*$/)
    .length(6)
    .required(),
  state: joi.string().min(3).max(255).required(),
});

export const search_train_schema = joi.object({
  from: joi.string().min(2).max(255).required(),
  to: joi.string().min(2).max(255).required(),
  date_of_journey: customDateFormat.required(),
});

export const forgot_password_schema = joi.object({
  email: joi.string().trim().email().required(),
});

export const reset_password_schema = joi.object({
  password: joi.string().trim().min(8).max(255).required(),
});

export const general_ticket_schema = joi.object({
  from: joi.string().min(2).max(255).required(),
  to: joi.string().min(2).max(255).required(),
  train_type: joi.string().valid("SF", "EX").required(),
  quantity: joi.number().min(1).max(4).required(),
});

export const cancel_ticket_schema = joi.object({
  pnr: joi.string().length(10).required(),
});
