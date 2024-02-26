import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addCompanyVal = Joi.object({
  companyName: generalField.name.required(),
  description: generalField.name.min(10).max(200).required(),
  industry: generalField.name.required(),
  address: Joi.object({
    street: generalField.name.required(),
    phone: generalField.phone.required(),
    city: generalField.name.required(),
  }).required(),
  numberOfEmployees: generalField.number.min(11).max(20),
  companyEmail: generalField.email.lowercase().required(),
}).required();

const updateCompanyVal = Joi.object({
  id: generalField.id.required(),

  companyName: generalField.name,
  description: generalField.name.min(10).max(200),
  industry: generalField.name,
  address: Joi.object({
    street: generalField.name,
    phone: generalField.name,
    city: generalField.name,
  }),
  numberOfEmployees: generalField.number.min(11).max(20),
  companyEmail: generalField.email,
});

const paramsCompanyVal = Joi.object({
  id: generalField.id.required(),
  jobId: generalField.id, // required just for one api (applicationsForOwnerCompany)
});
export { addCompanyVal, updateCompanyVal, paramsCompanyVal };
