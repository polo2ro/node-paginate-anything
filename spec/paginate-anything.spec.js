'use strict';
var http = require('http');
var paginate = require('../src/paginate-anything');


var server = http.createServer(function (req, res) {
	
	var url = require('url').parse(req.url, true);
	var params = url.query;
	
	var total_items = '*' === params.total_items ? Infinity : params.total_items;
	
	var p = paginate(req, res, params.total_items, 1000);
	res.end('Hello');
	req.connection.destroy();
});
server.listen(3000);


function paginatedRequest(total_items, range, callback)
{
	if (total_items >= Infinity)
	{
		total_items = '*';
	}
	
	var options = {
	  hostname: 'localhost',
	  port: 3000,
	  path: '/?total_items='+total_items,
	  method: 'GET',
	  headers: {
		  'range-unit': 'items',
		  'range': range
		}
	};

	var req = http.request(options, callback);


	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	req.end();
}


/**
 * Get the ranges for each link in the link header
 * @param	http.ServerResponse		response
 */  
function linkHeader(response)
{
	var link = {};
	var arr = response.headers['link'].split(',');
	for(var i=0; i<arr.length; i++)
	{
		var rel = null;
		var items = null;
		
		var elements = arr[i].trim().split(';');
		for(var j=0; j<elements.length; j++)
		{
			var f = elements[j].trim().match(/([^=]+)="([^"]+)"/);
			
			if (f)
			{
				if (f[1] === 'rel') {
					rel = f[2];
				}
				
				if (f[1] === 'items') {
					items = f[2];
				}
			}
		}
		
		if (rel && items)
		{
			link[rel] = items;
		}
	}
	
	return link;
}



describe('node-paginate-anything', function PaginateTestSuite() {

	it('Server should respond with full range by default', function (done){
		http.get('http://localhost:3000?total_items=10', function(response){
			expect(response.headers['content-range']).toBe('0-9/10');
			expect(response.statusCode).toBe(200);
			done();
		});
	});
	
	
	it('Server should respond with partial content', function (done){
		paginatedRequest(100, '10-19', function(response){
			var links = linkHeader(response);
			expect(links.prev).toBe('0-9');
			expect(links.first).toBe('0-9');
			expect(links.next).toBe('20-29');
			expect(links.last).toBe('90-99');
			expect(response.headers['content-range']).toBe('10-19/100');
			expect(response.statusCode).toBe(206);
			done();
		});
	});
	
	it('Server should respond with a requested range unsatisfiable response', function (done){
		paginatedRequest(5, '20-25', function(response){
			expect(response.headers['content-range']).toBe('*/5');
			expect(response.statusCode).toBe(416);
			done();
		});
		
		paginatedRequest(80, '25-15', function(response){
			expect(response.headers['content-range']).toBe('*/80');
			expect(response.statusCode).toBe(416);
			done();
		});
		
	});
	
	
	it('Server should respond 200 OK if pagination not appliquable because of empty total items', function (done){

		paginatedRequest(0, '25-1', function(response){
			expect(response.headers['content-range']).toBe('*/0');
			expect(response.statusCode).toBe(200);
			done();
		});
	});
	
	
	it('Server should respond 200 OK and correct range for infinity total items', function (done){

		paginatedRequest(Infinity, '50-55', function(response){
			
			var links = linkHeader(response);
			expect(links.prev).toBe('44-49');
			expect(links.first).toBe('0-5');
			
			expect(response.headers['content-range']).toBe('50-55/*');
			expect(response.statusCode).toBe(200);
			done();
		});
	});
	

	
	it('Test server should close', function (done){
		server.close(done);
	});
	

});


