const bcrypt = require("bcryptjs");
const User = require("./user-schema");
const jwt = require("jsonwebtoken");
var auth=function(app)
{
    this.app=app
}
module.exports=auth

auth.prototype.login=async function(req,res){
    const {
        email,
        password
    } = req.body;
    //Check User is exists or Not
    let user = await User.findOne({
        email
    });
    if(user===null)
    {
        res.json({status:false,msg:"User Not Exist"})
    }
    const passwordMatch=await bcrypt.compare(password,user.password)
    if(!passwordMatch)
    {
        res.json({status:false,msg:"Incorrect Password"})
    }
    const payload={
        user:{
            id:user.id
        }
    };
    var option={
        expiresIn: 36000
    }
    jwt.sign(payload,'randomString',option,function(err,token){
        if(err)
        {
            res.json({status:false})
        }
        else{
            res.json({status:true,token:token})
        }
    })  
}

auth.prototype.register=async function(req,res)
{
    const {
        user_name,
        email,
        password
    } = req.body;
    try {
        let user=await User.findOne({
            email
        })
       
        if(user)
        {
            res.json({status:false,message:"User Already exists"})
        }
        user = new User({
            user_name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload,'randomString',{expiresIn:10000},function(err,token){
            if(err) throw err
            res.json({status:true,token:token})
        })
    } catch (error) {
        console.log(error)
        res.status(500).send("Error in Saving");
    }
  
}
