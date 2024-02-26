import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware.js";
import * as companyValidation from "./company.validation.js";
import * as companyController from "./company.controller.js";
import { roles } from "../../common/types/enum.js";
import { allowTo, protectedRoute } from "../../middlewares/auth.js";

const companyRouter = Router();


companyRouter
  .route("/")
  .post(
    protectedRoute,
    allowTo(roles.hr),
    validation(companyValidation.addCompanyVal),
    companyController.addCompany)
  .get(
    protectedRoute,
    allowTo(roles.hr, roles.user),
    companyController.CompanyName
  );

companyRouter.use(protectedRoute, allowTo(roles.hr));

companyRouter.get(
  "/applications/:id/:jobId",
  validation(companyValidation.paramsCompanyVal),
  companyController.applicationsForOwnerCompany
);
companyRouter
  .route("/:id")
  .get(
    validation(companyValidation.paramsCompanyVal),
    companyController.oneCompany
  )
  .put(
    validation(companyValidation.updateCompanyVal),
    companyController.updateCompany
  )
  .delete(
    validation(companyValidation.paramsCompanyVal),
    companyController.deleteCompany
  );

export default companyRouter;
