const { Schema, model } = require('mongoose')

const schema = new Schema({
	cardNumber: { type: String, required: true },
	expDate: { type: String, required: true },
	cvv: { type: String, required: true },
	amount: { type: Number, required: true },
})

module.exports = model('Pay', schema)
