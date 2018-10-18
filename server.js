//Import express module
var express = require('express');

//Intantiate the express module to app
var app=express();

//import body-parser to get data into req.body
var bodyParser=require('body-parser');

//import cookie parser to send cookies to server
var cookieParser=require('cookie-parser');

//import express session to hold state of user on server

var session=require('express-session');

//set the view engine to 'enterprise JavaScript=ejs'
app.set('view engine','ejs');

//set the directory of views available in same directory
app.set('views','./views');

//specify the path of static directory
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and put in req.body
app.use(bodyParser.json());

//use body parser to parse urlencoded and put in req.body,extended=true for 
app.use(bodyParser.urlencoded({ extended: true })); 

//to parse cookies
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'SignSessionCookie_013714779',
    resave: false,
    saveUninitialized: true
  }));

//Admin credentials in JSON
var Admin = {
    "username" : "admin",
    "password" : "admin"
};

//intitial student data to be displayed
var studentInfo=[{"studentId":"101","studentName":"Shubham","department":"MSSE"},
                {"studentId":"102","studentName":"Varun","department":"MSSE"},
                {"studentId":"103","studentName":"Alex","department":"MSCS"}];

//route request to root
app.get('/',(req,res)=> {
 if(req.session.user) {
     res.redirect('/dashboard');
 }else {
     err={};
    res.render('Login',{error:err});
 }
});

//router for Login request
app.get('/Login',(req,res)=> {
    if(req.session.user) {
        res.redirect('/AddStudent');
    }else {
        err={};
       res.render('Login',{error:err});
    }
   });



//login route to AddStudent on successfull authentication
app.post('/Login',(req,res)=>{
    if(req.session.user) {
        res.redirect('/dashboard');
    }else {
        var err={};
        console.log("Inside login post request for authentication");
        console.log(`Provided user credential are User name: ${req.body.username} and Password: ${req.body.password}.`);
        let cred=JSON.parse(JSON.stringify(Admin));
        
        if(cred.username===req.body.username && cred.password===req.body.password){
            req.session.user=Admin.username;
            res.redirect('/AddStudent');
        }
        else{
            
            err.error1="Invalid User Name or password";
            res.render('Login',{error:err});
            
        }
    }
});

//add student to JSON array post submission
app.post('/AddStudent',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        
        var newStudent = {studentId: req.body.studentId,studentName:req.body.studentName,department : req.body.department};
        studentInfo.push(newStudent);

        console.log(`New student with studentId : ${req.body.studentId} added successfully!` );
        res.redirect('/dashboard');
        
        
    }
});

//route handler for AddStudent.
app.get('/AddStudent', (req, res)=> {
        if(req.session.user) {
            console.log("In Add Student!");
            res.render('AddStudent');
            
        }else {
           res.redirect('/');
        }
    });

//Route handler for Dashboard.
 app.get('/dashboard', (req, res)=> {
        if(req.session.user) {
            console.log("Session Data "+JSON.stringify(req.session));
            res.render('dashboard',{studentinfo:studentInfo});
            console.log("Inside Dashboard");
        }else {
           res.redirect('/');
        }
    });

//route handler for delete
app.get('/delete',(req,res)=>{
    if(req.session.user){
        res.redirect("/dashboard");
    }
    else{
        res.redirect('/');
    }
});

//delete a particular student upon pressing the delete button
    app.post('/delete',(req,res)=>{
        console.log("Entered Delete");
        var loc = studentInfo.map(function(student){
            return student.studentId;
         }).indexOf(req.body.studId);


         studentInfo.splice(loc,1);
         console.log("Student with studnet id "+req.body.studId+" "+"successfully removed!");
         res.redirect("/dashboard");
    });

//Error handling for wrong requests via URL.
app.use(function(req, res, next) {
        res.status(404).send('Sorry cant find the requested page!');
      });


var server = app.listen(8080, function () {
    console.log("Server ready and listening on port 8080");
 
});

