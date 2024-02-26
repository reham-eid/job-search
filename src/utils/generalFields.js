import Joi from "joi";
import { validateObjectId } from "../middlewares/validation.middleware.js";
import { location, roles, status, workTime } from "../common/types/enum.js";

const generalField = {
  name: Joi.string().trim(),
  email: Joi.string()
    .email({
      maxDomainSegments: 2,
      tlds: { allow: ["com", "pro"] },
    })
    .lowercase(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.valid(Joi.ref("password")),
  phone: Joi.string().pattern(
    new RegExp("^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$")
  ),
  role: Joi.string().valid(...Object.values(roles)),
  jobLocation: Joi.string().valid(...Object.values(location)),
  workingTime: Joi.string().valid(...Object.values(workTime)),
  seniorityLevel: Joi.string().valid(
    "Junior",
    "Mid-Level",
    "Senior",
    "Team-Lead",
    "CTO"
  ),
  skills: Joi.array().items(Joi.string().required()),
  status: Joi.string().valid(...Object.values(status)),
  id: Joi.string().custom(validateObjectId),
  date: Joi.date(),
  number: Joi.number(),
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "application/pdf")
      .required(),
    size: Joi.number().max(5242880).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }),
};

export default generalField;
