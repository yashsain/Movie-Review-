module.exports = function(){ 
    var express = require('express');
    var router = express.Router();
    
    function validate__noEmpty(req, res, mysql, error, context, complete){
        var username = req.body.username
        username = username.trim();
        var email_id = req.body.email_id
        email_id = email_id.trim();
        var password = req.body.password
        password = password.trim();
        var date_of_birth = req.body.date_of_birth;
        var phone_no = req.body.phone_no
        phone_no = phone_no.trim();
        var street = req.body.street
        street = street.trim();
        var city = req.body.city
        city = city.trim();
        var state = req.body.state
        state = state.trim();
        var country = req.body.country
        country = country.trim();
        var zipcode = req.body.zipcode
        zipcode = zipcode.trim();
        if (username == "" || email_id == "" || username == "" || password == "" ||  phone_no == "" || street == "" || city == "" || state == "" || country == "" || zipcode == ""){
            console.log("empty input");
            error.counter ++;
        }

        complete();
        
    }

    function validate__unique(req, res, mysql, e, context, complete){
        var username = req.body.username
        username = username.trim();
        var email_id = req.body.email_id
        email_id = email_id.trim();
        var password = req.body.password
        password = password.trim();
        var date_of_birth = req.body.date_of_birth;
        var phone_no = req.body.phone_no
        phone_no = phone_no.trim();
        

        var sql = "SELECT * From Users ";
        var accounts;
        var i;
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            for (i=0; i < results.length ; i++){
                if (username == results[i].username){
                    console.log("username already taken");
                    context.error.push({msg:"**USERNAME already taken**"});
                    e.counter ++;
                }
                if (email_id == results[i].email_id){
                    console.log("**EMAIL already taken**");
                    context.error.push({msg:"**EMAIL already taken**"});
                    e.counter ++;
                }
                if (phone_no == results[i].phone_no){
                    console.log("**Phone No. already taken**");
                    context.error.push({msg:"**Phone No. already taken**"});
                    e.counter ++;
                }
            }

            complete();
        }); 

        
    }

    function validate__complete(req, res, mysql, error, context, complete){
        var username = req.body.username
        username = username.trim();
        var email_id = req.body.email_id
        email_id = email_id.trim();
        var password = req.body.password
        password = password.trim();
        var date_of_birth = req.body.date_of_birth;
        var phone_no = req.body.phone_no
        phone_no = phone_no.trim();
        var street = req.body.street
        street = street.trim();
        var city = req.body.city
        city = city.trim();
        var state = req.body.state
        state = state.trim();
        var country = req.body.country
        country = country.trim();
        var zipcode = req.body.zipcode
        zipcode = zipcode.trim();
                if (error.counter > 0){
                    console.log("found error: " + error.counter);
                    return res.render('signup', context);
                }     
                else{
                    var sql = "CALL createAccount (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    var inserts = [username, email_id, password, date_of_birth, phone_no, street, city, state, country, zipcode];
                    sql = mysql.pool.query(sql,inserts, function(error, results, fields){
                        if(error){
                            console.log("*****ERROR in creating account******")
                            console.log(JSON.stringify(error))
                            res.write(JSON.stringify(error));
                            res.end();
                        }
                        else{
                            res.redirect('/login');
                        }
                    });
                }
    }

    router.get('/', function(req, res){
        currAccount = req.session.username
        if (req.session.loggedin == true){
            res.redirect("profile")
        }
        else{
            var mysql = req.app.get('mysql');
            res.render('signup');
        }
        
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');

        var error = {counter:0};

        var callbackCount = 0;
        var context = {};
        context.error = [];
        validate__noEmpty(req,res,mysql, error , context, complete);
        validate__unique(req, res, mysql, error , context, complete);


        function complete(){
            callbackCount++;
            if (callbackCount >= 2){
                validate__complete(req, res, mysql, error , context, complete);
            }
            
        }

    });

    return router;
}();








