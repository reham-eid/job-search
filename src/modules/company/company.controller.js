import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import { Types } from "mongoose";

import { UserClass } from "../../common/classes/user.class.js";
import { message } from "../../common/messages/message.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import slugify from "slugify";
// import XlsxPopulate from "xlsx-populate";
// import xlsx from "xlsx";
import fs from "fs";
import { log } from "console";
import XlsxPopulate from "xlsx-populate";

// @desc create Company profile
// @route POST  /api/v1/companies/
// @access private *done
const addCompany = asyncHandler(async (req, res, next) => {
  // data from body
  const {
    companyName,
    companyEmail,
    description,
    industry,
    city,
    street,
    from,
    to,
  } = req.body;
  //check exisit
  const isCompany = await Company.findOne({
    $or: [
      { companyName: companyName?.toLowerCase() },
      { companyEmail: companyEmail?.toLowerCase() },
    ],
  });
  if (isCompany)
    return next(new Error(message.company.status409, { cause: 409 }));
  // create company
  const newCompany = new UserClass();
  newCompany.address = { city, street };
  newCompany.companyEmail = companyEmail;
  newCompany.companyName = companyName;
  newCompany.industry = industry;
  newCompany.description = description;
  newCompany.numberOfEmployees = { from, to };
  newCompany.companyHR = req.user._id;
  newCompany.slug = slugify(companyName);

  const company = await Company.create(newCompany);
  res.status(201).json({ message: "company created", company });
});
// @desc update Company profile
// @route PUT  /api/v1/companies/:id
// @access private
const updateCompany = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    companyEmail,
    description,
    industry,
    city,
    street,
    from,
    to,
  } = req.body;

  // check company in mongodb
  const isCompany = await Company.findOne({
    $or: [
      { companyName: companyName?.toLowerCase() },
      { companyEmail: companyEmail?.toLowerCase() },
    ],
  });
  if (!isCompany)
    return next(new Error(message.company.status404, { cause: 404 }));

  // check company owner
  if (isCompany.companyHR.toString() !== req.user._id.toString())
    return next(new Error(message.company.status403, { cause: 403 }));
  // update company
  const company = await isCompany.updateOne(
    {
      companyEmail: isCompany.companyEmail,
      companyName: isCompany.companyName,
      companyHR: isCompany.companyHR,
    },
    {
      ...req.body,
      slug: slugify(companyName),
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
  if (!company)
    return next(new Error(message.company.status404, { cause: 404 }));
  // check owner
  if (req.user._id.toString() !== company.companyHR.toString())
    return next(new Error(message.company.status403, { cause: 401 }));

  // soft delete company
  await company.updateOne({}, { isDeleted: true });
  res.status(200).json({ message: "company deleted", company });
});
// @desc get Company data with all related jobs
// @route GET  /api/v1/companies/:id
// @access private *no
const oneCompany = asyncHandler(async (req, res, next) => {
  // get id company from params
  // check company in mongodb
  const company = await Company.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.params.id),
        companyHR: new Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "companyHR",
        foreignField: "addedBy",
        as: "allJobs",
      },
    },
    {
      $unwind: "$allJobs",
    },
  ]);
  res.status(200).json({ message: "company: ", company });
});
// @desc search Company profile
// @route GET  /api/v1/companies/?searchCompany=malki
// @access private *no
const CompanyName = asyncHandler(async (req, res, next) => {
  const { searchCompany } = req.query;
  const company = await Company.find({}).search(searchCompany);

  res.status(200).json({ message: "company: ", company });
});
// @desc Company_HR can access all applications to jobs in his company
// @route GET  /api/v1/companies/applications/:id/:jobId
// @access private *done
const applicationsForOwnerCompany = asyncHandler(async (req, res, next) => {
  // check company in mongodb
  const company = await Company.aggregate([
    {
      $match: { _id: new Types.ObjectId(req.params.id) },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "companyHR",
        foreignField: "addedBy",
        as: "job",
      }, //[ {}, {}]
    },
    {
      $unwind: "$job", // {},{}
    },
    {
      $lookup: {
        from: "applications",
        localField: "job._id",
        foreignField: "jobId",
        as: "job.applications",
      },
    },
    {
      $project: { "job.applications": 1 },
    },
  ]);
  if (!company)
    return next(new Error(message.company.status404, { cause: 404 }));
  res.status(200).json({ message: "applications ", cvs: company });
});

//add an endpoint that collects the applications for a specific company
// on a specific day and create an Excel sheet with this data **OLD**
// const Excel = asyncHandler(async (req, res, next) => {
//   aggregation
// console.log("here",companyApplications);
//   const excel = fs.createWriteStream("./out.xls");

//   // Modify the workbook.
//   for (const oneApp of companyApplications) {
//     const raw = `${oneApp.job.applications._id} + \t +${oneApp.job.applications.jobId} + \t + ${oneApp.job.applications.userId} + \t `;
//     // console.log("wwwww",raw);
//     return fs.write(raw);
//   }
//   excel.close();
//   return res.json({ message: "done" });
// });

//add an endpoint that collects the applications for a specific company
// on a specific day and create an Excel sheet with this data **NEW**
const Excel = asyncHandler(async (req, res, next) => {
  const date = new Date(req.query.date);
  const companyApplications = await Company.aggregate([
    {
      $match: { _id: new Types.ObjectId(req.params.id) },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "companyHR",
        foreignField: "addedBy",
        as: "job",
      }, //[ {}, {}]
    },
    {
      $unwind: "$job", // {},{}
    },
    {
      $lookup: {
        from: "applications",
        localField: "job._id",
        foreignField: "jobId",
        as: "job.applications",
      },
    },
    {
      $unwind: "$job.applications",
    },
    // {
    //   $match: { "job.applications.createdAt": date },
    // },
    // {
    //   $project: { applications: "$job.applications", "job._id": 1 },
    // },
  ]);
  const w = XlsxPopulate.fromBlankAsync().then((workbook) => {

    // Modify the workbook.
    let rowIndex = 1
    for (const oneApp of companyApplications) {
          workbook.sheet("Sheet1").cell(`A${rowIndex}`).value("_id");
          workbook.sheet("Sheet1").cell(`B${rowIndex}`).value(oneApp.job.applications._id.toString());
          workbook.sheet("Sheet1").cell(`A${rowIndex+1}`).value("jobId");
          workbook.sheet("Sheet1").cell(`B${rowIndex+1}`).value(oneApp.job.applications.jobId.toString());
          workbook.sheet("Sheet1").cell(`A${rowIndex+2}`).value("userId");
          workbook.sheet("Sheet1").cell(`B${rowIndex+2}`).value(oneApp.job.applications.userId.toString());
          rowIndex += 3; // Increment rowIndex for next application
        
    }
    // Write to file.
    return workbook.toFileAsync("./out.xlsx");
  });
  return res.json({ message: "done" });

});

export {
  addCompany,
  updateCompany,
  deleteCompany,
  oneCompany,
  CompanyName,
  applicationsForOwnerCompany,
  Excel,
};
