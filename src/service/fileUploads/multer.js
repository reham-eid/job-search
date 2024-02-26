import multer, { diskStorage } from "multer";

// const fileUpload = () => {
//   const fileFilter = async(req, file, cb) => {
//     if (!["jpeg", "png", "pdf"].includes(file.mimetype.split('/')[1]))
//       return cb(next(new Error(" Image or PDF", { cause: 400 })), false);
//     return cb(null, true);
//   };
//   return multer({ storage: diskStorage({}), fileFilter });
// };

const fileUpload = () => {
  const fileFilter = (req, file, cb) => {
    if (!["image/png", "image/jpeg","image/jpg","application/pdf"].includes(file.mimetype))
      return cb(next(new Error("only Image",{cause:400})), false);
    return cb(null, true);
  };
  return multer({ storage: diskStorage({}), fileFilter });
};

const uploadSingleFile = (fieldName) => fileUpload().single(fieldName);

export { uploadSingleFile };
