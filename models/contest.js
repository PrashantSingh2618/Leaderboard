const mongoose =  require('mongoose')
const {Schema} = mongoose
const contest = new mongoose.Schema({
  name:{
    type:String
  },
  problemsCount:{
    type:Number
  },
  problemName:{
    type:[]
  }

})
const Contest = mongoose.model('Contest',contest)

module.exports = Contest ;
