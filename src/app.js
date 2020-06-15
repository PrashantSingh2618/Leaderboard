const path = require('path');
const express = require('express');
const app = express() ;
const bodyParser = require('body-parser')
const Users = require('../models/users');
const Contest = require('../models/contest')

require('./db/mongoose');
 require('../models/users');


//Defining paths

const viewspath = path.join(__dirname,'../templates')

const urlencoderParser = bodyParser.urlencoded({extended:false});
//setting up all paths
app.set('view engine','ejs')
app.set('views',viewspath);

app.get('',async (req,res)=>{
  res.render('index',{
    message:'WELCOME TO HOME PAGE'
  });
})
app.get('/contestdetails',async(req,res)=>{
  res.render('contestdetails');
})
app.post('/contestdetails',urlencoderParser,async(req,res)=>{
  let problems=[]
  problems.push(req.body.p1);
  problems.push(req.body.p2);
  problems.push(req.body.p2);
  const newcontest = await new Contest({
    name:req.body.cname,
    problemsCount:req.body.pcount,
    problemName:problems
  })
  await newcontest.save().then(res=>{
  })
  .catch((err)=>{
    console.log(err);
  })
  res.render('success');
})

app.get('/usersubmission',async (req,res)=>{
  res.render('usersubmission');
})

app.post('/usersubmission',urlencoderParser,async(req,res)=>{

  let problemssolved=[];
  problemssolved.push(parseInt(req.body.p1));
  problemssolved.push(parseInt(req.body.p2));
  problemssolved.push(parseInt(req.body.p3));
    const newuser =await new Users({
      userName:req.body.fname,
      userHandle:req.body.handle,
      problemsSolved: problemssolved
    })
  await newuser.save().then(res=>{
    })
    .catch((err)=>{
      console.log(err);
    });
      let user = await Users.findOne({userHandle:req.body.handle});
      let marks=0;
      for(let i=0;i<user.problemsSolved.length;i++)
      marks=marks+parseInt(user.problemsSolved[i]);
      console.log(marks);

      await user.updateOne({totalmarks:marks});
      let users = await Users.findOne({userHandle:req.body.handle});

  res.render('success');

})


app.get('/leaderboard',async (req,res)=>{

  let list =await Users.aggregate([
    {
      $group: { _id: '$totalmarks', Users: { $push: {handle:"$userHandle",problem:"$problemsSolved"} } }
    }
  ])
  list = await list.sort(function (a, b) { return b._id - a._id; });
  const contest = await Contest.findOne({name:'NowOrNever'});
  console.log(list[0].Users[0].problem[0]);

  res.render('leaderboard',{list:list,contest:contest});

})



app.get('*',async (req,res)=>{
  res.render('errorpage',{
    message:"404 Not Found"
  })


})

app.listen(3000,()=>{
  console.log("Server is running");
})
