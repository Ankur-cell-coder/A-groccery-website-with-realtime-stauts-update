const Order = require('../../../models/order')

function statusController(){
    return {
       update(req, res){
          // console.log(req.body.orderId)
           Order.updateOne({_id: req.body.orderId},{ status: req.body.status}, (err,data) => {
            if(err){
             return   res.redirect('/admin/orders')
            }    
            // emit event
            const eventEmitter = req.app.get('eventEmitter')
            eventEmitter.emit('orderUpdated',{ id: req.body.orderId, status: req.body.status })
            //above we emit our status on event emitter now we can use it anywhere
           return res.redirect('/admin/orders')
           }) 
       }


    }
}

module.exports = statusController