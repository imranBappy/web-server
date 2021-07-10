const Club = require("../models/Club")
const User = require("../models/User")

exports.clubPortController = async (req, res, next) =>{
    try {
        const checkClub = await Club.find({clubId: req.body.clubId})
        if (checkClub.length) {
            return res.json({
                message: 'Club Id Invalid',
                error: true
            })
        }

        const checkUser = await User.find({username: req.body.clubHolder})
        if (!checkUser.length) {
            return res.json({
                message: 'Username Invalid',
                error: true
            })
        }

        const newClub =  new Club(req.body);
        await newClub.save();
        res.json({
            message: 'Club Created Successfully',
            error: false
        })
    } catch (error) {
        next(error)
    }
}
exports.clubGetController = async (req, res, next) =>{
    const page = req.query.page || 0;
    try {
        const clubLength = await Club.find({});
        const club = await Club.find({}).skip(5* Number(page)).limit(5).select({
                __v:0,
                createdAt:0,
            })
        res.json({
            club,
            length: clubLength.length
        })
    } catch (error) {
        next(error)
    }
}
exports.rankingClubGetController = async (req, res, next) =>{
    try {
        const club = await Club.find({}).select({
            __v:0,
            createdAt:0,
            updatedAt:0,
            clubHolder:0,
            user: 0,
        })
        res.json({
            club
        })
    } catch (error) {
        next(error)
    }
}