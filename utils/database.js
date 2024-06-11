const mongoose = require('mongoose')

try{
  mongoose.connect('mongodb://localhost:27017/CDA_SERVER_TRAINING')
  console.log("database connect")
}catch(error){
  console.log(error)
}