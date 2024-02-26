import User from "../../DB/models/user.model.js";

const protectedRoute = asyncHandler(async (req, res, next) => {
  // get Token
  const { authorization } = req.headers;
  //token exisit
  if (!authorization) return next(new Error("login again", { cause: 400 }));
  // check Bearer key
  if (!authorization?.startsWith(process.env.JWT_BEARER_KEY))
    return next(new Error("Invalid Bearer key ", { cause: 400 }));
  // get token
  const token = authorization.split(process.env.JWT_BEARER_KEY)[1];
  //check token
  if (!token) return next(new Error("Invalid Toke ", { cause: 401 }));
  // verify token
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //check data in payload
  if (!payload?.userId) {
    return next(new Error("Invalid token payload ", { cause: 400 }));
  }
  // check User by token.userId
  const user = await User.findById(payload.userId);
  // if not exisit res
  !user && next(new Error("sign up first..", { cause: 404 }));

  if (user?.changePassAt) {
    // if exisit compare between time Date.now() of User.changePassAt
    // vs token.iat
    const time = parseInt(user?.changePassAt.getTime() / 1000);
    // time > token :it means token older (invalid)
    if (time > payload.iat) {
      next(new Error("token expaired... login again ", { cause: 400 }));
    }
  }
  req.user = user;
  next();
});
const allowTo = (...roles) => {
  //=== roles=[]
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("you dont have permission", { cause: 403 }));
    }
    next();
  });
};

export { protectedRoute, allowTo };
