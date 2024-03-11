import jwt from 'jsonwebtoken';



export const isUserAuthenticated = (req, res, next) => {

    const { token } = req.cookies;
    console.log(token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
}