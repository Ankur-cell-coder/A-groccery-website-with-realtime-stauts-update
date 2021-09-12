

//it represent table inside our databse
//whatever its name here tey must be in singular and its plural is in databse

const mongoose = require('mongoose')
const Schema = mongoose.Schema //this either be a class or constructor function

//we call this in a diff way like this:
//this table consist of how our database table looks like
//id is provide by databse automatically that so we not add that here
const orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   items: {   //this comes from databse session
       type: Object,
       required:true
   },
   phone: {
       type: String,
       required: true
   },
   address :{
       type: String,
       required: true
   },
   paymentType: {
       type: String,
      default: 'COD'
   },
   status :{
       type: String,
       default: 'Order placed'
   },

},{ timestamps: true })  //this whole schema got stored inside menuSchema

//explain in notes
const Menu = mongoose.model('Order',orderSchema)
//finally we have to export this modules
//so that inside controllers this should be imported and we can run our databse query

module.exports = Menu
