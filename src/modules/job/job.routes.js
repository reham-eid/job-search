import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware.js";
import * as jobValidation from "./job.validation.js";
import * as jobController from "./job.controller.js";
import { roles } from "../../common/types/enum.js";
import { uploadSingleFile } from "../../service/fileUploads/multer.js";
import { allowTo, protectedRoute } from "../../middlewares/auth.js";


jobRouter
  .route("/")
  .post(
    protectedRoute,
    allowTo(roles.hr),
    validation(jobValidation.addJobVal),
    jobController.addJob
  )
  .get(
    protectedRoute,
    allowTo(Object.values(roles)),
    validation(jobValidation.allJobVal),
    jobController.allJob
  )
  .get(
    protectedRoute,
    allowTo(Object.values(roles)),
    validation(jobValidation.allJobForOneCompanyVal),
    jobController.allJobForOneCompany
  );

jobRouter
  .route("/:id")
  .get(
    protectedRoute,
    allowTo(Object.values(roles)),
    validation(jobValidation.paramsJobVal),
    jobController.Excel
  )
  .post(
    protectedRoute,
    allowTo(roles.user),
    uploadSingleFile("cv"),
    validation(jobValidation.addApplicationVal),
    jobController.addApplication
  )
  .put(
    protectedRoute,
    allowTo(roles.hr),
    validation(jobValidation.updateJobVal),
    jobController.updateJob
  )
  .delete(
    protectedRoute,
    allowTo(roles.hr),
    validation(jobValidation.paramsJobVal),
    jobController.deleteJob
  );

export default jobRouter;
