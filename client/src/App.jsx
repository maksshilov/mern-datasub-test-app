import React, { Fragment, useReducer, useState } from 'react'
import {
	Button,
	CircularProgress,
	Container,
	FormControl,
	Grid,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Snackbar,
	TextField,
} from '@mui/material'
import { useHttp } from './http.hooks'

const SET_FORM = 'SET_FORM'
const CLEAR_FORM = 'CLEAR_FORM'

const formReducer = (state, action) => {
	switch (action.type) {
		case SET_FORM:
			const updatedValues = {
				...state.inputValues,
				[action.input]: action.value,
			}
			const updatedValidities = {
				...state.inputValidities,
				[action.input]: action.isValid,
			}
			let updatedFormIsValid = true
			for (const key in updatedValidities) {
				updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
			}
			return {
				inputValues: updatedValues,
				inputValidities: updatedValidities,
				formIsValid: updatedFormIsValid,
			}
		case CLEAR_FORM:
			return {
				inputValues: {
					cardNumber: '',
					expDate: '',
					cvv: '',
					amount: '',
				},
				inputValidities: {
					cardNumber: false,
					expDate: false,
					cvv: false,
					amount: false,
				},
				formIsValid: false,
			}

		default:
			return state
	}
}

function App() {
	const { loading, request } = useHttp()

	const [snack, setSnack] = useState(false)
	const [res, setRes] = useState('')

	const handleSnackClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		setSnack(false)
	}

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			cardNumber: '',
			expDate: '',
			cvv: '',
			amount: '',
		},
		inputValidities: {
			cardNumber: false,
			expDate: false,
			cvv: false,
			amount: false,
		},
		formIsValid: false,
	})

	let { cardNumber, expDate, cvv, amount } = formState.inputValues

	const inputChangeHandler = (inputIdentifier, inputValue, isValid) => {
		dispatchFormState({
			type: SET_FORM,
			input: inputIdentifier,
			value: inputValue,
			isValid,
		})
	}

	const handleCardNumber = (value) => {
		let isValid = false
		let formatValue = value.match(/\d/g)

		if (formatValue?.length) {
			formatValue = formatValue
				.join('')
				.match(/.{1,4}/g)
				.join(' ')
				.substr(0, 19)
			// console.log(formatValue)

			isValid = formatValue.length === 19 && true

			inputChangeHandler('cardNumber', formatValue, isValid)
		} else {
			inputChangeHandler('cardNumber', '', false)
		}
	}

	const handleExpDate = (value) => {
		let isValid = false
		let formatValue = value
			.replace(/^([1-9]\/|[2-9])$/g, '0$1/')
			.replace(/^(0[1-9]|1[0-2])$/g, '$1/')
			.replace(
				/^([0-1])([3-9])$/g,
				'0$1/$2' // 13 > 01/3
			)
			.replace(
				/^(0?[1-9]|1[0-2])([0-9]{4})$/g,
				'$1/$2' // 141 > 01/41
			)
			.replace(
				/^([0]+)\/|[0]+$/g,
				'0' // 0/ > 0 and 00 > 0
			)
			.replace(
				/[^\d\/]|^[\/]*$/g,
				'' // To allow only digits and `/`
			)
			.replace(
				/\/\//g,
				'/' // Prevent entering more than 1 `/`
			)
			.substr(0, 7)

		isValid = formatValue.length === 7 && true
		inputChangeHandler('expDate', formatValue, isValid)
	}

	const handleCvv = (value) => {
		let isValid = false
		let formatValue = value.match(/\d/g)

		if (formatValue?.length) {
			formatValue = formatValue.join('').substr(0, 3)
			isValid = formatValue.length === 3 && true
			inputChangeHandler('cvv', formatValue, isValid)
		} else {
			inputChangeHandler('cvv', '', false)
		}
	}

	const handleAmount = (value) => {
		let isValid = false
		let formatValue = value.match(/\d/g)

		if (formatValue?.length) {
			formatValue = formatValue.join('')
			isValid = formatValue.length !== 0 && true
			inputChangeHandler('amount', formatValue, isValid)
		} else {
			inputChangeHandler('amount', '', false)
		}
	}

	const handleClear = () => {
		dispatchFormState({ type: CLEAR_FORM })
	}

	const handlePay = async () => {
		try {
			const data = await request('/api/pay', 'POST', formState.inputValues)
			console.log(data)
			setRes(() => JSON.stringify(data, null, '\t'))
			setSnack(true)
			handleClear()
		} catch (error) {}
	}

	return (
		<Fragment>
			<Container maxWidth="sm">
				<h1>Card payment</h1>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							id="card-number"
							label="Card Number"
							variant="outlined"
							placeholder="0000 0000 0000 0000"
							value={cardNumber}
							onChange={(event) => handleCardNumber(event.target.value)}
						/>
					</Grid>
					<Grid item xs={8}>
						<TextField
							fullWidth
							id="exp-date"
							label="Expiration Date"
							variant="outlined"
							placeholder="MM/YYYY"
							value={expDate}
							onChange={(event) => handleExpDate(event.target.value)}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							fullWidth
							id="cvv"
							label="CVV"
							variant="outlined"
							placeholder="000"
							value={cvv}
							onChange={(event) => handleCvv(event.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
							<OutlinedInput
								id="amount"
								value={amount}
								onChange={(event) => handleAmount(event.target.value)}
								startAdornment={<InputAdornment position="start">$</InputAdornment>}
								label="Amount"
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<Button
							disabled={!formState.formIsValid}
							variant="contained"
							onClick={handlePay}
						>
							{loading ? (
								<CircularProgress size={20} color={'secondary'} />
							) : (
								'Оплатить'
							)}
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Snackbar
							open={snack}
							autoHideDuration={3000}
							onClose={handleSnackClose}
							message={res}
						/>
					</Grid>
				</Grid>
			</Container>
		</Fragment>
	)
}

export default App
