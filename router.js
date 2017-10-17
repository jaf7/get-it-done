function route( handle, pathname, res ) {
  console.log( `About to route a request for ${pathname}` );

  if ( typeof handle[pathname] === 'function' ) {
    handle[pathname]( res ); // injected response object passed on to request handler methods
  } else {
    console.error( `No request handler found for ${pathname}` );
    res.writeHead( 404, {"Content-Type": "text/plain"} );
    res.write( "404 Not Found" );
    res.end();
  }
}

module.exports.route = route;

/*
Previously we expected return values out of the request handlers,
instead of passing on the response object.
*/

// function route( handle, pathname ) {
//   console.log( `About to route a request for ${pathname}` );
  
//   if ( typeof handle[pathname] === 'function' ) {
//     handle[pathname]();
//   } else {
//     console.log( `No request handler found for ${pathname}` );
//     return "404 Not Found";
//   }
// }

// module.exports.route = route;