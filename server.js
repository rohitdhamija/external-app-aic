const express = require('express');
const request = require('request');
const CryptoJS = require("crypto-js");
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {responseStatus: null});
})

const port=process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Dental care app listening on port: '+port)
})

app.post('/', function (req, res) {
  
  var patientName = req.body.patientname;
  console.log(patientName);
    
  var patientPhoneNumber =  req.body.patientphonenumber ;
  console.log(patientPhoneNumber);    
//var request = require("request");
//var CryptoJS = require("crypto-js");

var jsonBody = {
    "userId": patientPhoneNumber,
    "messagePayload": {
        "type": "application",
        "payloadType": "msgReminder",
        "channelName": "DentalBotTwilioChannel",
        "variables": {
        	"patientname": patientName
        }
    }
};

var hmac = CryptoJS.HmacSHA256(JSON.stringify(jsonBody), 'KsVzlZpvJhthZBl2PDSuv6Lrn8eIsekN').toString();

request.post({
   headers: {
       'content-type' : 'application/json', 
       'x-hub-signature':'sha256='+hmac
   },
   url: 'https://botphx1I0002H5FD5DFbots-mpaasocimt.botmxp.ocp.oraclecloud.com:443/connectors/v1/tenants/idcs-100b89d671b54afca3069fe360e4bad4/listeners/application/channels/3cb0a9e1-b976-474a-bc86-fa479d6d383b',
   body:    JSON.stringify(jsonBody)
 }, 
function(error, response, body){
   if (error)  console.log(error);
   

   
    var responseStatusText = 'Status: ' + response.statusCode + ', ' + response.statusMessage;
    
    console.log(responseStatusText);
    
    res.render('index', {responseStatus: responseStatusText});
 });
})