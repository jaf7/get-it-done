var http = require( 'http' );
var url = require( 'url' );
var port = process.env.PORT

function start( route, handle ) { // route is a verb (function), handle is a collection of request handlers (methods)

  function onRequest( req, res ) {
    var pathname = url.parse( req.url ).pathname;
    console.log( `Request for ${pathname} received.` );

    route( handle, pathname, res ); // inject the response object
  }

  http.createServer( onRequest ).listen( port ); // 8888 80 8080
  console.log( 'Server started' );
}

module.exports.start = start;


/*
The not-so-great approach (see below):

This implementation was coupled with a requestHandler module
that used a return statement instead of a response object method call.

We expected a return value from our route() invocation (in this case
just a console.log).

We also used response object method calls (res.writeHead, etc)
directly in this server module instead of in the router module
(for 404 errors) and the requestHandlers module (for successful requests).
*/

// var http = require( 'http' );
// var url = require( 'url' );

// function start( route, handle ) { // route is a verb (function), handle is a collection of request handlers (methods)

//   function onRequest( req, res ) {
//     var pathname = url.parse( req.url ).pathname;
//     console.log( `Request for ${pathname} received.` );

//     route( handle, pathname ); // pass the handle collection on to the route() callback, with pathname (returns the requestHandler method return value)

//     res.writeHead( 200, {"Content-Type": "text/plain"} ); // "text/html"
//     res.write( 'Hello World' );
//     res.end();
//   }

//   http.createServer( onRequest ).listen( 8888 );
//   console.log( 'Server started' );
// }

// module.exports.start = start;