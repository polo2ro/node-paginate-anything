node-paginate-anything
======================

[![Build Status](https://travis-ci.org/polo2ro/node-paginate-anything.svg?branch=master)](https://travis-ci.org/polo2ro/node-paginate-anything)

nodejs server side module for [angular-pagninate-anything](https://github.com/begriffs/angular-paginate-anything)

This nodejs module add the required headers in the http response to paginate the items. This is a rewrite of [clean_pagination](https://github.com/begriffs/clean_pagination)


### Install

  npm install node-paginate-anything


### Usage

```JavaScript
  var paginate = require('node_modules/node-paginate-anything/src/paginate-anything');
  
  var queryParameters = paginate([http.ClientRequest](http://nodejs.org/api/http.html#http_class_http_clientrequest), [http.ServerResponse](http://nodejs.org/api/http.html#http_class_http_serverresponse), total_items, max_range_size);
  
  mongooseQuery.limit(queryParameters.limit);
  mongooseQuery.skip(queryParameters.skip);
```

### Benefits

* **HTTP Content-Type agnoticism.** Information about total items,
  selected ranges, and next- previous-links are sent through headers.
  It works without modifying your API payload in any way.
* **Graceful degredation.** Both client and server specify the maximum
  page size they accept and communication gracefully degrades to
  accomodate the lesser.
* **Expressive retrieval.** This approach, unlike the use of `per_page` and
  `page` parameters, allows the client to request any (possibly unbounded)
  interval of items.
* **Semantic HTTP.** Built in strict conformance to RFCs 2616 and 5988.

