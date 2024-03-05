import User from "../models/userModel.js";
import bcrypt from 'bcrypt';



export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(404).json({
                success: false,
                message: 'User already Registered with us.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
        })



    } catch (error) {

    }
}