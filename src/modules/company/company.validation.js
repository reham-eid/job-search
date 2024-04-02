import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addCompanyVal = Joi.object({
  name:generalField.name,
  email:generalField.email,
  companyName: generalField.name.required(),
  description: generalField.name
    .min(10)
    .max(200)
    .message({
      message: " *description* length must be at least 10 characters long✖️ ",
    })
    .required(),
  industry: generalField.name.required(),

  street: generalField.name.required(),
  city: generalField.name.required(),

  from: Joi.number()
    .min(0)
    .required()
    .label("minimum number Of Employee [from]"),
  to: Joi.number()
    .greater(Joi.ref("from"))
    .required()
    .label("maximum number Of Employee [to] "),

  companyEmail: generalField.email.lowercase().required(),
}).required();

const updateCompanyVal = Joi.object({ 
  companyName: generalField.name,
  description: generalField.name
    .min(10)
    .max(200)
    .message({
      message: " *description* length must be at least 10 characters long✖️ ",
    }),
  industry: generalField.name,
  street: generalField.name,
  city: generalField.name,
  numberOfEmployees: Joi.object({
    from: Joi.number().min(0).label("minimum number Of Employee [from] "),
    to: Joi.number()
      .greater(Joi.ref("from"))
      .label("maximum number Of Employee [to] "),
  }),
  companyEmail: generalField.email,
});

const paramsCompanyVal = Joi.object({
  id: generalField.id.required(),
  date: Joi.date(),
});

export { addCompanyVal, updateCompanyVal, paramsCompanyVal };
