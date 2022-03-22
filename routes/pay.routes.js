const { Router } = require('express')

const Pay = require('../models/Pay')
const router = Router()

router.post('/pay', async (req, res) => {
	try {
		const { cardNumber, expDate, cvv, amount } = req.body
		const pay = new Pay({ cardNumber, expDate, cvv, amount })

		const requestId = pay._id.valueOf()
		const amountPay = pay.amount

		await pay.save()

		res.status(201).json({ requestId, amount: amountPay })
	} catch (error) {
		res.status(500).json({ message: 'Smth goes wrong... Try again' })
	}
})

module.exports = router
