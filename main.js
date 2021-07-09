// test data
let notes = ['Grocery shopping', 'Clean house', 'Do laundry', 'Pay bills', 'Doctor appointment', 'Dinner with friends'];

let swapIndex = -1; // initial placeholder index

function makeNote(content) {
    let note = document.createElement('div');
    note.classList.add('note');

    let noteContainer = document.createElement('div');
    noteContainer.classList.add('note-container');
    note.appendChild(noteContainer);

    let contentContainer = document.createElement('div');
    contentContainer.classList.add('content-container');
    contentContainer.innerText = content;
    noteContainer.appendChild(contentContainer);

    let editBox = document.createElement('input');
    editBox.type = 'text';
    editBox.maxLength = 255;
    editBox.classList.add('edit-box');
    editBox.classList.add('edit-note');
    noteContainer.appendChild(editBox);

    let checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.classList.add('check-box');
    checkBox.addEventListener('click', checkBoxToggle);
    noteContainer.appendChild(checkBox);

    let editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerText = 'Edit';
    editBtn.addEventListener('click', editNote);
    noteContainer.appendChild(editBtn);

    let delBtn = document.createElement('button');
    delBtn.classList.add('delete-btn');
    delBtn.innerText = 'Delete';
    delBtn.addEventListener('click', deleteNote);
    noteContainer.appendChild(delBtn);

    return note;
}

function getData() {
    const noteGrid = document.querySelector('.grid');

    notes.forEach(noteContent => {
        noteGrid.appendChild(makeNote(noteContent));
    });
}

// initial loading of data
getData();

function clearForm() {
    document.getElementById('note-input').value = '';
}

function addNote() {
    const noteGrid = document.querySelector('.grid');

    if (noteGrid.childElementCount < 36) { // max grid size 6x6
        let input = document.getElementById('note-input').value;

        if (input) {
            clearForm();
            notes.push(input);
            noteGrid.appendChild(makeNote(input));
        } else { // no input is entered
            window.alert('Note cannot be blank!');
        }
    } else {
        window.alert('Note grid is full!');
    }
}

const noteInput = document.getElementById('note-input');
noteInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        document.querySelector('.add-btn').click();
    }
});

function deleteGrid(grid) {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}

function findNodeIndex(node) {
    const parent = node.parentNode;
    let index = 0;
    while (parent.children[index] !== node) {
        index++;
    }
    return index;
}

function refreshGrid() {
    const grid = document.querySelector('.grid');
    deleteGrid(grid);

    getData();
}

function checkBoxToggle(event) {
    const noteContainer = event.target.parentNode;
    const nodeIndex = findNodeIndex(noteContainer.parentNode);

    if (swapIndex !== -1) {
        if (swapIndex === nodeIndex) { // only need to unselect
            noteContainer.parentNode.classList.toggle('selected');
        } else { // swap needed
            const temp = notes[nodeIndex];
            notes[nodeIndex] = notes[swapIndex];
            notes[swapIndex] = temp;
            refreshGrid();
        }
        swapIndex = -1; // reset swapIndex
    } else { // first note is selected
        swapIndex = nodeIndex;
        noteContainer.parentNode.classList.toggle('selected');
    }
}

function deleteNote(event) {
    const note = event.target.parentNode;

    notes = notes.filter((elem, index) => {
        return index !== findNodeIndex(note.parentNode);
    });

    refreshGrid();
}

function editNote(event) {
    const note = event.target.parentNode;
    const noteContent = note.firstChild;
    const editInput = note.children[1];
    
    if (!noteContent.classList.contains('edit-note')) { // turn on edit mode
        editInput.value = noteContent.innerText;
        noteContent.classList.toggle('edit-note');
        editInput.classList.toggle('edit-note');
    } else { // change note content and load new data
        if (editInput.value) { // input value is not empty
            notes[findNodeIndex(note.parentNode)] = editInput.value;
            refreshGrid();
        } else { // input value is empty, need to delete note
            deleteNote(event);
        }
    }
}
