'use strict';
var http = require('http');
var paginate = require('../src/paginate-anything');

var server = http.createServer(function (req, res) {
	var p = paginate(req, res, 10, 200);
	//res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello');
	req.connection.destroy();
});
server.listen(3000);

describe('node-paginate-anything', function PaginateTestSuite() {

	it('Server should respond to /', function (done){
		http.get('http://localhost:3000', function(response){
			expect(response.statusCode).toBe(200);
			done();
		});
	});
	
	
	it('Test server should close', function (done){
		server.close(done);
	});
	

});


