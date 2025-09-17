const mongoose=require('mongoose')

const connectToDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDb Connected Successfuly`);
    }catch(e){
        console.log(`MongoDb connection failed: ${e}`);
        process.exit(1);
    }
}

module.exports=connectToDB;