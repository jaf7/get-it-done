var server = require( './server' );
var router = require( './router' );
var requestHandlers = require( './requestHandlers' );

// Setting up request handlers to pass (inject) into route() in server.js
var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/main.css"] = requestHandlers.css;
handle["/todo.js"] = requestHandlers.js;
handle["/upload"] = requestHandlers.upload;

server.start( router.route, handle );

/*
From The Node Beginner Book:
As you can see, it’s really simple to map different URLs
to the same request handler: by adding a key/value pair
of ”/” and requestHandlers.start, we can express in a nice
and clean way that not only requests to /start, but also
requests to / shall be handled by the start handler.
*/
/*
From The Node Beginner Book:
Passing functions is not only a technical consideration.
With regard to software design, it’s almost philosophical.
Just think about it: in our index file, we could have
passed the router object into the server, and the server
could have called this object’s route function.

This way, we would have passed a thing, and the server
would have used this thing to do something. Hey, router thing,
could you please route this for me?

But the server doesn’t need the thing. It only needs to get
something done, and to get something done, you don’t need
things at all, you need actions. You don’t need nouns, you need verbs.

Understanding the fundamental mind-shift that’s at the core of this
idea is what made me really understand functional programming.
And I did understand it when reading Steve Yegge’s masterpiece:
Execution in the Kingdom of Nouns. Go read it now, really. It’s one of
the best writings related to software I ever had the pleasure to encounter.
http://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html
*/
