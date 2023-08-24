require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('express-flash')
const MongoStore = require('connect-mongo')
const expressLayout = require('express-ejs-layouts')
const Emitter = require('events')
const passport = require('passport')
const PORT = process.env.PORT || 5000


// Database Connection

const url = process.env.MONGO_URL;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open', function () {
    console.log('Connection established')
}).on('error', function (err) {
    console.log('connection failed')
})



// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


//Session Config to store data in sessions
app.use(session({
    secret: process.env.COOKIE_SECRET_KEY,
    resave: false,
    store: MongoStore.create({ mongoUrl: url }),
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 24 //cookie expires after one day
    }
}))

app.use(flash())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// passport config
app.use(passport.initialize())
app.use(passport.session())
const passportInit = require('./app/config/passport')
passportInit(passport);

// Global Middleware (For session to work in frontend)
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})

const staticPath = path.join(__dirname, './public');
const template_path = path.join(__dirname, './resources/views')
// app.use(express.static('public'))

//set template engine
app.use(expressLayout)

app.use(express.static(staticPath))
app.set('view engine', 'ejs');
app.set('views', template_path)


require('./routes/web')(app);


const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

//socket

const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
    // join
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })

});

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data);
})
