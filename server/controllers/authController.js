import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
export const register = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing details'});
    }
    try{

        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success: false, message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, ProcessingInstruction.env.JWT_SECRET, {expiredIn: '7d'});

        res.cookie('token', token {
            httpOnly: true, 
            secure: ProcessingInstruction.env.NODE_ENV === 'production'
            sameSite: ProcessingInstruction.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7*24*60*60*1000
        });

        return res.json({success: true});

    } catch (error){
        res.json({success: false, message: error.message})
    }
}
export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'Email and password are required'});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'Invalid email'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: 'Invalid password'});
        }

        const token = jwt.sign({id: user._id}, ProcessingInstruction.env.JWT_SECRET, {expiredIn: '7d'});

        res.cookie('token', token {
            httpOnly: true, 
            secure: ProcessingInstruction.env.NODE_ENV === 'production'
            sameSite: ProcessingInstruction.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7*24*60*60*1000
        });

        return res.json({success: true});

    } catch (error){
        res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true, 
            secure: ProcessingInstruction.env.NODE_ENV === 'production'
            sameSite: ProcessingInstruction.env.NODE_ENV === 'production' ? 'none' : 'strict', 
        })

        return res.json({success: true, message: 'Logged out'});

    } catch (error){
        res.json({success: false, message: error.message})
    }
}