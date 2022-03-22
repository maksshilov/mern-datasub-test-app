import React from 'react'
import {
	Button,
	CircularProgress,
	Container,
	FormControl,
	Grid,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from '@mui/material'

export default function Form({ params }) {
	;<Container maxWidth="sm">
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
				<Button disabled={!formState.formIsValid} variant="contained" onClick={handlePay}>
					{loading ? <CircularProgress size={20} color={'secondary'} /> : 'Оплатить'}
				</Button>
			</Grid>
		</Grid>
	</Container>
}
