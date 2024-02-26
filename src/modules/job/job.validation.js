import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addJobVal = Joi.object({
  jobTitle: generalField.name.required(),
  jobLocation: generalField.jobLocation.required(),
  workingTime: generalField.workingTime.required(),
  seniorityLevel: generalField.seniorityLevel.required(),
  jobDescription: generalField.name.min(20).max(200).required(),
  technicalSkills: generalField.skills.required(),
  softSkills: generalField.skills.required(),
}).required();

const updateJobVal = Joi.object({
  id: generalField.id.required(),

  jobTitle: generalField.name,
  jobLocation: generalField.jobLocation,
  workingTime: generalField.workingTime,
  seniorityLevel: generalField.seniorityLevel,
  jobDescription: generalField.name.min(20).max(200),
  technicalSkills: generalField.skills,
  softSkills: generalField.skills,
  companyId: generalField.id,
}).required();

const paramsJobVal = Joi.object({
  id: generalField.id.required(),
  companyId: generalField.id.required(),
}).required();

const allJobVal = Joi.object({

  jobTitle: generalField.name,
  jobLocation: generalField.jobLocation,
  workingTime: generalField.workingTime,
  seniorityLevel: generalField.seniorityLevel,
  technicalSkills: generalField.name,
}).required();

const allJobForOneCompanyVal = Joi.object({

  name: generalField.name,

}).required();

const addApplicationVal = Joi.object({
  id: generalField.id.required(),

  userTechSkills: generalField.skills.required(),
  userSoftSkills: generalField.skills.required(),
  userResume: generalField.file.required(),
}).required();

export { addJobVal, updateJobVal, allJobForOneCompanyVal,paramsJobVal, allJobVal, addApplicationVal };
