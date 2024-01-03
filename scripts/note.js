function getCurrentDateTime(){
    const currentDate = new Date();
    const options = {
        weekday: 'long', 
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
    
    return currentDate.toLocaleString('en-US', options);
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

    let lastEditedDateTime = document.getElementById('lastEditedDateTime');
    if (lastEditedDateTime){
        lastEditedDateTime.innerHTML = note.getLastEditedDateTime();
    }

    let content = document.getElementById('content');
    if (content){
        content.innerHTML = note.getContent();
        content.addEventListener('input', function(){
            note.updateContent(this.innerHTML);
            note.saveToLocalStorage();
        })
    }
} else {
    console.error("ID not found");
}


function Note(id) {
    this.id = id;
    this.title = 'New Title';
    this.content = '';
    this.lastEditedDateTime = getCurrentDateTime();
  
    // Function to update last edited date time
    this.updateLastEditedDateTime = function () {
      this.lastEditedDateTime = getCurrentDateTime();
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
  
  