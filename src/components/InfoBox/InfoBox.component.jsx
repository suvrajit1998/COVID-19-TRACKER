import React from 'react'
import './infobox.css'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const InfoBox = ({ title, cases, isRed, active, total, ...props }) => {
	return (
		<Card
			className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}
			onClick={props.onClick}>
			<CardContent>
				<Typography color='textSecondary' className='infoBox__title'>
					{title}
				</Typography>
				<h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>
				<Typography color='textSecondary' className='infoBox__total'>
					{total} Total
				</Typography>
			</CardContent>
		</Card>
	)
}

export default InfoBox
