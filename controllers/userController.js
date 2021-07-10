const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Club = require('../models/Club');

exports.registerPostController = async (req, res, next) =>{
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        req.body.password = hash;

        const username = await User.find({username: req.body.username})
        if (username.length !== 0 ) {
            return res.json({
                message:'Username all ready exist!',
                error: true,
                data:[]
            })
        };
        const sName = await User.find({username: req.body.sName.trim()})
            if (sName.length === 0 ) {
                req.body.sName = '60d8c7fa7c05af12ce47a178'
            }else{
                req.body.sName = sName[0]._id;
            }
        const user = new User({...req.body, active: true});
        const newUser = await user.save();
        await Club.findByIdAndUpdate(req.body.club,{
            $push:{'user': newUser._id}
        })
        res.json({
            message:'User register successfully!',
            error: false,
            data:[]
        })
    } catch (error) {
        next(error)
    }
}

exports.loginPostController = async (req, res, next)=>{
    const {username, password} = req.body
    try {
        const result = await User.find({username})
        .populate('club', 'name clubId')
        .populate('sName', 'name username')
        .select({
            __v:0,
            createdAt:0,
            updatedAt:0
        })
        const user = result[0];
        if (!result.length) return res.json({message:'User not found!', error: true})
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) return res.json({message:'Password is wrang', error: true});
        if (!user.active) return res.json({message:'You account is disabled !', error: true})
        const token = jwt.sign({_id:user._id}, process.env.SECRET,{expiresIn: '24h'})
        res.json({
            message:'User Login Successful! ',
            token: token,
            error:false,
            user: result
        })
    } catch (error) {
        next(error)
    }
}

exports.changePasswordPutController = async (req, res, next) =>{
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        await User.findOneAndUpdate({username: req.body.username},{$set:{password: hash}})
        res.json({
            message: 'Password Changed Successfully!'
        })
    } catch (error) {
        next('There was a server side error')
    }
}

exports.singleUserGetController = async (req, res, next) =>{
    const {userId} = req.params
    try {
        const user = await User.findById(userId)
        .populate('club', 'name clubId')
        .populate('sName', 'name username')
        .select({
            password: 0,
            __v:0,
            createdAt:0,
            updatedAt:0
        });

        res.json({
            data:[user]
        })
    } catch (error) {
        next(error)
    }
}



exports.allUserGetController = async (req, res, next) =>{
    const page = req.query.page || 0
    try {
        const arr =  await User.find({})
        const user = await User.find({})
            .populate('sName', 'username')
            .populate('club', 'clubId')
            .skip(5* Number(page)).limit(5)
            .select({
                password: 0,
                __v:0,
                createdAt:0,
                updatedAt:0
            })
        res.json({
            users: user,
            length: arr.length
        })
    } catch (error) {
        next(error)
    }
}
exports.userUpdateController = async (req, res, next) =>{
    try {
        const updateUser = await User.findByIdAndUpdate(req.body._id,{
            club: req.body.club,
            balance: req.body.balance,
            active: req.body.active
        },{new: true})
        .populate('sName', 'username')
        .populate('club', 'clubId')
        .select({createdAt:0, updatedAt:0, password: 0, __v:0});
        res.json({
            message: `${updateUser.name} ${updateUser.active? 'Active': 'Inactive'} Successfully!`,
            error: false,
            user: updateUser
        });
    } catch (error) {
        next(error)
    }
}