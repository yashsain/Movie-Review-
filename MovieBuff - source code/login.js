module.exports = function(){ 
    var express = require('express');
    var router = express.Router();
    
    function validate(req, res, mysql, username, password){
        var sql = "SELECT * From Users";
        var accounts;

        var i;

        var found = 0;
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log("Results: ",results);
            for (i=0; i < results.length ; i++){
                if (username == results[i].username){
                    if (password == results[i].password){
                        found = 1;
                        req.session.loggedin = true;
                        req.session.username = results[i].user_id;
                        
                        break;
                    }
                }
                
            }
            if (found == 1){
                res.redirect('profile');
            }
            else{
                res.render("login");
            } 
        });


        
    }

    router.get('/', function(req, res){
        currAccount = req.app.locals.currAccount;
        if (req.session.loggedin == true){
            res.redirect("profile")
            console.log('user already logged in');
        }
        else{
            var context = {};
            var mysql = req.app.get('mysql');
            console.log('user not logged in');
            res.render("login");
        }
    });

    router.post('/', function(req, res){

        var mysql = req.app.get('mysql');

        var username = req.body.username;
        var password = req.body.password;
        
        validate(req,res,mysql, username, password);
        
    });

    return router;
}();
