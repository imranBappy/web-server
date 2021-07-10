const express = require('express');
const mongoose = require('mongoose');
const setMiddleware = require('./middlewares/middlewares');
const setRoutes = require('./routes/routes');
require('dotenv').config();
const app = express();

// setMiddleware
setMiddleware(app);
app.use((req,res,next)=>{
 console.log(`method = ${req.method}
link = ${req.headers.referer}
origin = ${req.headers.origin}/${req.url}
`);
    next()
})
// setRoute

setRoutes(app);
mongoose.set('useFindAndModify', false);

app.use((req,res,next)=>{
    console.log(`method = ${req.method}
    link = ${req.headers.referer}
    origin = ${req.headers.origin}/${req.url}
    `);
    const error = new Error('404 Page Not Found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    console.log(error)
    switch (error.status) {
        case 404:
            return res.json({
                message: 'Page Not Found',
                error:true
            })
        case 401:
            return res.json({
                message: 'User Unauthorized',
                error:true
            })
        default:
            return res.json({
                message: 'Server side error',
                error:true
            });
    }
});




const port = process.env.PORT || 4000
const mongoURI = process.env.MONGODB_URI || `mongodb://localhost:27017/bdGames`;

app.listen(port,()=>{
    mongoose.connect(mongoURI,{useNewUrlParser:true, useUnifiedTopology:true}, ()=>{
        console.log(`Database is connected`);
        console.log(`http://localhost:${port}`);
    })
})