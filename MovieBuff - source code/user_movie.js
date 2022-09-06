module.exports = (function () {
    var express = require("express");
    var router = express.Router();
  
    function getWishList(res, mysql, context, complete, id) {
        console.log(res);
      // var sql = "SELECT movie_title, score, explanation, ratingID From Rating_Entry Inner Join Movie on Rating_Entry.movie_id=Movie.movie_id WHERE account_ID = ?";
      var sql =
        "SELECT Movie.movie_title FROM User_Movie_Detail JOIN Movie ON Movie.movie_id = User_Movie_Detail.movie_id AND User_Movie_Detail.user_id = ? and User_Movie_Detail.in_wishList=1";
      var inserts = [id];
      mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
  
        context.wishlist = results;
        complete();
      });
    }

    function getWatchList(res, mysql, context, complete, id) {
        // var sql = "SELECT movie_title, score, explanation, ratingID From Rating_Entry Inner Join Movie on Rating_Entry.movie_id=Movie.movie_id WHERE account_ID = ?";
        var sql =
          "SELECT Movie.movie_title FROM User_Movie_Detail JOIN Movie ON Movie.movie_id = User_Movie_Detail.movie_id AND User_Movie_Detail.user_id = ? and User_Movie_Detail.is_watched=1";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
          if (error) {
            res.write(JSON.stringify(error));
            res.end();
          }
    
          context.watchlist = results;
          complete();
        });
      }
  
    function getUsername(res, mysql, context, complete, id) {
      var sql = "SELECT username From Users Where user_id = ?";
      var inserts = [id];
      mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.username = results[0];
        // if (results[0].company == null){
        //     console.log("IS MEMBER");
        //     context.status = "Member";
        // }
        // else{
        //     console.log("IS Critics");
        //     context.status = "Critic";
        // }
  
        complete();
      });
    }
  
    router.get("/", function (req, res) {
      currAccount = req.session.username;
    
      console.log("user_movie: " + req.session.loggedin);
  
      if (req.session.loggedin != true) {
        return res.redirect("/login");
      } else {
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get("mysql");
        getUsername(res, mysql, context, complete, currAccount);
        getWishList(res, mysql, context, complete, currAccount);
        getWatchList(res, mysql, context, complete, currAccount);
        function complete() {
          callbackCount++;
          if (callbackCount >= 3) {
            console.log(context.username);
            return res.render("user_movie", context);
          }
        }
      }
    });
  
    return router;
  })();