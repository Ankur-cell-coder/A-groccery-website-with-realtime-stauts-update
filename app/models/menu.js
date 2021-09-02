//it represent table inside our databse
//whatever its name here tey must be in singular and its plural is in databse

const mongoose = require('mongoose')
const Schema = mongoose.Schema //this either be a class or constructor function

//we call this in a diff way like this:
//this table consist of how our database table looks like
//id is provide by databse automatically that so we not add that here
const menuSchema = new Schema({
    name:{type: String, required:true},//this is also a class
    image:{type: String, required:true},
    price:{type: Number, required:true},
    size:{type: String, required:true},
})  //this whole schema got stored inside menuSchema

//explain in notes
const Menu = mongoose.model('Menu',menuSchema)
//finally we have to export this modules
//so that inside controllers this should be imported and we can run our databse query

module.exports = Menu
