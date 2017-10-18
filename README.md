# get-it-done

A learning project TODO list app that aspires to be a clean, intuitive user experience.

This began as a solution to Rithm School's [Intermediate Javascript](https://www.rithmschool.com/courses/intermediate-javascript) Events Exercises, Parts 3 and 4. I realized in part 4 that by using local storage I could immediately start learning to design an app that uses persistent storage. I'm beginning to learn SQL and will implement the next version with a database. Using local storage is [insecure](https://www.owasp.org/index.php/HTML5_Security_Cheat_Sheet#Storage_APIs) for several reasons <sup>[1](#f1)</sup> <sup>[2](#f2)</sup>..

I'm using [Node School](https://nodeschool.io/) lessons and [The Node Beginner Book](https://www.nodebeginner.org/) as a guide, and building back-end functionality without using a framework such as Express. I want to begin to understand internals before using a framework like Express (I think this will facilitate better understanding / utilization of such frameworks.) The resulting looks different in approach to several tutorials I've come across. Time / practice / study will tell me what methods are best practices.

(Many improvements to be made to UX, UI, behavior! Work in progress.)

<b id="f1">1</b> [HTML5 Security](https://www.owasp.org/index.php/HTML5_Security_Cheat_Sheet#Storage_APIs)

<b id="f2">2</b> [Stack Overflow](https://stackoverflow.com/questions/17280390/can-local-storage-ever-be-considered-secure)

## Purpose

* To begin to learn Node.js and understand modules, servers, routing and request handling
* To create an app that I will eventually use and improve in a feedback loop
* To begin exploring usability in relation to design
* An opportunity to work on the fundamentals (HTML/CSS, JS, readable maintainable non-brittle code)
* To introduce myself to using Heroku and Heroku CLI with a Node.js back-end.
* To take pleasure in the work of learning, revising, and improving


## Demo
#### Please Note: I've disabled tooltips I implemented since their behaviour seems disruptive, and I'm tracking down a bug I think involves event capturing / bubbling. In the meantime this is the basic usage (try adding several notes and manipulating them):
* 
* And thanks for checking it out!

## Built Using

* [Node.js](https://nodejs.org/)
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [HTML/CSS](http://learn.shayhowe.com/html-css/)
* [jQuery](https://jquery.com/)
* [Materialize](http://materializecss.com/) - Front-end framework based on [Material Design](https://material.io/)
* [jQuery.scrollTo](https://github.com/flesler/jquery.scrollTo) - Lightweight animated scrolling with jQuery
* [classList.js](https://github.com/eligrey/classList.js) - Make element.classList work for older IE browsers (cross-browser JS shim)
* [Heroku](https://devcenter.heroku.com/) - deployed to Heroku remote, running on a single web dyno
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) - For running a local development server inside a virtual environment, logging to stdout, spinning up dynos

## Resources

* [Node School learnyounode workshopper](https://github.com/workshopper/learnyounode)
* [The Node Beginner Book](https://www.nodebeginner.org/)
* [The Node Craftsman Book](https://leanpub.com/nodecraftsman)
* [package.json - Official Documentation](https://docs.npmjs.com/getting-started/using-a-package.json)
* [npm init - Official Documentation](https://docs.npmjs.com/cli/init)
* [NodeSource Beginner's Guide to NPM](http://nodesource.com/blog/an-absolute-beginners-guide-to-using-npm/)
* [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)
* [Materialize Documentation](http://materializecss.com/getting-started.html)
* [jQuery API Documentation](https://api.jquery.com/)
* [IIFE discussion - YDKJS: Up and Going, Chapter 2](https://github.com/getify/You-Dont-Know-JS/blob/master/up%20%26%20going/ch2.md) - Buy the books, suppor the author!
* [IIFE discussion - YDKJS: Scope and Closures, Chapter 3](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch3.md) - Buy the fantastic books, suppor the author!
* [Material Design](https://material.io/)


#### TODO

  - [ ] Make `todo.js` conform to airbnb style guide: https://github.com/airbnb/javascript [/]
  - [ ] Refactor buildFromScratch helper function and test for IE []
  * Re-implement alerts with CSS solution []
  - [ ] Fix "Enter new item" alert []
  - [ ] Decide if refreshItemListeners helper function be replaced with event delegation [David Walsh, Event Delegation](https://davidwalsh.name/event-delegate) []
  - [ ] Add scrollTo `<li>` after restoring list items from archive []
  - [ ] Add animation for archive, restore, remove (Visually confusing w/ no visible transition. See materialize hiding and transition helpers) []
  - [ ] Back to top on pageload, & add back to top button for scrolled content []
  - [ ] Use `classList.toggle()` method for `display: hidden` instead of `.add` and `.remove` []
  - [ ] Limit header preview text to one line []
  * Revert expanded / collapsed list item states to all collapsed on `moveListItem()` or page (re)load []
  - [ ] For highlighting every other item: continue testing CSS pseudo-class `nth-of-type(an+b)` (remove `toggleHighlights()` helper function?) [/]
  - [ ] Debug recursive merge sort, continue studying sort algorithms, implement performant solution [/]
  - [ ] Explore refactoring:
    * Object Oriented
    * Most appropriate data structure for `listData` and `archiveListData`
        * Objects or nested arrays?
        * For branching TODO list with sublists? 
        * For search feature with efficient sort algorithm?
            * Breadth- or Depth-first?
            * MergeSort?
            (Hopefully a TODO list will never be complex enough for this to be a non-trivial consideration. This is for the learning opportunity.)