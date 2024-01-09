let createNoteButton = document.getElementById('create');

if (createNoteButton){
    createNoteButton.addEventListener('click', function () {
        let id = uuidv4();
        let url = chrome.runtime.getURL('/note/note.html') + `?id=${id}`;
        openTab(url);
    });
}

document.addEventListener('DOMContentLoaded', renderNotes);

function openTab(url){
  chrome.windows.getAll({ populate: true }, function (windows) {
    // Loop through each window
    windows.forEach(function (window) {
      // Loop through each tab in the window
      window.tabs.forEach(function (existingTab) {
        // Check if the tab has the same URL and is not the newly created tab
        if (existingTab.url === url) {
          // Close the existing tab
          chrome.tabs.remove(existingTab.id);
        }
      });
    });

    // Open a new tab with the same URL
    chrome.tabs.create({ url: url });
  });
}

function renderNotes(){
  const notesContainer = document.getElementById('notesContainer');
  notesContainer.innerHTML = "";
  
  // Get all keys from local storage
  let allKeys = Object.keys(localStorage);

  if(allKeys.length){
    let notes = [];
    // Iterate through each key and display the corresponding note
    allKeys.forEach(function (key) {
      const noteData = localStorage.getItem(key);
      if (noteData) {
        const note = JSON.parse(noteData);
        note.key = key;
        notes.push(note);
      }
    });
    
    notes = notes.sort((a, b) => new Date(b.lastEditedDateTime) - new Date(a.lastEditedDateTime));
    notes.forEach(x => renderNote(x, x.key));
  } else {
    renderEmpty()
  }


  // Function to render a note in the popup
  function renderNote(note, key) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.classList.add('row');
    noteElement.classList.add('m-0');
    noteElement.classList.add('justify-content-between');
    noteElement.setAttribute('id', key)
    
    const contentElement = document.createElement('div');
    contentElement.classList.add('col-11');
    contentElement.classList.add('content');
    contentElement.innerHTML = `
      <p class="note-title">${note.title}</p>
      <p class="description">${formatDateTime(note.lastEditedDateTime)}</p>
    `;
    contentElement.addEventListener('click', function () {
      let id = this.parentNode.id;
      let url = chrome.runtime.getURL('/note/note.html') + `?id=${id}`;
      openTab(url);
    });
    noteElement.appendChild(contentElement);

    const trashElement = document.createElement('div');
    trashElement.classList.add('col-1');
    trashElement.classList.add('ps-0');
    trashElement.classList.add('icon-box');
    trashElement.innerHTML = `
      <i class="fas fa-trash-alt trash-icon"></i>
    `;
    trashElement.addEventListener('click', function () {
      let id = this.parentNode.id;
      localStorage.removeItem(id);
      renderNotes();
    });
    noteElement.appendChild(trashElement);
    notesContainer.appendChild(noteElement);
  }

  function renderEmpty(){
    const emptyElement = document.createElement('div');
    emptyElement.classList.add('empty');
    emptyElement.innerHTML = `
      <p>No notes found</p>
    `;
    notesContainer.appendChild(emptyElement);
  }
}

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