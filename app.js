const express=require('express');
const dotenv= require('dotenv');
const connectDB=require('./config/db')
const morgan=require('morgan')
const mongoose=require('mongoose')
const exphbs=require('express-handlebars')
const methodOverride=require('method-override')
const path=require('path')
const passport = require('passport')
const session=require('express-session');
const MongoStore=require('connect-mongo')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')



dotenv.config({path: './config/config.env'})

require('./config/passport')(passport)

connectDB();

const app=express();

//bodyparser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//method parser
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))


//middleware
if(process.env.NODE_ENV==='devlopment'){
    app.use(morgan('dev'))
}

const {formatDate,stripTags,truncate,editIcon}=require('./helpers/hbs');
const { nextTick } = require('process');

//handlebars
app.engine('.hbs', exphbs.engine({helpers:{
    formatDate,
    stripTags,
    truncate,
    editIcon,
},
defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine','.hbs')


//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URI,
    collectinName: "sessions",
    stringify: false
    })
  }))


//static
app.use(express.static(path.join(__dirname,'public')))


//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//global variable
app.use(function(req,res,next){
    res.locals.user=req.user||null
    next()
})

//routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT} in ${process.env.NODE_ENV}`)
})

 