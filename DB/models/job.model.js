import { Schema, Types, model } from "mongoose";
import { level, location, workTime } from "../../src/common/types/enum.js";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    jobLocation: {
      type: String,
      required: true,
      enum: Object.values(location),
    },
    workingTime: {
      type: String,
      enum: Object.values(workTime),
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(level),
    },
    jobDescription: {
      type: String,
      maxLength: 200,
      minLength: 20,
      trim: true,
      required: true,
    },
    technicalSkills: [{ type: String, trim: true, lowercase: true }],
    softSkills: [{ type: String, trim: true, lowercase: true }],
    addedBy: {
      type: Types.ObjectId,
      ref: "user",
      required:true
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true, strictQuery: true }
);
// virtual new field called applications
jobSchema.virtual("applications", {
  ref: "application",
  localField: "_id", // job
  foreignField: "jobId", //application
});


const Job = model("job", jobSchema);
export default Job;
