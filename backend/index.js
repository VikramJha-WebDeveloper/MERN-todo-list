require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://mern-todo-list-frontend-2a8o.onrender.com",
    credentials: true
}));
app.use(cookieParser());

const port = process.env.PORT || 8000;
const database_url = process.env.DATABASE_URL;
const secret_key = process.env.SECRET_KEY;

const connectToDatabase = async() => {
    try{
        await mongoose.connect(database_url);
        console.log('Successfully connected to the database');
    }catch(err){
        console.log("error connecting to the database", err);
    };
};
connectToDatabase();

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    isAgreed: Boolean,
});
const UserModel = mongoose.model("User", userSchema);

const itemSchema = new mongoose.Schema({
    itemName: String,
    itemQuantity: String,
    user_id: String,
    isCompleted: Boolean,
});
const ItemModel = mongoose.model("Item", itemSchema);

app.post("/register", async(req, res)=>{
    const {fullName, email, password, confirmPassword, isAgreed} = req.body;

    if(!fullName || !email || !password || !confirmPassword || !isAgreed){
        console.log("All fields are required");
       return res.status(400).json({errorMessage: "All fields are required"});
    };

    if(password !== confirmPassword){
        console.log("Password do not match");
        return res.status(400).json({errorMessage: "Password do not match"});
    };

    try{
        const existedUser = await UserModel.findOne({email});
        if(existedUser){
            console.log("This user is already registered");
            return res.status(400).json({errorMessage: "This user is already registered"});
        };

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({fullName, email, password: hashPassword, isAgreed});
        await newUser.save();
        console.log("User successfully registered");
        res.status(200).json({message: "User registered successfully"});
    }catch(err){
        console.log("error during registration");
        res.status(500).json({errorMessage: "Internal server error"})
    }
});

app.post("/login", async(req, res)=>{
    const {email, password, isRemembered} = req.body;
    if(!email || !password || !isRemembered){
        console.log("All fields are required");
        return res.status(400).json({errorMessage: "All fields are required"});
    };

    try{
        const foundUser = await UserModel.findOne({email});
        if(!foundUser){
            console.log("No user found");
            return res.status(400).json({errorMessage: "No user found"});
        };

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if(!isMatch){
            console.log("Invalid credentials");
            return res.status(400).json({errorMessage: "Invalid credentials"});
        };
        const token = jwt.sign({user_id: foundUser._id}, secret_key, {expiresIn: "1h"});
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite: "None",
        });
        console.log("Login successful");
        return res.status(200).json({message: "Login successful"})
    }catch(err){
        console.log("error during login");
        res.status(500).json({errorMessage: "Internal server error"});
    }
});



const verifyToken = async(req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({errorMessage: "No token provided"});
    };

    try{
        const decode = jwt.verify(token, secret_key);
        // console.log("decode", decode);

        req.user = decode;
        next();
    }catch(err){
        console.log(err);
    };
};



app.post("/addItem", verifyToken, async(req, res)=>{
    const {itemName, itemQuantity, isCompleted} = req.body;
    if(!itemName || !itemQuantity){
        console.log("All fields are required");
        return res.status(400).json({errorMessage: "All fields are required"});
    };

    try{
    const newItem = new ItemModel({itemName, itemQuantity, user_id: req.user.user_id, isCompleted});
    await newItem.save();
    const userItems = await ItemModel.find({user_id: req.user.user_id});
    res.status(200).json({message: "Item added successfully", items: userItems, newItem});
    }catch(err){
        console.log("Interbal server error");
        res.status(400).json({errorMessage: "Internal server error"});
    }
});



app.post("/updateComplete", async(req, res)=>{

    try{
        const foundItemAndUpdate = await ItemModel.findByIdAndUpdate(req.body._id, {isCompleted: !req.body.isCompleted}, {new: true});
        if(foundItemAndUpdate){
            res.status(200).json({status: !req.body.isCompleted})
        };
    }catch(err){
        console.log(err);
    };
})

app.post("/editItem", async(req, res)=>{
    try{
        const findItemAndUpdate = await ItemModel.findByIdAndUpdate(req.body.itemToEdit._id, {itemName: req.body.itemName, itemQuantity: req.body.itemQuantity});

        if(findItemAndUpdate){
            console.log("Item updated successfully");
            res.status(200).json({message: "Item updated successfully"})
        }
    }catch(err){
        console.log(err);
    };
});

app.post("/deleteItem", async(req, res)=>{
    console.log(req.body);
    try{
        const foundItemAndDelete = await ItemModel.findByIdAndDelete(req.body._id);
        if(foundItemAndDelete){
            console.log("Item deleted successfully");
            return res.status(200).json({message: "Item deleted successfully"});
        }
    }catch(err){
        console.log("Internal server error", err);
    }
})



app.get("/logout", async(req, res)=>{
    res.clearCookie("token", {
        httpOnly: true,
    secure: true,
    sameSite: "None",
    });
    res.status(200).json({message: "Logout Succesfully"})
})



app.get("/me", verifyToken, async(req, res)=>{

    try{
        const user = await UserModel.findById(req.user.user_id);

        if(!user){
            console.log("No user found");
            return res.status(400).json({errorMessage: "No user found"});
        };

        // console.log("user", user);
        res.status(200).json({fullName: user.fullName, email: user.email});
    }catch(err){
        console.log("internal server error", err);
        res.status(500).json({errorMessage: "Internal server error"});

    }
});



app.get("/showItems", verifyToken, async(req, res)=>{
    try{
        const items = await ItemModel.find({user_id: req.user.user_id});
        if(items){
            return res.status(200).json({items});
        };
        res.status(400).json({errorMessage: "Something goes wrong showing items"})
    }catch(err){
        console.log("Internal server error");
        res.status(500).json({errorMessage: "Internal server error on Showing items"});
    }
})



app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})