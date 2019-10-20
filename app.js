const express = require('express')
const request = require('request')

const port = process.env.PORT || 3000 // asi funciona en heroku si no en el puerto 3000
const app = express()

const weReq = require('./weather.js')

app.get('/', function(req, res){ // Home
	 	res.send({
 			greeting: 'Hola mundo'
 	})
})

app.get('/weather', function(req, res){
	if(!req.query.search) {
		res.send({
			error:'Debes enviar el nombre de una ciudad agregando ?search=[Nombre de la ciudad]'
		})
		return;
	}
	weReq.geocode(req.query.search, function(error, response){
		if( error ) {
			return res.send({
				error: error
			})
		}
		console.log(response)
		if(response.ciudad) 
		{	
			res.send({
				ciudad: response.ciudad,
		 		summary : response.summary,
				precipProbability : response.precipProbability,
				temperature : response.temperature,
				otroString : response.ciudad + ': ' + response.summary + ' Hay un ' + Math.round(response.precipProbability*100).toString()
			+'%' + ' de probabilidad de lluvia.' + ' La temperatura actualmente es de ' 
			+ response.temperature + ' grados centigrados' 	
			})
		} else {
			res.send(response)
		}
	})
})

app.get('*', function(req, res){ 
		 	res.send({
		 		error: 'Ruta no valida'
 	})
})

app.listen(port, function() {
	console.log('Up and running!')
})
