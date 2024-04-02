import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const signUpVal = Joi.object({
  firstName: generalField.name.required(),
  lastName: generalField.name.required(),
  email: generalField.email.required(),
  password: generalField.password.required(),
  confirmPassword: generalField.confirmPassword.required(),
  role: generalField.role,
  mobileNumber: generalField.phone.required(),
  birthDate: generalField.date,
  recoveryEmail: generalField.email
    .disallow(Joi.ref("email"))
    .trim()
    .required()
    .messages({
        " *recoveryEmail*": "must be valid Email and not equal previous email  ",
    }),
}).required();

const activeAccountVal = Joi.object({
  emailToken: generalField.name.required(),
}).required();

const anyAccountVal = Joi.object({
  id: generalField.id.required(),
}).required();

const recoveryEmailVal = Joi.object({
  recoveryEmail: generalField.email.required(),
}).required();

const loginVal = Joi.object({
  email: generalField.email.when("mobileNumber", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  mobileNumber: generalField.phone,
  password: generalField.password.required(),
}).required();

const updateMeVal = Joi.object({
  firstName: generalField.name,
  lastName: generalField.name,
  email: generalField.email,
  mobileNumber: generalField.phone,
  birthDate: generalField.date,
  recoveryEmail: generalField.email
    .disallow(Joi.ref("email"))
    .trim()
    .message({
      message:
        " *recoveryEmail* must be valid Email and not equal previous email  ",
    }),
}).required();

const forgetPassVal = Joi.object({
  mobileNumber: generalField.phone.required(),
}).required();

const resetPassVal = Joi.object({
  newPassword: generalField.password.required(),
  confirmPassword: Joi.valid(Joi.ref("newPassword")).required(),
  code: generalField.name.required(),
}).required();

const updatePassVal = Joi.object({
  email: generalField.email.when("mobileNumber", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  mobileNumber: generalField.phone,
  password: generalField.password.required(),
  newPassword: generalField.password
    .disallow(Joi.ref("password"))
    .required()
    .messages({
      "*": "new password should not be the same like old password ",
    }),
  confirmPassword: Joi.valid(Joi.ref("newPassword"))
    .messages({"*confirmPassword* " :"confirm your new Password"})
    .required(),
}).required();

export {
  signUpVal,
  activeAccountVal,
  loginVal,
  updateMeVal,
  anyAccountVal,
  forgetPassVal,
  resetPassVal,
  updatePassVal,
  recoveryEmailVal,
};
