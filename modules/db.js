
const mongoose = require("mongoose");

// Replace this with your MONGOURI.
// const url = "mongodb+srv://User_1:52vFDZKOHlSubQga@clustername.mongodb.net/Users?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";
var InitiateMongoServer =function(app){
    this.app=app  
    this.API_URL=app.conf.settings.url
    this.init()
};

module.exports = InitiateMongoServer;

InitiateMongoServer.prototype.init= async function()
{
  const self=this
    try {
        await mongoose.connect(self.API_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log("Connected to DB !!");
      } catch (e) {
        console.log(e);
        throw e;
      }
}