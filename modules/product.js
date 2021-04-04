var Product=require('./product-schema');
var XLSX = require("xlsx");
var async = require("async");
const { prototype } = require('bluebird');


var product=function(app)
{
    this.app=app

}
module.exports=product;

product.prototype.performActions=function(req,res){
  var action=req.params.action
  const self=this
  if(action==="upload")
  {  
    self.UploadProducts(req,res)

  }
  else if(action==='list'){
    self.listProducts(req,res)
  }
  else{
    res.json({status:false,message:"Requested Url Not found"})
  }
}




product.prototype.UploadProducts= async function(req,res)
{
    var data=''
    try {
      if(req.files)
      {
        var excelfile = req.files.file
        var wb = XLSX.read(excelfile.data, {
          type: 'buffer'
      });
       var ws = wb.Sheets["Sheet1"];
          data = XLSX.utils.sheet_to_json(ws);
      }
      if(data.length!=0)
      {
         async.mapSeries(data,async function(element,cbk){
             var product_id=element.product_id
             let products;
              products  = await Product.findOne({
               product_id
              })
               if(products)
               {
                 var reqObj={
                  product_id: element.product_id,
                  product_name: element.product_name,
                  price: element.price,
                  category: element.category,
                  desc:element.desc
                 }
                 Product.updateOne({_id:products._id},reqObj,{upsert:true},function(err,res){
                 })
               }
               else{
                  products= new Product({
                  product_id: element.product_id,
                  product_name: element.product_name,
                  price: element.price,
                  category: element.category,
                  desc:element.desc
                 })
                 await products.save()
               }  
          },function(err){

            res.json({status:true,message:"Sucessfully Imported"})
          })
      }
      else{
        res.json({status:false,message:"No Data Found"})
      }
    } catch (error) {
       console.log(error)
       res.json({status:false})
    } 
 
}
product.prototype.listProducts=function(req,res)
{
  Product.find(req.body,function(err,data){
   if(err){
     res.json({status:false,message:err})
   }
   else{
    res.json({status:true,result:data})
   }
  })
}