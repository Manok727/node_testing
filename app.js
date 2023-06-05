var express = require('express');
var fs = require('fs')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var mysql = require('mysql');
var app = express();
//connection



var conn=mysql.createConnection({host:"pfft-sql.mysql.database.azure.com", user:"SomeRandomGuy05", password:"StrongPassword1", database:"pffttest_db", port:3306, ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}});


app.use(express.static('public'));
app.set('view engine', 'ejs');//set view engine to ejs

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24; // calculate one day


// express app should use sessions
app.use(sessions({
    secret: "thisismysecrctekeyfhgjkgfhkgfjlklkl",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.get('/index_login', function(req, res){
    res.render('index_login.ejs');
})




app.get('/signup', function (req, res){// get signup
    session=req.session;
    if(session.userid){
        res.render('signup.ejs', {
            userid: session.userid
        });
    } 
    else{
        res.render('signup.ejs', {
        });
    }

})

app.post('/signup',(req, res)=>{// post sign up

    var conn=mysql.createConnection({host:"pfft-sql.mysql.database.azure.com", 
    user:"SomeRandomGuy05", password:"StrongPassword1", database:"pffttest_db", 
    port:3306, ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}});

    var brukernavn = req.body.username;
    var passord = req.body.password;
    var fornavn = req.body.fornavn;
    var etternavn = req.body.etternavn;
    var tlf = req.body.tlf;
    var email = req.body.email;


    var sql = 'INSERT INTO brukere (brukernavn, passord, fornavn, etternavn, tlf, email) VALUES(?,?,?,?,?,?)';
    var values = [brukernavn, passord, fornavn, etternavn, tlf, email];

    conn.query(sql, values, (err,result) => {
        if (err){
            throw err;
        }
        console.log("ny bruker i database")

        res.render('index_login.ejs');
    });
});



var session;

app.get('/', function (req, res) { //session
    session=req.session;
    if(session.userid){
        res.render('home_user.ejs', { 
            userid: session.userid      
        });
 
    } 
    else {
        res.render('index_login.ejs', { });
    }
})

//app.get('/logout', function (req, res) {
//    req.session.destroy();
//    res.render('login.ejs', {     
//});



app.post('/index_login', function (req, res) { 
    // hent brukernavn og passord fra skjema på login
    var brukernavn = req.body.username;
    var passord = req.body.password;


    console.log (brukernavn, passord)
    // perform the MySQL query to check if the user exists
    

    var conn=mysql.createConnection({host:"pfft-sql.mysql.database.azure.com", user:"SomeRandomGuy05", password:"StrongPassword1", database:"pffttest_db", port:3306, ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}});
    var sql = 'SELECT * FROM brukere WHERE brukernavn = ? AND passord = ?';
    conn.query(sql, [brukernavn, passord], (error, result)=>{
        if(error){
            res.status(500).send('internal server error');
        } else if (result.length === 1){
            session = req.session;
            session.userid=req.body.username;
            res.redirect('/home_user');
        } else {
            res.redirect('/login?error=invalid');
        }
        
    })
})


app.get('/home_user', function (req, res) {
    session=req.session;
    if(session.userid){

        var sql = 'SELECT * FROM innlegg WHERE idinnlegg = ? AND text = ?';

        res.render('home_user', {
            userid: session.userid


        });
    }
    else {
        res.render('index_login.ejs',{
        });
    }
})


//server listen at port 8081
var server = app.listen(8081, function (){
    var host = server.address().address
    var port = server.address().port

    console.log("Example app is listening at http://%s:%s", host, port)
})



