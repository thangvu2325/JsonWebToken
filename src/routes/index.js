const newRouter = require('./news')
const siteRouter = require('./site')
const authRouter = require('./auth')
const userRouter = require('./user')
const apiRouter = require('./api')
function route(app){
    app.use('/news',newRouter);
    app.use('/',siteRouter)
    app.use('/auth',authRouter);
    app.use('/user', userRouter)
    app.use('/api',apiRouter);
}
module.exports = route;