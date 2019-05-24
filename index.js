const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
//setup mongostore
const MongoStore = require('connect-mongo')(session);//requires session argument because you need to store the session information in the database

app.use(express.urlencoded());


app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db

app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,//whenever there is a request which is not initialized,which means a session that is not initialized,which further means that the user has not logged in do i want to store extra data in the cookie? 
    resave: false,//when identity is established or some sort of data is present in session cookie(session data),do i want to rewrite even if has not changed?
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:new MongoStore({
            mongooseConnection:db,
            autoRemove:'disabled'
    },
    //callback function incase connnection is not established
    function(err){
        console.log(err || 'connect-mongodb setup okay');
    } 
    )
    
}));

app.use(passport.initialize());
app.use(passport.session());

//whenever a request comes this middleware will be called and user will be set in the locals and hence accesible in our views
app.use(passport.setAuthenticatedUser);


// use express router
app.use('/', require('./routes'));


app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server : ${err}`);
        return;
    }
    console.log(`Server is running on port ${port}`);
});



