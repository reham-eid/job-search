import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";
import * as authController from "./auth.controller.js";
import { roles } from "../../common/types/enum.js";
import { allowTo, protectedRoute } from "../../middlewares/auth.js";

const authRouter = Router();

authRouter
  .post("/signUp", validation(authValidation.signUpVal), authController.signUp)
  .get(
    "/acctivate_account/:emailToken",
    validation(authValidation.activeAccountVal),
    authController.activeAccount
  )
  .patch(
    "/forget-Password",
    validation(authValidation.forgetPassVal),
    authController.forgetPass
  )
  .patch(
    "/reset-Password",
    protectedRoute,
    allowTo(roles.hr,roles.user),
    validation(authValidation.resetPassVal),
    authController.resetPass
  )
  .patch(
    "/update-Password",
    protectedRoute,
    allowTo(roles.hr,roles.user),
    validation(authValidation.updatePassVal),
    authController.updatePass
  )
  .post("/login", validation(authValidation.loginVal), authController.logIn)
  .put(
    "/update-me",
    protectedRoute,
    allowTo(roles.hr,roles.user),
    validation(authValidation.updateMeVal),
    authController.updateMe
  )
  .delete(
    "/delete-me",
    protectedRoute,
    allowTo(roles.hr,roles.user),
    authController.deleteMe
  )
  .get(
    "/get-me",
    protectedRoute,
    allowTo(roles.hr,roles.user),
    authController.getMe
  )
  .get(
    "/another-user/:id",
    protectedRoute,
    allowTo(roles.hr,roles.user),
    validation(authValidation.anyAccountVal),
    authController.anyAccount
  )
  .get(
    "/recoveryEmails",
    protectedRoute,
    allowTo(roles.admin),
    validation(authValidation.recoveryEmailVal),
    authController.recoveryEmail
  );

export default authRouter;
