import bcryptjs from "bcryptjs";

export const hash = ({ plainTxt, salt = 8 } = {}) => {
  const result = bcryptjs.hashSync(plainTxt, salt);
  return result;
};

export const compare = ({plainTxt, hashTxt} = {}) => {
  const match = bcryptjs.compareSync(plainTxt, hashTxt);
  return match;
};
