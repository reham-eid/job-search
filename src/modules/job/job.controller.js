import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import { message } from "../../common/messages/message.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import cloudinary from "../../service/fileUploads/cloudinary.js";

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
  if (!isJob) return next({ message: message.job.status404,cause:404 });

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
  if (!isJob) return next({ message: message.job.status404,cause:404 });

  // soft delete job
  await isJob.updateOne({}, { isDeleted: true });

  res.status(200).json({ message: "job deleted", job });
});
// @desc Get all Jobs
// @route GET
// @access private *no
const allJob = asyncHandler(async (req, res, next) => {
  // 2 apis in 1
  ///api/v1/jobs/?
  // check query
  if (req.query) {
    //whats wrong!
    //6- all Jobs that match some filters
    const job = await Job.find({ ...req.query }); ////filter feature
    console.log(req.query);

    return res.status(200).json({ message: `jobs:  `, job });
  }
  //4- all Jobs with their company’s information
  ///api/v1/jobs/
  // aggregate
  const job = await Job.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "addedBy",
        foreignField: "companyHR",
        as: "company",
      },
    },
    {
      $unwind: "$company",
    },
  ]);
  res.status(200).json({ message: `jobs: `, job });
});

// @desc Get all Jobs
// @route GET /api/v1/jobs?
// @access private *done
const allJobForOneCompany = asyncHandler(async (req, res, next) => {
  // check params
  //5-all Jobs for a specific company
  const company = await Company.find({ companyName: req.query.name }).populate([
    {
      path: "companyHR",
      select: "username",
      populate: [{ path: "user", populate: [{ path: "jobs" }] }],
    },
  ]);

  res.status(200).json({ message: `jobs: `, result: company }); //[0].companyHR.jobs
});
// @desc user applay to job for spicific company
// @route POST  /api/v1/jobs/:id
// @access private
const addApplication = asyncHandler(async (req, res, next) => {
  // data from body
  //check if user applied an application for jobId before or not
  const applied = await Application.findOne({
    userId: req.user._id,
    jobId: req.params.id,
  });
  if (applied) return next(new Error("already applied", { cause: 409 }));
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



export {
  addJob,
  updateJob,
  deleteJob,
  allJob,
  addApplication,
  allJobForOneCompany,
};
