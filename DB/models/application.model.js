import { Schema, Types, model } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "job",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    userTechSkills: [{ type: String, trim: true, lowercase: true }],
    userSoftSkills: [{ type: String, trim: true, lowercase: true }],
    userResume: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  { timestamps: true, strictQuery: true }
);
applicationSchema.pre("findOne", function () {
  this.populate("userId");
});
const Application = model("application", applicationSchema);
export default Application;
