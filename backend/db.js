const mongoose= require('mongoose');
const mongoURI="mongodb+srv://12113145:3weVIoCoe9wNh1rn@cluster0.k3zepna.mongodb.net/?retryWrites=true&w=majority";
const connectToMongo=()=>{
    console.log("entered here");
    mongoose.connect(mongoURI,{
        useNewUrlParser:true,
    }).then(con =>{
        console.log('Db connection successful');
    }).catch(err=> console.log(err.message));
};
module.exports=connectToMongo;