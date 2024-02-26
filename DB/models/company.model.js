import { Schema, Types, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required:true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 200,
      minLength: [
        10,
        "Like what are the actual activities and services provided by the company ? ",
      ],
    },
    industry: {
      type: String,
      required:true,
      trim: true,
    },
    address: {
      street: {
        type: String,
        required:true,
        trim: true,
      },
      phone: {
        type: String,
        unique: true,
        required:true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
    },
    numberOfEmployees: {
      min:Number ,
      max:Number,
    },
    companyHR: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    companyEmail: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

companySchema.pre("findOne", function () {
  this.populate("jobs"); //return all jobs related to this company
});

companySchema.query.search = function (searchCompany) {
  if (searchCompany) {
    return this.find({ companyName: { $regex: searchCompany, $options: "i" } });
  }
};
const Company = model("company", companySchema);
export default Company;
