var OrderDetails = require('./order-schema')
var MongoClient = require('mongodb').MongoClient;
const User = require("./user-schema");
var Product = require('./product-schema');
var orderDetails = function(app) {
    this.app;
    this.API_URL = app.conf.settings.url
    this.mongoClient = new MongoClient()
}
module.exports = orderDetails

orderDetails.prototype.performActions = function(req, res) {
    var action = req.params.action
    const self = this
    if (action == 'create') {
        self.createOrder(req, res)
    } else if (action === 'list') {
        self.listOrder(req, res)
    } else if (action === 'update') {
        self.updateOrder(req, res)
    } else if (action === 'cancel') {
        self.cancelOrder(req, res)
    } else if (action === 'count') {
        self.orderedCount(req, res)
    } else {
        res.json({
            status: false,
            message: "Unauthorized Access"
        })
    }
}

orderDetails.prototype.createOrder = async function(req, res) {
    try {
        const self = this
        const user = await User.findById(req.user.id);
        const product = await Product.findOne({
            'product_id': req.body.product_id
        })

        req.body['customer_id'] = user._id
        req.body['customer_email'] = user.email;
        req.body['product_name'] = product.product_name
        req.body['product_price'] = product.price
        req.body['created_by'] = user.email

        var doc = await OrderDetails.create(req.body)
      
        res.json({
            status: true,
            result: doc._id
        })
    } catch (error) {
        res.json({
            status: false,
            id: id,
            message: "Something went wrong please try again"
        })

    }
}
orderDetails.prototype.listOrder = async function(req, res) {

    try {
        var doc = await OrderDetails.find(req.body)
        res.json({
            status: true,
            result: doc
        })
    } catch (err) {
        res.json({
            status: false,
            result: err
        })
    }
}
orderDetails.prototype.updateOrder = async function(req, res) {
    try {
        var doc = await OrderDetails.findByIdAndUpdate(req.body._id, req.body, {
            new: true
        })
        res.json({
            status: true,
            result: doc,
            message: "Order Updated Succesfully"
        })
    } catch (err) {
        res.json({
            status: false,
            result: err
        })
    }
}
orderDetails.prototype.cancelOrder = function(req, res) {
    const self = this;
    OrderDetails.findByIdAndDelete(req.body._id, {}, function(err, doc) {
        if (!err) {
            res.json({
                status: true,
                message: "Order canceled Successfully"
            })
        } else {
            res.json({
                status: false,
                message: "Error In Order cancel"
            })
        }

    })


}
orderDetails.prototype.orderedCount = async function(req, res) {
    try {
        var query = [{
            $group: {
                _id: {
                    customer_email: "$customer_email"
                },
                products_ordered: {
                    $push: "$product_name"
                }
            }
        }]
        var doc = await OrderDetails.aggregate(query)
        var resultObj = []
        for (var i = 0; i < doc.length; i++) {
            resultObj.push({
                customer: doc[i]._id.customer_email,
                No_of_products_ordered: doc[i].products_ordered.length
            })
        }
        res.json({
            status: true,
            result: resultObj
        })
    } catch (error) {
        res.json({
            status: false,
            result: JSON.stringify(err)
        })

    }

}

orderDetails.prototype.productCount = async function(req, res) {

    try {
        var sort = ''
        if(req.query)
        {
          sort=req.query.sort==="asc"?1:-1
           var query = [
            {
                $group: {
                    _id: {
                        product: "$product_name",
                    },
                    customers: {
                        $push: "$customer_email"
                    }
                },
            },
            {
                $sort: {
                    "product_name": sort
                }
            },
            
           ]

           OrderDetails.aggregate(query,function(err,resp){
                    res.json({
                      status: true,
                     result: resp
                     })
           })
           
      }
      else{
        var query = [
          {
              $group: {
                  _id: {
                      product: "$product_name",
                  },
                  customers: {
                      $push: "$customer_email"
                  }
              },
          }
      ]
      var doc = await OrderDetails.aggregate(query)
      res.json({
          status: true,
          result: doc
      })
      }
    } catch (error) {
        res.json({
            status: false,
            result: JSON.stringify(err)
        })

    }

}
orderDetails.prototype.dateCount = async function(req, res) {
    try {
        var query = [{
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d %H:%M:%S",
                            date: "$ordered_date"
                        }
                    },
                    product: {
                        $push: "$product_name"
                    }
                },
            },

        ]
        var doc = await OrderDetails.aggregate(query)
        var JSONObj = []
        for (var i = 0; i < doc.length; i++) {
            JSONObj.push({
                date: doc[i]._id,
                No_of_products_ordered: doc[i].product.length
            })
        }
        res.json({
            status: true,
            result: JSONObj
        })
    } catch (error) {
        res.json({
            status: false,
            result: JSON.stringify(err)
        })
    }

}