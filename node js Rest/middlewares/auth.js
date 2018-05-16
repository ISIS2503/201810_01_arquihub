'use strict'

const services = require('../services')

var token = 1;
function isAuth(req,res,next) {

	if (!req.headers.authorization) {
		return res.status(403).send({ message: 'No tienes autorización'})
	}
	if (typeof req.headers.authorization === 'undefined') {
		res.sendStatus(403).send({ message: 'No tienes autorización'})
	}

	token = req.headers.authorization.split(" ")[1]
	
	services.decodeToken(token)
	.then(response => {
		req.user = response
		next()
	})
	.catch(response => {
		res.status(response.status)
	})
}
function getToken(){
	return token;
}

module.exports =  	 	{
	isAuth,
	getToken
}