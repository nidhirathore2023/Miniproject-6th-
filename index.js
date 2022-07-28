const mysql=require("mysql");
const express=require("express");
const ejs=require("ejs");
const bodyparser=require("body-parser");
const upload=require("express-fileupload");
const Vonage = require('@vonage/server-sdk');
  


const vonage = new Vonage({
  apiKey: "a5f53058",
  apiSecret: "bNEjtNv4FIcxsCV0"
})

const encoder=bodyparser.urlencoded();
const app=express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
//var io=require('socket.io')(app);

app.use(upload());
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
app.use('/images',express.static('images'));


const connection=mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"nidhi",
    database:"labour_system"
});

connection.connect(function(error){
    if(error) throw error
    else console.log("connected");
})



app.get('/Employer_Registration',function(req,res){
    res.render('Employer_Registration');
});

var worker_user;
var employer_user;
app.post('/Employer_Registration',encoder,function(req,res)
{
    console.log(req.body.name);
    var name=req.body.name;
    var address=req.body.address;
    var email=req.body.email;
    var phone_no=req.body.phone_no
    var p1=req.body.password1;
    var p2=req.body.password2;
    if(p1===p2)
    {
        let sql="insert into employer (Name,Address,email,phone_no,password) values(?,?,?,?,?)";
        let query=connection.query(sql,[name,address,email,phone_no,p1],(error,rows)=>{
        if(error) throw error;
        console.log("inserted");
        res.redirect('/Employer_Login');
    });
    }
    else{
        console.log("Passwords are not same");
        res.redirect('/Employer_Registration');
    }
    
});


var cur_user;
var address;
var phone_no;
app.get('/Employer_Login',function(req,res){
    res.render('Employer_Login');
});

app.get('/Logout',function(req,res){
    res.render('Logout');
});

app.get('/Home',function(req,res){
    res.render('Home');
});

app.post('/Employer_Login',encoder,function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    connection.query('SELECT * FROM employer WHERE email= ? and password = ?',[email,password],function(error,results,field){
        if(results.length>0){
            res.redirect('/Home');
            cur_user=results[0].email;
            phone_no=results[0].phone_no;
            address=results[0].Address;
            //console.log(address);
            employer_user=results[0].Name;
            //console.log(employer_user);
        }
        else
        {
            res.redirect('/Employer_Registration');
        }
        res.end();
    })
});
app.get('/Worker_Login',function(req,res){
    res.render('Worker_Login');
});

app.post('/Worker_Login',encoder,function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    connection.query('SELECT * FROM worker WHERE email= ? and password = ?',[email,password],function(error,results,field){
        if(results.length>0){
            
            res.redirect('/Home2');
            cur_user=results[0].email;
            phone_no=results[0].phone_no;
            address=results[0].Address;
            //console.log(address);
            worker_user=results[0].Name;
            //console.log(worker_user);
        }
        else
        {
            //console.log("in");
            res.redirect('/Worker_Registration');
        }
        res.end();
    })
});

app.get('/Worker_Registration',function(req,res){
    res.render('Worker_Registration');
});

app.get('/Chat',function(req,res){
    res.render('Chat');
});

app.post('/Worker_Registration',encoder,function(req,res)
{
    console.log(req.body.name);
    var name=req.body.name;
    var address=req.body.address;
    var email=req.body.email;
    var phone_no=req.body.phone_no
    var p1=req.body.password1;
    var p2=req.body.password2;
    if(p1===p2)
    {
        let sql="insert into worker (Name,Address,email,phone_no,password) values(?,?,?,?,?)";
        let query=connection.query(sql,[name,address,email,phone_no,p1],(error,rows)=>{
        if(error) throw error;
        console.log("inserted");
        res.redirect('/Worker_Login');
    });
    }
    else{
        console.log("Passwords are not same");
        res.redirect('/Worker_Registration');
    }
    
});

app.get('/Home2',function(req,res){
    res.render('Home2');
});

app.get('/Post2',function(req,res){
    let sql="select * from login_comment";
    let query=connection.query(sql,(error,rows)=>{
        if(error) throw error;
        console.log(rows);
        res.render('Post2',{
         data:rows
        });  
        
     })
});



app.get('/Explore',function(req,res){
    res.render('Explore');
});

app.get('/Schemes',function(req,res){
    res.render('Schemes');
});

app.get('/My_Profile',function(req,res){
    let sql="select * from employer where email=?  ";
    let query=connection.query(sql,[cur_user],(error,rows)=>{
        if(error) throw error;
        console.log(rows);
        res.render('My_Profile',{
         data:rows
        });  
        
     })
});
app.get('/My_Profile2',function(req,res){
    let sql="select * from worker where email=?  ";
    let query=connection.query(sql,[cur_user],(error,rows)=>{
        if(error) throw error;
        console.log(rows);
        res.render('My_Profile',{
         data:rows
        });  
        
     })
});



app.get('/Employer_Registration',function(req,res){
    res.render('Employer_Registration');
});




app.get('/Records',encoder,function(req,res){
         var phone_no =req.query.phone_no
         var location = req.query.location
         var skills = req.query.skills
        // console.log(location)
  //  console.log(location);
    let sql="select count(Name)as number, Address from worker where Address=? and skills=? group by Address ";
         let query=connection.query(sql,[location,skills],(error,rows)=>{
         if(error) throw error;
         //console.log(rows);
         res.render('Records',{
          data:rows,
          temp:skills
         });  
         
      })
  })

app.get('/Search',function(req,res){
    res.render('Search');
});



app.get('/Post',function(req,res){
    let sql="select * from login_comment";
    let query=connection.query(sql,(error,rows)=>{
        if(error) throw error;
        console.log(rows);
        res.render('Post',{
         data:rows
        });  
        
     })
});


app.get('/Post-res',encoder,function(req,res){
       var comment=req.query.post_content;
    var sql="insert into  login_comment(email,comment) values(?,?)";
    var query=connection.query(sql,[cur_user,comment],(error,rows)=>{
        if(error) throw error;
        console.log("inserted");
        res.redirect('/Post');
    });

    

});
app.get('/Successfully_Send',function(req,res){
    var skills=req.query.skills;
    var location=req.query.location;
    var number_worker=req.query.number_workers;
    var minimum_wage=req.query.Minimum_wage;
    var date=new Date();

    var msg=cur_user+" is looking for "+skills+" workers.\nMinumum wage offered is "+minimum_wage+ " \nContact _Info:-\nAddress - "+address +"\nPhone Number  " + phone_no
    const from = "Vonage APIs"
    const to = "919027908651"
    const text = msg 
    console.log(msg);
   vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log(responseData);
                let sql="insert into successfull_request(Location,minimum_wage,Numberworker,date,email) values(?,?,?,?,?)";
        let query=connection.query(sql,[location,minimum_wage,number_worker,date,cur_user],(error,rows)=>{
        if(error) throw error;
        console.log("inserted");
        res.redirect('/Explore');
        });
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })

   // console.log(skills)
   // console.log(location)
   /* */
});


app.get('/history',function(req,res){

    let sql="select Location,minimum_wage,Numberworker,date from  successfull_request where email=? ";
         let query=connection.query(sql,[cur_user],(error,rows)=>{
         if(error) throw error;
         //console.log(rows);
         res.render('Successfully_Send',{
          data:rows,
         });  
         // console.log(cur_user)
});
});



server.listen(3000,()=>console.log("running"));
io.on('connection', function(socket){
    //console.log('a user connected');
    socket.on('joined', function(data) {
        //console.log(data);
    });

    socket.on('chat message', function(msg){
        //console.log('message: ' + msg);
       // socket.emit('response message', msg + '  from server');
        socket.broadcast.emit('response message', msg );
    });
   
});
