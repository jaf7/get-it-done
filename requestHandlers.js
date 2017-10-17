var fs = require( 'fs' );

function start( res ) {
  console.log( 'Request handler for "start" was called.' );  

  fs.readFile(  './todo.html', function( err, html ) {
    if ( err ) {
      console.error( `Error: ${err}` );
      res.writeHead( 520, {"Content-Type": "text/plain"} );
      res.write( err );
      res.end();
    } else {
      res.writeHead( 200, {"Content-Type": "text/html"} );
      res.write( html );
      res.end();
    }
  });

}

function js( res ) {
  console.log( 'Request handler for "js" was called.' );

  fs.readFile( './todo.js', function( err, jsFile ) {
    if ( err ) {
      console.error( `Error: ${err}` );
      res.writeHead( 520, {"Content-Type": "text/plain"} );
      res.write( err );
      res.end();
    } else {
      res.writeHead( 200, {"Content-Type": "application/javascript"} );
      res.write( jsFile );
      res.end();
    }
  });

}

function css( res ) {
 console.log( 'Request handler for "css" was called.' );
 
 fs.readFile( './main.css', function( err, cssFile ) {
    if ( err ) {
      console.error( `Error: ${err}` );
      res.writeHead( 520, {"Content-Type": "text/plain"} );
      res.write( err );
      res.end();
    } else {
      res.writeHead( 200, {"Content-Type": "text/css"} );
      res.write( cssFile );
      res.end();
    }
  });

}

function upload( res ) {
  console.log( 'Request handler for "upload" was called (example request handler)' );

  res.writeHead( 200, {"Content-Type": "text/plain"} );
  res.write( 'Hello Upload (example request handler)' );
  res.end();
}

module.exports.start = start;
module.exports.css = css;
module.exports.js = js;
module.exports.upload = upload;


/*
Practice module written using The Node Beginner Book:
*/

// var exec = require( 'child_process' ).exec;

// function start( res ) {
//   console.log( 'Request handler for "start" was called.' );  

//   exec( 'ls -lah', function( error, stdout, stderr ) {
//     res.writeHead( 200, {"Content-Type": "text/plain"} );
//     res.write( stdout );
//     res.end();
//   });
// }

// function upload( res ) {
//   console.log( 'Request handler for "upload" was called' );

//   res.writeHead( 200, {"Content-Type": "text/plain"} );
//   res.write( 'Hello Upload' );
//   res.end();
// }

// module.exports.start = start;
// module.exports.upload = upload;



/*
How not to do it (see below):
The child_process module provides asynchronous execution,
but exec() uses a callback function to load the content
variable with the result of the ls command. But this callback
isn't invoked until ls completes. Meanwhile, control flow in our
code has moved on to the return statement, which executes 
before ls completes and before the callback is invoked.
So the value of the content variable that gets returned is "empty".
*/

// var exec = require("child_process").exec;

// function start() {
//   console.log("Request handler 'start' was called.");
//   var content = "empty";

//   exec("ls -lah", function (error, stdout, stderr) {
//     content = stdout;
//   });

//   return content;
// }

// function upload() {
//   console.log("Request handler 'upload' was called.");
//   return "Hello Upload";
// }

// exports.start = start;
// exports.upload = upload;