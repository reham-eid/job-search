import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware.js";
import * as companyValidation from "./company.validation.js";
import * as companyController from "./company.controller.js";
import { roles } from "../../common/types/enum.js";
import { allowTo, protectedRoute } from "../../middlewares/auth.js";

const companyRouter = Router();

companyRouter
  .route("/")
  .put(
    protectedRoute,
    allowTo(roles.hr),
    validation(companyValidation.updateCompanyVal),
    companyController.updateCompany
  )
  .post(
    protectedRoute,
    allowTo(roles.hr),
    validation(companyValidation.addCompanyVal),
    companyController.addCompany
  )
  .get(
    protectedRoute,
    allowTo(roles.hr, roles.user),
    companyController.CompanyName
  );

companyRouter.use(protectedRoute, allowTo(roles.hr));

companyRouter.get(
  "/applications/:id",
  validation(companyValidation.paramsCompanyVal),
  companyController.applicationsForOwnerCompany
);
companyRouter.get(
  "/excel/:id",
  validation(companyValidation.paramsCompanyVal),
  companyController.Excel
);
companyRouter
  .route("/:id")
  .get(
    validation(companyValidation.paramsCompanyVal),
    companyController.oneCompany
  )
  .delete(
    validation(companyValidation.paramsCompanyVal),
    companyController.deleteCompany
  );

export default companyRouter;
