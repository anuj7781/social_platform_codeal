const Post = require('../models/post');

module.exports.home = function(req, res){
    // Post.find({},function(err,posts){
    //     if(err){console.log('err in fetching the posts');return;}
    //     return res.render('home', {
    //         title: "Codeal | Home",
    //         posts:posts
    //     });
    // })
    //finding all the post and populating user of each post
    Post.find({}).populate('user').exec(function(err,posts){
        if(err){console.log('err in fetching the posts');return;}
            return res.render('home', {
                title: "Codeal | Home",
                posts:posts
            });
    });      
    
}

// module.exports.actionName = function(req, res){}