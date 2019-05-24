const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){
        // find a user and establish the identity
        User.findOne({email: email}, function(err, user)  {
            if (err){
                console.log('Error in finding user --> Passport');
                return done(err);
            }

            if (!user || user.password != password){
                console.log('Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }


));


// serializing the user to decide which key is to be kept in the cookies
//when the user signs in we find the id set it into cookie and send it to browser
//tells that you need to keep only user-id into the cookie nothing else
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
//browser makes a request we deserialize it and find the user
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});


//sending user data to the views

//check if the user is authenticated
//i will be using this function as a middleware
passport.checkAuthentication = function(req,res,next){
    //if the user is signed in,then pass on the request to the next function (controller's action) 
    if(req.isAuthenticated()){
        //let the user view the page
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in')
}
    
//set the user for the views
//middleware to check whether the user is signed in or not
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //whenever a user signs in his info is available in req.user
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user =  req.user;
    }
    next();
}

module.exports = passport;