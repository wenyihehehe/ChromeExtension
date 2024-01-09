function formatDateTime(date){
  const options = {
      weekday: 'long', 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
  return new Date(date).toLocaleString('en-US', options);
}

const urlParams = new URLSearchParams(window.location.search);
const noteId = urlParams.get('id'); 
if (noteId){
  const note = new Note(noteId);

  let title = document.getElementById('title');
  if (title){
      title.innerHTML = note.getTitle();
      document.title = note.getTitle();
      title.addEventListener('input', function(){
          note.updateTitle(this.innerHTML);
          note.saveToLocalStorage();
          document.title = this.innerHTML;
      })
  }

  setLastUpdatedDateTime(note);

  var quill = new Quill('#content', {
    theme: 'snow'
  });

  quill.setContents(note.getContent())

  // Check if there is content
  if (quill.getLength() > 0) {
    var lastIndex = quill.getLength() - 1;
    quill.setSelection(lastIndex, 0);
  }

  // Event listener for text-change event
  quill.on('text-change', function(delta, oldDelta, source) {
    if (source === 'user') {
      var content = quill.getContents();
      note.updateContent(content);
      setLastUpdatedDateTime(note);
      note.saveToLocalStorage();
    }
  });

  // Add a custom binding for Ctrl+Shift+1 to insert <h1>
  quill.keyboard.addBinding({
    key: '1',
    shiftKey: true,
    shortKey: true,
  }, function(range, context) {
      // Check if the editor is focused
      if (quill.hasFocus()) {
        var format = quill.getFormat(range);
        if (format && format.header === 1) {
          quill.format('header', false);
        } else {
          quill.format('header', 1);
        }
      }
  });

  // Add a custom binding for Ctrl+Shift+2 to insert <h2>
  quill.keyboard.addBinding({
    key: '2',
    shiftKey: true,
    shortKey: true,
  }, function(range, context) {
      if (quill.hasFocus()) {
        var format = quill.getFormat(range);
        if (format && format.header === 2) {
          quill.format('header', false);
        } else {
          quill.format('header', 2);
        }
      }
  });

  // Add a custom binding for Ctrl+Shift+3 to insert <h2>
  quill.keyboard.addBinding({
    key: '3',
    shiftKey: true,
    shortKey: true,
  }, function(range, context) {
      if (quill.hasFocus()) {
        var format = quill.getFormat(range);
        if (format && format.header === 3) {
          quill.format('header', false);
        } else {
          quill.format('header', 3);
        }
      }
  });
} else {
    console.error("ID not found");
}

function setLastUpdatedDateTime(note){
  let lastEditedDateTime = document.getElementById('lastEditedDateTime');
  if (lastEditedDateTime){
      lastEditedDateTime.innerHTML = formatDateTime(note.getLastEditedDateTime());
  }
}


function Note(id) {
    this.id = id;
    this.title = 'New Title';
    this.content = '';
    this.lastEditedDateTime = new Date();
  
    // Function to update last edited date time
    this.updateLastEditedDateTime = function () {
      this.lastEditedDateTime = new Date();
    };
  
    // Function to get title
    this.getTitle = function () {
      return this.title;
    };
  
    // Function to get content
    this.getContent = function () {
      return this.content;
    };
  
    // Function to get last edited date time
    this.getLastEditedDateTime = function () {
      return this.lastEditedDateTime;
    };
  
    // Function to update content and last edited date time
    this.updateContent = function (newContent) {
      this.content = newContent;
      this.updateLastEditedDateTime();
    };

     // Function to update content and last edited date time
     this.updateTitle = function (newTitle) {
        this.title = newTitle;
        this.updateLastEditedDateTime();
      };
  
    // Load note from localStorage
    this.loadFromLocalStorage = function () {
      const storedNote = localStorage.getItem(this.id);
      if (storedNote) {
        const parsedNote = JSON.parse(storedNote);
        this.title = parsedNote.title || '';
        this.content = parsedNote.content || '';
        this.lastEditedDateTime = parsedNote.lastEditedDateTime || '';
      } else {
        this.saveToLocalStorage();
      }
    };
  
    // Save note to localStorage
    this.saveToLocalStorage = function () {
      const noteData = JSON.stringify({
        title: this.title,
        content: this.content,
        lastEditedDateTime: this.lastEditedDateTime,
      });
      localStorage.setItem(this.id, noteData);
    };
  
    // Load note from localStorage when the object is created
    this.loadFromLocalStorage();
}
  
  