const order = require('../../../models/order')


function orderController() { //this function return an object
    return {
        index(req, res) {
            // console.log('Ankur')
            //$ne means not equal to
            order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password').exec((err, orders) => {
               
                if (req.xhr) {
                    return res.json(orders)
                }
                else {
                    return res.render('admin/orders')
                }
            })
        }
    }
}

module.exports = orderController