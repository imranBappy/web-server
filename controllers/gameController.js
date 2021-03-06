const Game = require("../models/Game")

exports.gamePostController = async (req, res, next) =>{
    try {
        const game = new Game(req.body);
        const newGame = await game.save();
        res.json({
            message: 'Game successfully created!',
            data: newGame
        })
    } catch (error) {
        next(error)
    }
}
// query
exports.gameGetController = async (req, res, next) =>{
    const page = req.query.page || 0;
    try {
        const gameLength = await Game.find({})
        const game = await Game.find({}).skip(5 * Number(page)).limit(5).select({
            __v:0,
            createdAt:0,
            updatedAt:0
        });
        res.json({
            data: game,
            length: gameLength.length
        });
    } catch (error) {
        next(error)
    }
}
exports.allGameLoadGetController = async (req, res, next) =>{
    try {
        const game = await Game.find({isActive: true}).populate({
            path:'bets',
            select: 'title show',
            populate:{
                path:'question',
                select:'question rate show',
            }
        }).select({
            createdAt:0,
            updatedAt: 0,
            __v: 0
        })
        res.json({game})
    } catch (error) {
        next(error)
    }
}

exports.gameUpdateController = async (req, res, next) =>{
    try {
        const updatedGame = await Game.findByIdAndUpdate(req.body._id,{
            name: req.body.name,
            status: req.body.status,
            isActive: req.body.isActive
        },{ returnOriginal: false },).select({
            __v:0,
            createdAt:0,
            updatedAt:0
        })
        res.json({
            message: 'Game Updated successful',
            error: false,
            result: updatedGame
        })
    } catch (error) {
        next(error)
    }
}
exports.gameAllDeleteController = async (req, res, next) =>{
    try {
        await Game.deleteMany({});
        res.json({
            message : 'Game deleted successfully!'
        })
        
    } catch (error) {
        next(error)
    }
}
