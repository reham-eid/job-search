import { globalError } from "../middlewares/globalError.js"
import authRouter from "./auth/auth.routes.js"
import companyRouter from "./company/company.routes.js"
import jobRouter from "./job/job.routes.js"


const init = (app)=>{

    app.use('/api/v1/auth',authRouter),
    app.use('/api/v1/companies',companyRouter),
    app.use('/api/v1/jobs',jobRouter),


    //GLOBAL ERROR 
    app.use(globalError)
}
export default init