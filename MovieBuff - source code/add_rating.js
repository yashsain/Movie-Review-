module.exports = function(){ 
    var express = require('express');
    var router = express.Router();
    

    // function addToWatchList() {
    //     console.log("hello i will add your movie to watch list");
    // }
    function getMovies(res, mysql, context){
        mysql.pool.query("SELECT movie_id as id, movie_title From Movie", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.movie = results;
            console.log(context);
            res.render('add_rating', context);
        });
    }

    function addRating(req,res,mysql,id){
        // console.log('-------------------------------------------------------------')
        // console.log(req.body,id);
        // console.log('--------------------------------------------------------------')
        var sql;
        var addToWatchedList = 0;
        var addToWishList = 0;
        if(req.body.addToWatchedList == 'true') {
            addToWatchedList = 1;
        } 
        if(req.body.addToWishList == 'true') {
            addToWishList = 1;
        }
        if (req.body.score == ""){
            req.body.score = null;
        }
        if (req.body.explanation == "")
        {
            req.body.explanation = null;
        }
        if (req.body.explanation == null || req.body.score == null)
        {
            var sql = "INSERT INTO User_Movie_Detail (user_id,movie_id,is_watched,in_wishlist) VALUES (?,?,?,?); ";
        // var sql = "INSERT INTO Rating_Entry (movie_id, account_ID, score, explanation) VALUES (?,?,?,?,?,?)";       
        var inserts = [id, req.body.id,addToWatchedList,addToWishList];
        console.log("inserts is: ",inserts);
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log("*****ERROR******")
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                return res.end();
            }else{
                if(error){
                    console.log("*****ERROR******")
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    return res.end();
                }
                else{
                    console.log("*****SUBMITTED RATING******")
                    return res.redirect('/profile');
                }
            }
        });
        }
        else {
        var sql = "CALL addRatings (?,?,?,?,?,?)";
        // var sql = "INSERT INTO Rating_Entry (movie_id, account_ID, score, explanation) VALUES (?,?,?,?,?,?)";       
        var inserts = [id, req.body.id,req.body.explanation,req.body.score,addToWatchedList,addToWishList];
        console.log("inserts is: ",inserts);
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log("*****ERROR******")
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                return res.end();
            }else{
                if(error){
                    console.log("*****ERROR******")
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    return res.end();
                }
                else{
                    console.log("*****SUBMITTED RATING******")
                    return res.redirect('/profile');
                }
            }
        });
    }
    }

    function checkValid(req,res,mysql, id){
        console.log('id is',id);
        var sql = "SELECT * FROM User_Movie_Detail WHERE user_id = ?";
        // var sql = "SELECT * From Rating_Entry Where account_ID=?";
        var inserts = [id];

        var context = {};
        context.error = [];
        var i = 0;
        var found = 0;
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            for (i = 0; i < results.length; i++){
                if (req.body.id == results[i].movie_id){
                    context.error.push({msg:"**You already have a rating entry for this movie**"});
                    found ++;
                }
            }

            if (req.body.score > 100 || req.body.score < 0){
                console.log("invalid score (0-100)");
                context.error.push({msg:"**Invalid Score. Must be 0-100**"});
                found ++;
                
            }
            if (found > 0){
                return getMovies(res, mysql, context);
            }
            else{
                return addRating(req,res,mysql,id);
            }
            

        });

        
        
        
    }

    router.get('/', function(req, res){
        currAccount = req.session.username;
        if (req.session.loggedin != true){
            return res.redirect('/login');
        }

        var context = {};
        var mysql = req.app.get('mysql');
        getMovies(res, mysql, context);
        
    });

    router.post('/', function(req, res){
        currAccount = req.session.username;
        if (req.session.loggedin != true){
            res.redirect('/login');
        }
        else{
            console.log(req.body)
            var mysql = req.app.get('mysql');

            return checkValid(req,res, mysql, currAccount);
                
        }
    });

    return router;
}();