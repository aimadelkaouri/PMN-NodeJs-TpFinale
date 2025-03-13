const mongoose = require ('mongoose')


const livreSchema  = new mongoose.Schema({
    titre: { type:String, required:true,  minlength: 3},
    auteur: { type:String, required:true,  minlength: 3},
    date: { type:Number, required:true},
    resume: { type:String, required:false,  maxlength: 500}
})

const Livre = mongoose.model('Livre', livreSchema)
module.exports = Livre