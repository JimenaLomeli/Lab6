
const request = require('request')
const credentials = require('./credentials.js')


if(process.env.NODE_ENV === 'production') {
	var mapbox_key = process.env.MAPBOX_TOKEN
	var darksky_key = process.env.DARK_SKY_SECRET_KEY
} else {
	const credentials = require('./credentials.js')
	//var apikey = credentials.apikey
}

const geocode = function(ciudad, callback) {
	const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + ciudad 
				+'.json?access_token=' + mapbox_key
	console.log(url)
	request({ url, json: true }, function(error, response) {
		if(error) {
			callback('Unable to connect to weather service', undefined)
		 } else if (response.body.code == 400) {
		 	callback(response.body.error, undefined)
		 } else if(response.body.features == '') {
		 	callback('No se encontro la ciudad', undefined)
		 } else if(response.body.message == 'Not found') {
		 	callback('Error: No se encontro el sitio', undefined)
		 } else if (response.body.message == 'Not Authorized - Invalid Token') {
		 	callback('Credenciales incorrectas', undefined)
		 } else if(ciudad == ''){
		 	callback('Tienes que ingresar una ciudad',undefined)
		 } else { 
			const data = response.body
			if(data.Response == 'False') {
				callback(data.Error, undefined)
			} else {
				const info = {
					lat : data.features[0].center[0],
					lon : data.features[0].center[1]
				}
				console.log('1')
				weatherReq(ciudad,info.lon,info.lat,callback)
			}
		}
	})
}
const weatherReq = function(ciudad, latitude, longitude, callback) {
	console.log('2')
	//REQUEST https://api.darksky.net/forecast/[key]/[latitude],[longitude]
	const url = 'https://api.darksky.net/forecast/' + darksky_key + 
				'/' + latitude + ',' + longitude + '?lang=es&units=si'  
	console.log(url)
	request({ url, json: true }, function(error, response) {
		if(error) {
			callback('Unable to connect to weather service', undefined)
		 } else if (response.body.code == 400) {
		 	callback(response.body.error, undefined)
		 } else if(response.body.features == '') {
		 	callback('No se encontro la ciudad', undefined)
		 } else if(response.body.message == 'Not found') {
		 	callback('Error: No se encontro el sitio', undefined)
		 } else if (response.body.message == 'Not Authorized - Invalid Token') {
		 	callback('Credenciales incorrectas', undefined)
		 } else { 
			const dresp = response.body
			if(dresp.Response == 'False') {
				callback(dresp.Error, undefined)
			} else {
				const info = {
					ciudad : ciudad,
					summary : dresp.daily.data[0].summary,
					precipProbability : dresp.daily.data[0].precipProbability,
					temperature : dresp.currently.temperature
				}
				callback(undefined,info)
			}
		}			
	})
}


module.exports = {
	geocode : geocode,
	weatherReq : weatherReq
}