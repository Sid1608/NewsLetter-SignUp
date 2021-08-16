//jshint esversion: 6
const express=require("express");
const bodyParser=require("body-parser");
const request= require("request");
require('dotenv').config();
const https = require("https");

const app=express();
app.use(express.static("public"));//to serve static file
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res)
{
    const firstName=req.body.firstName;
    const lastName=req.body.lastName
    const Email=req.body.Email
    const data={
        members:[//members- an array of objects each representing an email address and the subscription status for a specific list.
            {
                email_address:Email,
                status:"subscribed",
                merge_field:{//object
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData=JSON.stringify(data);

    const url=process.env.API_URL;
    const apiKey=process.env.API_KEY;
    const options={
        /*options available in https.request module*/
        method:"POST", /*specify the type of request we want to make:get/post*/
        auth:"siddharth:"+apiKey //http authentication
    }
    /*In order to send data to server save request in some const and later use that const to send data over to mailchimp server*/
    const request=https.request(url,options,function(response){//posting data to external resource
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){//
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData)
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});


app.listen(3000,function(){
    console.log("Server is running on port 3000");
}); 


//--mail chimp has several servers running simultaneously when you signup you get randomly assigned to one of them
// list/audience ID-> help mail chimp identify the list you want to put you subscriber into.
