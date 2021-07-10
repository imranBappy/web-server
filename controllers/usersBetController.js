const User = require('../models/User');
const UserBet = require('../models/UserBet');
const Result = require('../models/Result');
exports.betPostController = async (req, res, next) =>{
    // console.log(req.body);
    try {
        const user = await User.findById(req.user);
        if (!(user.balance >= req.body.amount)) return res.json({
            message: 'There is not enough balance',
            error: true
        });
        await Result.findByIdAndUpdate(req.body.result,{
            $push:{'user': user._id}
        }, {new: true});
        const bet = new UserBet({...req.body, user: user._id, win: false})
        await bet.save();
        await User.findByIdAndUpdate(user._id,{
            balance: user.balance - Number(req.body.amount),
        });
        res.json({
            message: 'Bet send successfully!', error: false
        })
    } catch (error) {
        next()
    }
};

exports.betGetController = async (req, res, next) =>{ 
    const page = req.query.page || 0;
    try {
        const betsLength = await UserBet.find({})
        const bet = await UserBet.find({})
        .populate('user', 'username')
        .populate('game', 'name country1 country2')
        .populate('bet', 'title')
        .populate('result', 'question rate status')
        .sort('-createdAt')
        .skip(5* Number(page)).limit(5)
        res.json({bet, length: betsLength.length});
    } catch (error) {
        next(error)   
    }
}
exports.userBetStatusUpdateController = async (req, res, next) =>{
    const {resultId, status} = req.query
    try {
        const result = await Result.findById(resultId).populate('user', 'balance');
        if (result.status === 'Win' || result.status === 'Loss')res.json({
            message: 'Bet al ready wined',
            error: true
        });
        const users = [...result.user]
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userBets = await UserBet.find({user: user._id, result: result._id});
            let userBalance = user.balance;
            for (let j = 0; j < userBets.length; j++) {
                userBalance += Number(userBets[j].amount) * Number(result.rate);
            };
            if (status === 'Win') {
                await User.findByIdAndUpdate(user._id,{
                    balance: userBalance
                })
            }
        };
        await Result.findByIdAndUpdate(result._id,{status});

        res.json({
            message: 'Bet Wined successfully!',
            error: false
        })
    } catch (error) {
        next(error)   
    }
}

exports.userBetGetController = async (req, res, next) =>{
    try {
        const page = req.query.page || 0 ;
        const userBetLength = await UserBet.find({user:req.user});
        const userBets = await UserBet.find({user:req.user})
            .populate('game', 'name country1 country2')
            .populate('bet', 'title')
            .populate('result', 'question rate status')
            .skip( 5 * Number(page))
            .sort('-createdAt')
            .select({
                __v:0,
                updatedAt:0
            });
        res.json({bet:userBets, length: userBetLength.length})
    } catch (error) {
        next(error)   
    }
}