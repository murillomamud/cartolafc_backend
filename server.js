var express = require('express');
var app = express();
var fetch = require('node-fetch');
var requestInit = null;
var token = null;
var times = new Array();
var jsonFile = require('jsonfile')
var fileName = 'login.json'
var login = null;
var senha = null;

app.get('/', function (req, res) {



    jsonFile.readFile(fileName, function (err, jsonData) {
        if (err) throw err;
        login = jsonData['usuario'];
        senha = jsonData['senha'];
        conectar();
    });


    function conectar() {

        var request = require("request");
        var options = {
            method: 'POST',
            url: 'https://login.globo.com/api/authentication',
            headers:
            {
                'postman-token': '562cffe9-9ebf-993e-f781-c29f361bcd81',
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body:
            {
                payload:
                {
                    email: login,
                    password: senha,
                    serviceId: 438
                }
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            token = body.glbId
            getLiga();
        });
    }

    function getLiga() {

        requestInit = {
            method: 'GET',
            headers: {
                'X-GLB-Token': token
            }
        };

        fetch(
            'https://api.cartolafc.globo.com/auth/liga/letnis-champions-league',
            requestInit
        ).then(
            async (response) => {
                var retorno = (await response.json());
                times = retorno.times;
                processaResultado()
            },
            (error) => console.log(error)
            );
    }

    function processaResultado() {
        res.json({ equipes: times });
    }

})


app.listen(process.env.PORT || 5000);