import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import { UserClass } from "../../common/classes/user.class.js";
import { message } from "../../common/messages/message.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import slugify from "slugify";

// @desc create Company profile
// @route POST  /api/v1/companies/
// @access private
const addCompany = asyncHandler(async (req, res, next) => {
  // data from body
  const {
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
  } = req.body;
  //check exisit
  const isCompany = await Company.findOne({
    $or: [
      { companyName: companyName.toLowerCase() },
      { companyEmail: companyEmail.toLowerCase() },
    ],
  });
  if (isCompany)
    return next(new Error(message.company.status409, { cause: 409 }));
  // create company
  const newCompany = new UserClass();
  newCompany.address = address;
  newCompany.companyEmail = companyEmail;
  newCompany.companyName = companyName;
  newCompany.industry = industry;
  newCompany.description = description;
  newCompany.numberOfEmployees = numberOfEmployees;
  newCompany.companyHR = req.user._id;
  newCompany.slug = slugify(req.body.companyName);

  const company = await Company.create(newCompany);
  res.status(201).json({ message: "company created", company });
});
// @desc update Company profile
// @route PUT  /api/v1/companies/:id
// @access private
const updateCompany = asyncHandler(async (req, res, next) => {
  // get id company from params
  // check company in mongodb
  const isCompany = await Company.findById(req.params.id);
  !isCompany && next(new Error(message.company.status404, { cause: 404 }));

  // check company owner
  if (isCompany.companyHR.toString() !== req.user._id.toString())
    return next(new Error(message.company.status403, { cause: 403 }));
  // update company
  const company = await Company.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      slug: slugify(req.body.companyName),
    },
    { new: true }
  );
  res.status(200).json({ message: "company updated", company });
});
// @desc delete Company profile
// @route DELETE  /api/v1/companies/:id
// @access private
const deleteCompany = asyncHandler(async (req, res, next) => {
  // get id company from params
  // check company in mongodb
  const company = await Company.findById(req.params.id);
  !company && next(new Error(message.company.status404, { cause: 404 }));
  // check owner
  if (req.user._id.toString() !== company.companyHR.toString())
    return next(new Error(message.company.status403, { cause: 401 }));

  // soft delete company
  await company.updateOne({},{isDeleted:true});
  res.status(200).json({ message: "company deleted", company });
});
// @desc delete Company profile
// @route GET  /api/v1/companies/:id
// @access private
const oneCompany = asyncHandler(async (req, res, next) => {
  // get id company from params
  // check company in mongodb
  const company = await Company.findOne({ _id: req.params.id }); //filter feature
  if (!company)
    return next(new Error(message.company.status404, { cause: 404 }));
  res.status(200).json({ message: "company: ", company });
});
// @desc search Company profile
// @route GET  /api/v1/companies/?searchCompany=malki
// @access private
const CompanyName = asyncHandler(async (req, res, next) => {
  const { searchCompany } = req.query;
  const company = await Company.find({}).search(searchCompany);

  res.status(200).json({ message: "company: ", company });
});
// @desc Company_HR can access all applications to jobs in his company
// @route GET  /api/v1/companies/applications/:id/:jobId
// @access private
const applicationsForOwnerCompany = asyncHandler(async (req, res, next) => {
  // check company in mongodb
  const isCompany = await Company.findById(req.params.id);
  !isCompany && next(new Error(message.company.status404, { cause: 404 }));
  // check Job in mongodb
  const isJob = await Job.findById(req.params.jobId);
  !isJob && next(new Error("Job not found", { cause: 404 }));

  // check company owner
  if (isCompany.companyHR.toString() !== req.user._id.toString())
    return next(new Error(message.company.status403, { cause: 403 }));
  // see applications for this company
  const application = await Application.findOne({
    jobId: req.params.jobId,
  });
  res.status(200).json({ message: "applications ", cvs: application });
});

export {
  addCompany,
  updateCompany,
  deleteCompany,
  oneCompany,
  CompanyName,
  applicationsForOwnerCompany,
};
