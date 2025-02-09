const endpoint = 'https://notes-api.dicoding.dev/v2';

// Show loading indicator
const showLoading = () => {
    const loader = document.createElement('div');
    loader.className = 'loading-indicator';
    loader.textContent = 'Loading data, please wait . . .';
    document.body.appendChild(loader);
};

// Hide loading indicator 
const hideLoading = () => {
    const loader = document.querySelector('.loading-indicator');
    if (loader) loader.remove();
};

// Response message
const showResponseMessage = (message = 'Please check your internet connection.') => {
    alert(message);
};

// Show all notes
const getAllNotes = async () => {
    showLoading();
    try {
        const response = await fetch(`${endpoint}/notes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (response.ok) {
            addNoteToActive;
            renderAllNotes(result.data);
        } else {
            showResponseMessage(result.message);
        }
    } catch (error) {
        showResponseMessage(error.message);
    } finally {
        hideLoading();
    }
};

// Get all archived notes
const getArchivedNotes = async () => {
    showLoading();
    try {
        const response = await fetch(`${endpoint}/notes/archived`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (response.ok) {
            renderAllArchivedNotes(result.data);
        } else {
            showResponseMessage(result.message);
        }
    } catch (error) {
        showResponseMessage(error.message);
    } finally {
        hideLoading();
    }
};

// Function to insert notes
const insertNotes = async (note) => {
    showLoading();
    try {
        const response = await fetch(`${endpoint}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        });
        const result = await response.json();
        if (response.ok) {
            getAllNotes(); // Refresh note list
            showResponseMessage('Note added!');
        } else {
            showResponseMessage(result.message);
        }
    } catch (error) {
        showResponseMessage(error.message);
    } finally {
        hideLoading();
    }
};

// Function to remove note
const removeNotes = async (noteId) => {
    showLoading();
    try {
        const response = await fetch(`${endpoint}/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (response.ok) {
            const noteElement = document.querySelector(`#note-${noteId}`);
            if (noteElement) noteElement.remove();

            getAllNotes(); // Refresh note list (both active and archived)
            showResponseMessage('Note has been deleted!');
        } else {
            // Re-adding note element if the deletion fails
            if (archivedNoteElement) {
                document.querySelector('#archivedNotesList').appendChild(archivedNoteElement);
            }
            showResponseMessage(result.message || 'Failed to delete');
        }
    } catch (error) {
        showResponseMessage(error.message);
        // Re-adding note element if the deletion fails
        const archivedNoteElement = document.querySelector(`#note-${noteId}`);
        if (archivedNoteElement) {
            document.querySelector('#archivedNotesList').appendChild(archivedNoteElement);
        }
    } finally {
        hideLoading();
    }
};

// Function to archive note
const archiveNote = async (noteId) => {
    showLoading();
    try {
        const response = await fetch(`${endpoint}/notes/${noteId}/archive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();

        if (response.ok) {
            getAllNotes(); // Refresh active note list
            showResponseMessage('Note archived!');
        } else {
            showResponseMessage(result.message);
        }
    } catch (error) {
        showResponseMessage(error.message);
    } finally {
        hideLoading();
    }
};

// Function to unarchive note
const unarchiveNote = async (noteId) => {
    showLoading();
    try {
        const response = await fetch(`${endpoint}/notes/${noteId}/unarchive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (response.ok) {
            // Moving archived note to active note element
            const archivedNoteElement = document.querySelector(`#note-${noteId}`);
            if (archivedNoteElement) {
                const listNoteElement = document.querySelector('#notesList');
                archivedNoteElement.classList.remove('archived-note');
                listNoteElement.insertAdjacentHTML('beforeend', archivedNoteElement.outerHTML);
                archivedNoteElement.remove(); // Remove from archive list
            }

            getArchivedNotes(); // Refresh archived note list
            showResponseMessage('Note has been unarchived!');
        } else {
            showResponseMessage(result.message || 'Failed to unarchive note.');
        }
    } catch (error) {
        showResponseMessage(error.message);
    } finally {
        hideLoading();
    }
};

const addNoteToActive = (note) => {
    const listNoteElement = document.querySelector('#notesList');
    const existingNoteElement = document.querySelector(`#note-${note.id}`);

    if (existingNoteElement) {
        existingNoteElement.remove();
    }

    const noteCardHTML = `
        <div class="note-card" id="note-${note.id}">
            <div class="upper-card">
                <h2>${note.title}</h2>
                <span>${new Date(note.createdAt).toLocaleDateString()}</span>
                <p>${note.body}</p>
            </div>
            <div class="lower-card">
                <button class="btn-archive" id="${note.id}">Archive</button>
                <button class="btn-delete" id="${note.id}">Delete</button>
            </div>
        </div>
    `;
    listNoteElement.insertAdjacentHTML('beforeend', noteCardHTML);

    // Adding event listener to new buttons
    const archiveButton = document.querySelector(`#note-${note.id} .btn-archive`);
    archiveButton.addEventListener('click', () => archiveNote(note.id));

    const deleteButton = document.querySelector(`#note-${note.id} .btn-delete`);
    deleteButton.addEventListener('click', () => removeNotes(note.id));
};

// Render active notes
const renderAllNotes = (notes) => {
    const listNoteElement = document.querySelector('#notesList');
    listNoteElement.innerHTML = '';

    notes.forEach(note => {
        listNoteElement.innerHTML += `
            <div class="note-card" id="note-${note.id}">
                <div class="upper-card">
                    <h2>${note.title}</h2>
                    <span>${new Date(note.createdAt).toLocaleDateString()}</span>
                    <p>${note.body}</p>
                </div>
                <div class="lower-card">
                    <button class="btn-archive" id="${note.id}">Archive</button>
                    <button class="btn-delete" id="${note.id}">Delete</button>
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.btn-archive').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.currentTarget.id;
            if (!noteId) {
                console.error('Button ID is missing:', event.currentTarget); // Debug
                return;
            }
            archiveNote(noteId);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.currentTarget.id;
            removeNotes(noteId);
        });
    });
};

// Render archived notes
const renderAllArchivedNotes = (notes) => {
    const archivedNoteElement = document.querySelector('#archivedNotesList');
    archivedNoteElement.innerHTML = '';
    notes.forEach(note => {
        archivedNoteElement.innerHTML += `
            <div class="note-card" id="note-${note.id}">
                <div class="upper-card">
                    <h2>${note.title}</h2>
                    <span>${new Date(note.createdAt).toLocaleDateString()}</span>
                    <p>${note.body}</p>
                </div>
                <div class="lower-card">
                    <button class="btn-unarchive" id="${note.id}">Unrchive</button>
                    <button class="btn-delete" id="${note.id}">Delete</button>
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.btn-unarchive').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.target.id;
            unarchiveNote(noteId);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.target.id;
            removeNotes(noteId);
        });
    });
};

// Event Listeners

document.addEventListener('DOMContentLoaded', () => {
    const activeNotesSection = document.getElementById('activeNotesSection');
    const archivedNotesSection = document.getElementById('archivedNotesSection');
    const activeNotesButton = document.getElementById('activeNotesButton');
    const archivedNotesButton = document.getElementById('archivedNotesButton');

    activeNotesButton.addEventListener('click', () => {
        activeNotesSection.style.display = 'block';
        archivedNotesSection.style.display = 'none';
    });

    archivedNotesButton.addEventListener('click', () => {
        activeNotesSection.style.display = 'none';
        archivedNotesSection.style.display = 'block';
        getArchivedNotes(); // Refresh archived notes
    });

    document.querySelectorAll('.btn-unarchive').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.target.id;
            unarchiveNote(noteId);
        });
    });

    getAllNotes(); // Fetch and display active notes on load
});

export { getAllNotes, insertNotes, removeNotes };