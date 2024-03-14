import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';



export const isUserAuthenticated = (req, res, next) => {

    const { token } = req.cookies;
    console.log("token", token);

    if (!token) {
       throw new ApiError(401, "Unauthorized");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    next();
}