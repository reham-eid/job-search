import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import cloudinary from "../../service/fileUploads/cloudinary.js";
import XlsxPopulate from "xlsx-populate";
import xlsx from "xlsx";
import schedule from "node-schedule";
// @desc add jobs by hr company
// @route POST  /api/v1/jobs/
// @access private
const addJob = asyncHandler(async (req, res, next) => {
  // data from body
  // // create job
  const job = await Job.create({
    ...req.body,
    addedBy: req.user._id,
  });
  res.status(201).json({ message: "job added", job });
});
// @desc update a job by hr company
// @route PUT  /api/v1/jobs/:id
// @access private
const updateJob = asyncHandler(async (req, res, next) => {
  // check job and hr
  const isJob = await Job.findOne({
    _id: req.params.id,
    addedBy: req.user._id,
  });
  if (!isJob) return res.status(404).json({ message: "job Not found" });

  //update job
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    {
      new: true,
    }
  );

  res.status(200).json({ message: "job updated", job });
});
// @desc delete a job by hr company
// @route DELETE  /api/v1/jobs/:id
// @access private
const deleteJob = asyncHandler(async (req, res, next) => {
  // check job
  const isJob = await Job.findOne({
    _id: req.params.id,
    addedBy: req.user._id,
  });
  if (!isJob) return res.status(404).json({ message: "job Not found" });

  // soft delete job
  await isJob.updateOne({},{isDeleted:true});

  res.status(200).json({ message: "job deleted", job });
});
// @desc Get all Jobs
// @route GET
// @access private
const allJob = asyncHandler(async (req, res, next) => {
  // 2 apis in 1
  ///api/v1/jobs/?
  // check query
  if (req.query) {
    //6- all Jobs that match some filters
    const job = await Job.find({ ...req.query }); ////filter feature
    return res.status(200).json({ message: `jobs:  `, job });
  }
  //4- all Jobs with their company’s information
  ///api/v1/jobs/
  const job = await Job.find().populate([
    {
      path: "addedBy",
      select: "username",
      populate: [{ path: "company", select: "companyName" }],
    },
  ]);
  res.status(200).json({ message: `jobs: `, job });
});
// @desc Get all Jobs
// @route GET /api/v1/jobs?
// @access private
const allJobForOneCompany = asyncHandler(async (req, res, next) => {
  // check params
  //5-all Jobs for a specific company
  const company = await Company.find({ companyName: req.query.name }).populate([
    {
      path: "companyHR",
      select: "username",
      populate: [{ path: "jobs", select: "jobTitle" }],
    },
  ]);
  if (!company) return next(new Error("company not found", { cause: 404 }));

  res.status(200).json({ message: `jobs: `, result:company[0].companyHR.jobs });
});
// @desc user applay to job for spicific company
// @route POST  /api/v1/jobs/:id
// @access private
const addApplication = asyncHandler(async (req, res, next) => {
  // data from body

  //check if user applied an application for jobId before or not
  const applied = await Application.findOne({
    userId:req.user._id,
    jobId:req.params.id
  })
  if(applied)return next(new Error("already applied", { cause: 409 }));
  // check cv
  if (!req.file) return next(new Error("CV is required", { cause: 400 }));

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/userResume` }
  );
  // create application
  const application = await Application.create({
    ...req.body,
    userId: req.user._id,
    jobId: req.params.id,
    userResume: { id: public_id, url: secure_url },
  });
  res
    .status(201)
    .json({ message: "Application send successfully", application });
});

//add an endpoint that collects the applications for a specific company
// on a specific day and create an Excel sheet with this data
const Excel = asyncHandler(async (req, res, next) => {
  schedule.scheduleJob("0 5 * * 6", async function () {
    //5:00 per week per month on saterday
    const w = XlsxPopulate.fromBlankAsync().then((workbook) => {
      // check company in db by params (merg param)
      const company = Company.findById(req.params.companyId);
      if (!company) return next(new Error("company not found", { cause: 404 }));

      const app = Application.find({
        jobId: req.params.id,
      });
      // Modify the workbook.
      for (const oneApp of app) {
        workbook.sheet("Sheet1").cell("A1").value("_id");
        workbook.sheet("Sheet1").cell("B1").value(oneApp._id);
        workbook.sheet("Sheet1").cell("A2").value("jobId");
        workbook.sheet("Sheet1").cell("B2").value(oneApp.jobId);
        workbook.sheet("Sheet1").cell("A3").value("userId");
        workbook.sheet("Sheet1").cell("B3").value(oneApp.userId);
      }

      // Write to file.
      return workbook.toFileAsync("./out.xlsx");
    });
    let workbook1 = xlsx.writeFileAsync(w);
    console.log(workbook1);
  });
});

export { addJob, updateJob, deleteJob, allJob, addApplication,allJobForOneCompany, Excel };
