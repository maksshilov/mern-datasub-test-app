const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true }))

app.use('/api', require('./routes/pay.routes.js'))

const PORT = config.get('port') || 5000
const MONGO_URI = config.get('mongoUri') || 5000

async function start() {
	app.listen(PORT, () => console.log(`App has been started at port ${PORT}...`))
	try {
		await mongoose.connect(MONGO_URI)
	} catch (error) {
		console.log(`Server Error ${error.message}`)
		process.exit(1)
	}
}

start()
