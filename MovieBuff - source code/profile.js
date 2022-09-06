module.exports = (function () {
  var express = require("express");
  var router = express.Router();

  function getRatingEntries(res, mysql, context, complete, id) {
    // var sql = "SELECT movie_title, score, explanation, ratingID From Rating_Entry Inner Join Movie on Rating_Entry.movie_id=Movie.movie_id WHERE account_ID = ?";
    var sql =
      "SELECT Movie.movie_title,User_Movie_Review_Detail.rating_given,User_Movie_Review_Detail.review_given FROM User_Movie_Review_Detail JOIN Movie ON Movie.movie_id = User_Movie_Review_Detail.movie_id AND User_Movie_Review_Detail.user_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }

      context.rating_entry = results;
      complete();
    });
  }

//   function getRating(res, mysql, context, id) {
//     var sql =
//       "SELECT movie_title, score, explanation, ratingID From Rating_Entry Inner Join Movie on Rating_Entry.movie_id=Movie.movie_id Where ratingID = ?";
//     var inserts = [id];
//     mysql.pool.query(sql, inserts, function (error, results, fields) {
//       if (error) {
//         res.write(JSON.stringify(error));
//         res.end();
//       }
//       context.rating = results[0];
//       console.log("got rating: " + context.rating);
//       res.render("update_rating", context);
//     });
//   }

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

    console.log("profile: " + req.session.loggedin);

    if (req.session.loggedin != true) {
      res.redirect("/login");
    } else {
      var context = {};
      var callbackCount = 0;
      context.jsscripts = ["delete_rating.js", "updaterating.js"];
      var mysql = req.app.get("mysql");

      getUsername(res, mysql, context, complete, currAccount);
      getRatingEntries(res, mysql, context, complete, currAccount);
      function complete() {
        callbackCount++;
        if (callbackCount >= 2) {
          console.log(context.username);
          res.render("profile", context);
        }
      }
    }
  });

  return router;
})();
