
const fs     = require('fs');
const zetta  = require('zetta');
const device = require('../gpio-scout');
const app    = require('./apps/gpio_app');

const serverPort  = 1107;  // IIOT port definied and claimed by Agilatech

var options       = {};
var keyfile       = null;
var certfile      = null;
var securityCheck = 0;

// a production server would use something robust, such as minimist for command arg parsing
process.argv.forEach(function (val, index, array) {
	if (index < 2) { return; }

	if (array[index-1] == "-k") {
		keyfile = fs.readFileSync(val);
		securityCheck++;
	}
	else if (array[index-1] == "-c") {
		certfile = fs.readFileSync(val);
		securityCheck++;
	}
});

if (securityCheck == 2) {
	options.tls = {key:keyfile, cert:certfile};
}

var zet = zetta(options)
    .listen(serverPort, function() {
		console.log(`*** VersaLink Test Server running ${(securityCheck == 2) ? 'with TLS Security' : 'unsecured'} on port ${serverPort}`);
	});

// naming the server is optional
zet.name('testServer');

// NOTE: the options for the device can be overridden here
zet.use(device);

// this loads and starts a device demo app
zet.use(app);


/*  Example TSL files created using OpenSSL with the following commands:

// create a self-signed certificate and public-private key file, good for 10 years
openssl req -newkey rsa:4096 -nodes -sha512 -x509 -days 3650 -nodes -out examplecert.pem -keyout examplekeypair.pem

// Separate public key from public-private key pair
openssl rsa -in examplekeypair.pem -pubout -out examplepub.pem

// show certificate details  (base64 decode)
openssl x509 -in examplecert.pem -text -noout

// obviously, you should generate your own keys -- the ones here are only for educational purposes
*/



