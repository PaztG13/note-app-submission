import { customValidationHandler } from "./form-custom-validation.js";
import { insertNotes } from "../../main.js";

class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.handleAddNote = this.handleAddNote.bind(this);
        this.innerHTML = `
            <form id="add-note" action="#">
                    <div class="form-title">
                        <input
                        id="note-title"
                        name="title"
                        type="text"
                        placeholder="Title"
                        required
                        autocomplete="off"
                        aria-describedby="titleValidation"
                        />
                        <p id="titleValidation" class="validation-message" aria-live="polite"></p>
                    </div>
                    <div class="form-body">
                        <input
                        id="note-body"
                        name="body"
                        type="textarea"
                        placeholder="What's on your mind?"
                        required
                        autocomplete="off"
                        "
                        />
                    </div>
                    <button id="submitNote" type="submit">Submit</button>
            </form>
        `;

        this.form = this.querySelector('#add-note');
        this.noteTitleInput = this.querySelector('#note-title');
        this.noteBodyInput = this.querySelector('#note-body');
        this.validationMessage = this.querySelector('#titleValidation');

        this.form.addEventListener('submit', this.handleAddNote);
        this.noteTitleInput.addEventListener('input', this.handleValidation.bind(this));
        this.noteBodyInput.addEventListener('input', this.handleValidation.bind(this));
    }

    handleValidation(event) {
        customValidationHandler(event);
        this.validationMessage.textConetnt = event.target.validationMessage;
    }

    handleAddNote(event) {
        event.preventDefault();
        const title = this.noteTitleInput?.value.trim();
        const body = this.noteBodyInput?.value.trim();

        if (this.noteTitleInput.checkValidity() && title && body) {
            const note = { title, body };
            insertNotes(note);
            this.noteTitleInput.value = '';
            this.noteBodyInput.value = '';
            this.resetForm();
            this.querySelector('#note-body').value = '';
            this.validationMessage.textContent = '';
        } else {
            this.noteTitleInput.reportValidity();
            this.validationMessage.textContent = this.noteTitleInput.validationMessage;
        }
    }

    resetForm() {
        this.noteTitleInput.value = '';
        this.noteBodyInput.value = '';
        this.validationMessage.textContent = '';
    }
}

customElements.define('note-form', NoteForm);