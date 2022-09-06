module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function searchword(req, res, mysql, context,input){
        console.log("post: " + req.body.searchInput);
        var sql = "SELECT * FROM Movie WHERE movie_title LIKE '" + input + "%' ";
        var inserts = [req.body.searchInput];
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.movie = results;
            console.log(context.rating);
            res.render("movies", context);
        });
    }

    router.get('/', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        var input = "*";




        searchword(req, res, mysql, context,input);
    });



    router.post('/', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        var input = req.body.searchInput;




        searchword(req, res, mysql, context,input);
    });


    return router;
}();