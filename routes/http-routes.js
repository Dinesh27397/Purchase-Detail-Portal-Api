var InitiateMongoServer= require('../modules/db');
var Auth=require('../modules/auth');
var Product=require('../modules/product');
const User = require("../modules/user-schema");
const jwt = require("jsonwebtoken");
const Order=require('../modules/order-details')

var Routes = function(app,router) {
    this.app = app;
    this.router = router;
    this.init()
    this.auth=new Auth
    this.connection=new InitiateMongoServer(app);
    this.product=new Product(app)
    this.order=new Order(app)
};

module.exports = Routes;

Routes.prototype.init=function()
{
    const self=this;
  
    var sessionCheck=function(req,res,next)
    {
        const token = req.header("token");
        if (!token) return res.status(401).json({ message: "Auth Error" });
        try {
          const decoded = jwt.verify(token, "randomString");
          req.user = decoded.user;
          next();
        } catch (e) {
          res.status(401).send({status:false, message: "Unauthorized Token" });
        }
    }
  

    
    self.app.post('/login',async function(req,res){
           self.auth.login(req,res)
    })
    self.app.post('/register',function(req,res){
          self.auth.register(req,res)
    })
    self.app.get('/user',sessionCheck,async function(req,res){
        const user = await User.findById(req.user.id);
        res.json(user);
    })
    self.app.post('/product/:action',sessionCheck,function(req,res){
        self.product.performActions(req,res)
    })
    self.app.post('/order/:action',sessionCheck,function(req,res){
        self.order.performActions(req,res)
    })
    self.app.get('/ordered/count',sessionCheck,function(req,res){
        self.order.orderedCount(req,res)
    })
    self.app.get('/ordered/product',sessionCheck,function(req,res){
        self.order.productCount(req,res)
    })
    self.app.get('/ordered/date/count',sessionCheck,function(req,res){
        self.order.dateCount(req,res)
    })
    self.app.use(self.router)
}