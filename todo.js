// IIFE: Wrap all in a scope. Encapsulate, prevent collisions. (passing in jQuery)
( function pageLoad( $ ) {
  $( document ).ready(function() {

    const todoList = document.getElementById( 'todo-list' );
    const archiveList = document.getElementById( 'archive-list' );
    const textArea = document.getElementById( 'new-item' );
    const submitItem = document.getElementById( 'submit-item' );
    const openArchive = document.getElementById( 'open-archive' );
    const closeArchive = document.getElementById( 'close-archive' );
    const adjustPreviewsOnResize = debounce( resizeAllPreviews, 100 );
    let listItems = document.getElementsByTagName( 'li')
    let localStorageList = JSON.parse( localStorage.getItem( 'todo' ) );
    let itemCounter = localStorageList ? localStorageList.itemCounter : false;

    /*
      If passed an empty object (like a newly created listData = {}),
      Object.keys returns an empty array, not 'undefined'. So we shouldn't
      need the first half of these conditionals (?).
    */
    if ( itemCounter ) {
      if ( typeof Object.keys( localStorageList[ 'listData' ] ) !== 'undefined' && Object.keys( localStorageList[ 'listData' ] ).length > 0 ) {
        restoreList( localStorageList[ 'listData' ] );
        todoList.classList.remove( 'hidden' );
      }
      if ( typeof Object.keys( localStorageList[ 'archiveListData' ] ) !== 'undefined' && Object.keys( localStorageList[ 'archiveListData' ] ).length > 0 ) {
        restoreList( localStorageList[ 'archiveListData' ], true );
      }
      resizeAllPreviews();
      refreshItemListeners( listItems );
    } else {
      localStorageList = {
        'itemCounter' : 0,
        'listData' : {},
        'archiveListData' : {}
      };
      localStorage.setItem( 'todo', JSON.stringify( localStorageList ) );
    }

    window.addEventListener( 'resize', function(e) {
      adjustPreviewsOnResize();
    });

    textArea.addEventListener( 'focus', changeTextArea );
    textArea.addEventListener( 'blur', changeTextArea );
    submitItem.addEventListener( 'click', submit );
    submitItem.addEventListener( 'pointerdown', submit );
    openArchive.addEventListener( 'click', toggleArchive );
    closeArchive.addEventListener( 'click', toggleArchive );

    // monitorEvents();

    /* ---------------------------------
    -- Event Listener Functions --
    changeTextArea()
    submit()
    toggleArchive()
    --showArchive()
    --hideArchive()
    strikethrough()
    moveListItem()
    removeListItem()
    addItemListeners()
    refreshItemListeners()
    
    -- Helper Functions --
    restoreList()
    updateLocalStorage()
      setListItem()
    buildItemHTML()
    --buildFromTemplate()
    --buildFromScratch()
    toggleHighlights()
    resizeAllPreviews()
    resizeHeaderText()
    findParent()
    sortList()
    stringToDom()
    debounce()
    --------------------------------- */

    function changeTextArea( e ) {
      let noteInputColumn = document.getElementById( 'note-input-column' );
      let formButtonsColumn = document.getElementById( 'form-buttons-column' );
      if ( e.type === 'focus' ) {
        formButtonsColumn.classList.replace( 's5', 's1' );
        formButtonsColumn.classList.replace( 'm3', 'm1' );
        formButtonsColumn.classList.toggle( 'offset-m2' );
        formButtonsColumn.classList.toggle( 'offset-l3' );
        noteInputColumn.classList.replace( 's6', 's9' );
        this.style.overflowY = 'scroll';

      }
      else if ( e.type === 'blur' ) {
        noteInputColumn.classList.replace( 's9', 's6' );
        formButtonsColumn.classList.replace( 's1', 's5' );
        formButtonsColumn.classList.replace( 'm1', 'm3' );
        formButtonsColumn.classList.toggle( 'offset-m2' );
        formButtonsColumn.classList.toggle( 'offset-l3' );
        this.style.overflowY = 'hidden';
      }
    }

    // FIXME: Submit event is occurring twice, on second occurrence Boolean(textArea.value) == false
    function submit( e ) {
      let itemId = 'item-' + JSON.parse( localStorage.getItem('todo') ).itemCounter;

      console.log(`Boolean(textArea.value): ${Boolean(textArea.value)}`)

      if ( textArea.value ) {

        console.log( `textArea.value: ${textArea.value}` );

        let newItemHTML = buildItemHTML( itemId, textArea.value );
        todoList.appendChild( newItemHTML );

        toggleHighlights( todoList );

        if ( todoList.classList.contains( 'hidden' ) ) {
          todoList.classList.remove( 'hidden' );
        }

        textArea.value = '';
        $( textArea ).trigger( 'autoresize' );

        // FIXME: how to use resizeHeaderText() directly on this newly appended <li> in a semantic, clean way?
        // (can't select the span.note-preview before it's inserted in the DOM)
        resizeAllPreviews();
        addItemListeners( todoList.lastElementChild );
        updateLocalStorage( itemId, true );
      } else {
        // FIXME: Submit event is occurring twice, on second occurrence Boolean(textArea.value) == false
        // console.log(`else clause, Boolean(textArea.value): ${Boolean(textArea.value)}`)
        // alert( 'Please enter a new TODO item.' ); // --- replace w/ materialize or css notification
      }
    }

    // ---

    function toggleArchive( e ) {
      // "this" references the calling object, which event listener is attached to (either openArchive or closeArchive)
      let id = this.id;
      let navHeight = document.querySelector( 'nav' ).clientHeight;

      this.parentElement.querySelector( '.hidden' ).classList.remove( 'hidden' );
      this.classList.add( 'hidden' );
      if ( id === 'open-archive' ) {
        showArchive();
      }
      else if ( id === 'close-archive' ) {
        hideArchive();
      }

      function showArchive() {
        if ( archiveList.innerHTML ) {
          archiveList.classList.remove( 'hidden' );
          $( window ).scrollTo( archiveList, {
            duration: 500,
            axis: 'y',
            offset: { top: - (navHeight + 20), left: 0 }
          });
        } else {
          alert( 'The archive is empty.' );
        }
      }

      function hideArchive() {
        $( window ).scrollTo( '0%', {
          duration: 500,
          axis: 'y'
        });
        archiveList.classList.add( 'hidden' );
      }
    }

    // ---

    function toggleStrikeThrough( e ) {
      e.stopPropagation();
      let listItem = findParent( this, "LI" );
      let textPreview = listItem.querySelector( '.note-preview' );
      let textFull = listItem.querySelector( '.note-full' );

      this.parentElement.querySelector( '.hidden' ).classList.remove( 'hidden' );
      this.classList.add( 'hidden' );

      [ textPreview, textFull ].forEach(function ( text ) {
        if ( !text.classList.contains( 'strike-through' ) ) {
          text.classList.add( 'strike-through' );

        } else {
          text.classList.remove( 'strike-through' );
        }
      });
      updateLocalStorage( listItem.id, false );
    }

    // ---

    function moveListItem( e ) {
      // e.stopPropagation();
      let listItem = findParent( this, 'LI' );
      let listItemCopy = listItem.cloneNode( true );
      let archiveButton = listItemCopy.querySelector( '.archive-item' );
      let restoreButton = listItemCopy.querySelector( '.restore-item' );

      if ( !listItemCopy.id.match( /archived/ ) ) { // item is being moved to archive
        // e.stopPropagation();
        archiveButton.classList.add( 'hidden' );
        restoreButton.classList.remove( 'hidden' );
        listItemCopy.classList.add( 'archived' );
        listItemCopy.id = listItem.id.concat( '-archived' );

        archiveList.appendChild( listItemCopy );
        addItemListeners( archiveList.lastElementChild );
        // sortList( archiveList );
        // shallow copy (references) : facilitates working directly on DOM elements (right?)
        mergeSortList( Array.prototype.slice.call( archiveList.children ) );
        toggleHighlights( archiveList );

        listItem.parentNode.removeChild( listItem );
        toggleHighlights( todoList );
      } else { // item is being restored to todo list
        // e.stopPropagation();
        archiveButton.classList.remove( 'hidden' );
        restoreButton.classList.add( 'hidden' );
        listItemCopy.classList.remove( 'archived' );
        listItemCopy.id = listItemCopy.id.replace( /-archived/, '' );

        todoList.appendChild( listItemCopy );
        addItemListeners( todoList.lastElementChild );
        // sortList( todoList );
        // shallow copy (references) : facilitates working directly on DOM elements (right?)
        mergeSortList( Array.prototype.slice.call( todoList.children ) );
        toggleHighlights( todoList );

        listItem.parentNode.removeChild( listItem );
        toggleHighlights( archiveList );
      }
        // console.log('todoList at end of moveListItem, before call to updateLocalStorage', todoList )
      updateLocalStorage( listItemCopy.id, false );
    }

    // ---

    function removeListItem( e ) {
      e.stopPropagation();
      let list = findParent( this, 'UL' );
      let listItem = findParent( this, 'LI' );

      listItem.parentNode.removeChild( listItem );
      toggleHighlights( list );
      updateLocalStorage( listItem.id, false );
    }

    // ---

    function addItemListeners( listItem ) {
      let uncheckedItem = listItem.querySelector( '.unchecked-item' );
      let checkedItem = listItem.querySelector( '.checked-item' );
      let archiveItem = listItem.querySelector( '.archive-item' );
      let restoreItem = listItem.querySelector( '.restore-item' );
      let removeItem = listItem.querySelector( '.remove-item' );
      let noteBody = listItem.querySelector( '.collapsible-body' );

      uncheckedItem.addEventListener( 'click', toggleStrikeThrough );
      checkedItem.addEventListener( 'click', toggleStrikeThrough )
      archiveItem.addEventListener( 'click', moveListItem );
      restoreItem.addEventListener( 'click', moveListItem );
      removeItem.addEventListener( 'click', removeListItem );
      noteBody.addEventListener( 'blur', function() {
        let item = findParent( this, 'LI' );
        updateLocalStorage( item.id, false );
      });

      // preserve collapsed / expanded state across page loads (materialize adds/removes class="active")
      let listItemObserver = new MutationObserver(function () {
        updateLocalStorage( listItem.id, false );
      });
      listItemObserver.observe( listItem, {
        attributes: true,
        attributeFilter: [ 'class' ],
        childList: false,
        characterData: false
      });
    }

    function refreshItemListeners( items ) {
      let itemArray = Array.prototype.slice.call( items ); // webkit browsers: this will be a NodeList not HTMLCollecttion

      itemArray.forEach(function( listItem ) {
        addItemListeners( listItem );
      });
    }

    // ---

    function restoreList( storedList, isArchiveListData ) {
      for ( let item in storedList ) {
        if ( isArchiveListData ) {
          archiveList.appendChild( stringToDom( storedList[item] ) );
        } else {
          todoList.appendChild( stringToDom( storedList[item] ) );
        }
      }
    }

    // ---

    function updateLocalStorage( id, isNewListItem ) {
        // console.log( 'updateLocalStorage called with id', id );
      if ( isNewListItem ) {
        localStorageList[ 'itemCounter' ] += 1;
      }
      if ( !id.match( /archived/ ) ) {
        let currentList = localStorageList[ 'listData' ];
        setListItem( id, currentList, false );
      } else {
        let currentList = localStorageList[ 'archiveListData' ];
        setListItem( id, currentList, true );
      }
      
      function setListItem( id, list, elementIsArchiveItem ) {
        let nonArchiveId = elementIsArchiveItem ? id.replace( /-archived/, '' ) : null;
        let archiveId = !elementIsArchiveItem ? id.concat( '-archived' ) : null;
        let itemOuterHtml = document.getElementById( id ) ? document.getElementById( id ).outerHTML : null;

        if ( elementIsArchiveItem ) {
          if ( localStorageList[ 'listData' ][ nonArchiveId ] ) {
            delete localStorageList[ 'listData' ][ nonArchiveId ];
          }
        } else {
          if ( localStorageList[ 'archiveListData' ][ archiveId ] ) {
            delete localStorageList[ 'archiveListData' ][ archiveId ];
          }
        }
        if ( itemOuterHtml ) {
          list[ id ] = itemOuterHtml;
            // essentially, it seems you can either call sort again on this object, or write the entire <ul> contents to this object
            // console.log('subList of localStorageList object, after writing to list object', list );
        } else {
          delete list[ id ];
          localStorageList[ 'itemCounter' ] -= 1;
        }

        localStorage.setItem( 'todo', JSON.stringify( localStorageList ) );
      }

    }

    // ---

    function buildItemHTML( id, text ) {
      let listItem;
      if ( "content" in document.createElement("template") ) {
        listItem = buildFromTemplate( id, text );
      } else {
        listItem = buildFromScratch( id, text );
      }

      function buildFromTemplate( id, text ) {
        let template = document.getElementById( "todo-item-template" );
        let liTemplate = template.content.cloneNode( true );
        let li = liTemplate.querySelector( "li" );
        let headerText = resizeHeaderText( text );
        let notePreview = li.querySelector( '.note-preview' );
        let noteFull = li.querySelector( '.note-full' );

        li.setAttribute( "id", id );
        notePreview.appendChild( document.createTextNode( headerText ) );
        noteFull.appendChild( document.createTextNode( text ) );

        return li;
      }

      function buildFromScratch( id, text ) {
        let li = document.createElement( 'li' );
        let headerDiv = document.createElement( 'div' );
        let textIcon = document.createElement( 'i' );
        let headerSpan = document.createElement( 'span' );
        let headerText = resizeHeaderText( text ); 
        let uncheckedButton = stringToDom( '<button class="btn-flat tooltipped unchecked-item" data-position="top" data-delay="50" data-tooltip="Mark as completed"><i class="material-icons">check_box_outline_blank</i></button>' );
        let archiveButton = stringToDom( '<button class="btn-flat tooltipped archive-item" data-position="top" data-delay="50" data-tooltip="Archive this note"><i class="material-icons">archive</i></button>' );
        let removeButton = stringToDom( '<button class="btn-flat tooltipped remove-item" data-position="top" data-delay="50" data-tooltip="Remove this note"><i class="material-icons">remove</i></button>' );
        let buttonsDiv = document.createElement( 'div' );
        let bodyDiv = document.createElement( 'div' );
        let bodySpan = document.createElement( 'span' );

        li.setAttribute( 'id', id );
        headerDiv.setAttribute( 'class', 'collapsible-header' );
        textIcon.setAttribute( 'class', 'material-icons' );
        headerSpan.setAttribute( 'class', 'note-preview' );
        buttonsDiv.setAttribute( 'class', 'header-buttons' );
        bodyDiv.setAttribute( 'class', 'collapsible-body' );
        bodySpan.setAttribute( 'class', 'note-full' );

        textIcon.innerText = 'short_text';
        headerDiv.appendChild( textIcon );
        headerSpan.appendChild( document.createTextNode( headerText ) );
        headerDiv.appendChild( headerSpan );
        buttonsDiv.appendChild( uncheckedButton );
        buttonsDiv.appendChild( archiveButton );
        buttonsDiv.appendChild( removeButton );
        headerDiv.appendChild( buttonsDiv );
        bodySpan.appendChild( document.createTextNode( text ) );
        bodyDiv.appendChild( bodySpan );
        li.appendChild( headerDiv );
        li.appendChild( bodyDiv );

        return li;
      }

      return listItem;
    }

    // ---

    function toggleHighlights( list ) {
      // testing CSS pseudo-class "nth-of-type(an+b)"
      // so do nothing
      /*
      for ( let i = 0; i < list.childElementCount; i++ ) {
        let listItems = list.children;
        let idNumber = listItems[i].id.match( /\d+/ )[0];
        if ( i % 2 != 0 ) {
          listItems[i].firstElementChild.classList.add( 'highlighted' );
        } else {
          listItems[i].firstElementChild.classList.remove( 'highlighted' );
        }
      }
      */
    }

    // ---

    // Resize each preview text on page load and window resize
    function resizeAllPreviews() {
      let previews = document.querySelectorAll( ".note-preview" );

      for ( let preview of previews ) {
        let noteText = preview.parentNode.nextElementSibling.innerText;
        preview.innerText = resizeHeaderText( noteText );
      }
    }

    function resizeHeaderText( text ) {
      let maxLength = Math.floor( document.querySelector( '.container' ).clientWidth * 0.16 );
      let paddedText = text + " ";
      let trimmedText = paddedText.substring( 0, maxLength + 1 );
      let wordBoundaryText = trimmedText.substring( 0, Math.min( trimmedText.length, trimmedText.lastIndexOf(" ") ) ) + " …";

      return wordBoundaryText;
    }

    // ---

    // Implement an upward DOM traversal without jQuery (not recursive). https://stackoverflow.com/questions/7332179/how-to-recursively-search-all-parentnodes
    function findParent( element, parentTag ) {
      while ( element.parentNode ) {
        element = element.parentNode;
        if ( element.tagName == parentTag ) {
          return element;
        }
      }
      return null;
    }

    // ---

    // Worst case O(n^2) time complexity, but list will always be nearly sorted
    // There is no sort method on NodeLists & HTMLCollections as with Array.prototype.sort() (correct?)
    function sortList( list ) {
      let switched = true;
      while( switched ) {
        switched = false;
        if ( list.childElementCount ) {
          // for ( let i = 0; i < list.childElementCount - 1; i++ ) {
          for ( let i = 0; i < list.childElementCount; i++ ) {
            let item = list.children[i];
            let idNumber = item.id.match( /\d+/ )[0];
            let nextItem = list.children[i+1];
            let nextIdNumber = nextItem ? nextItem.id.match( /\d+/ )[0] : null;
            if ( nextIdNumber && idNumber > nextIdNumber ) {
              // console.log('idNumber:', idNumber, 'nextIdNumber:', nextIdNumber);
              list.insertBefore( nextItem, item );
              switched = true;
            }
          }
        }
      }
    }

    function mergeSortList ( arr ) {
      const middle = Math.floor( arr.length / 2 );
      const left = arr.slice( 0, middle );
      const right = arr.slice( middle );

      if ( arr.length === 1 ) {
        return arr;
      }
      merge( mergeSortList( left ), mergeSortList( right ) );

      function merge( left, right ) { // for loop to iterate id's?
        let merged = [];
        let leftIndex = 0;
        let rightIndex = 0;
        while ( leftIndex >= left.length && rightIndex >= right.length ) {
          if ( left[ leftIndex ] < right[ rightIndex ] ) {
            merged.push( left[ leftIndex ] );
            leftIndex ++;
          } else {
            merged.push( right[ rightIndex ] );
            rightIndex ++;
          }
        }
        return merged;
      }

    }

    // ---

    function stringToDom( htmlString ) {
      let div = document.createElement( 'div' );
      div.innerHTML = htmlString;
      return div.firstChild;
    }

    // ---

    // Rewrite for learning: combination of Underscore.js version & https://davidwalsh.name/javascript-debounce-function
    function debounce(myFunction, wait, immediate) {
      var timeout;

      return function() {
        var context = this,
            args = arguments,
            callNow = immediate && !timeout;

        var later = function() {
          timeout = null;
          if (!immediate) { myFunction.apply(context, args); }
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) { myFunction.apply(context, args); }
      };
    };

  });
})( jQuery );

