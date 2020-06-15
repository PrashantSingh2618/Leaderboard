const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/Prashant',
  {
    useNewUrlParser:true,useCreateIndex: true, useUnifiedTopology: true
  }).then(()=>{
    console.log('mongodb is up and running');
  }).catch((error)=>{
    console.log(error);
  })

  module.exports = mongoose ;
