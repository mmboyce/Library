const booksContainer = document.querySelector('#books');
const addBookButton = document.querySelector('#add-book');
const body = document.querySelector('body');

class Book {
  constructor(title, author, pages, hasBeenRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasBeenRead = hasBeenRead;
  }

  toggleRead() {
    this.hasBeenRead = !this.hasBeenRead;
  }

  get title() {
    return this._title;
  }

  get author() {
    return this._author;
  }

  get pages() {
    return this._pages;
  }

  get hasBeenRead() {
    return this._hasBeenRead;
  }

  set title(value) {
    this._title = value;
  }

  set author(value) {
    this._author = value;
  }

  set pages(value) {
    this._pages = value;
  }

  set hasBeenRead(value) {
    this._hasBeenRead = value;
  }
}

const book1 = new Book('IT', 'Stephen King', 1388, false);
const book2 = new Book('Tuesdays with Morrie', 'Mitch Albom', 192, true);
const book3 = new Book('Akira Vol. 1', 'Katsuhiro Otomo', 361, true);
const book4 = new Book('Fire', 'Bryan Konietzko, Michael Dimartino', 21, true);

let myLibrary = [book1, book2, book3, book4];

function isFunction(possiblyAFunction) {
  // since we switched to class syntax, the methods don't start with _
  // but all the properties do :)
  return !(possiblyAFunction.charAt(0) === '_');
}

function toggleAddBookButtonText() {
  const newBook = 'New Book';
  const closeForm = 'Close';

  const buttonText = addBookButton.value;

  addBookButton.value = buttonText === closeForm ? newBook : closeForm;
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function removeBookFromLibrary(book) {
  for (let i = 0; i < myLibrary.length; i += 1) {
    if (book === myLibrary[i]) {
      myLibrary.splice(i, 1);
      return;
    }
  }
}

function createBookElement(book) {
  const list = document.createElement('ul');

  for (attribute in book) {
    if (isFunction(attribute)) {
      // we don't want to list our functions in our book cards
      continue;
    }

    // shave off that pesky underscore from the front of our attribute
    // this is only because i wanted to try making book into a class,
    // it originally was just an object without class syntax
    // sloppy i know.
    const noUnderScoreAttribute = attribute.slice(1);

    const item = document.createElement('li');
    item.className = noUnderScoreAttribute;
    item.innerText = book[attribute];

    if (noUnderScoreAttribute == 'pages') {
      item.innerText += ' pages';
    }

    if (noUnderScoreAttribute == 'hasBeenRead') {
      item.innerText = `${book[attribute] ? 'Has been read.' : 'Has not been read yet.'}`;
    }

    list.appendChild(item);
  }

  const readButton = document.createElement('input');
  readButton.type = 'button';
  readButton.value = 'Toggle Read Status';
  readButton.className = 'read';

  readButton.addEventListener('click', () => {
    book.toggleRead();
    renderLibrary();
  });

  const removeButton = document.createElement('input');
  removeButton.type = 'button';
  removeButton.value = 'Remove Book';
  removeButton.className = 'remove';

  removeButton.addEventListener('click', () => {
    removeBookFromLibrary(book);
    renderLibrary();
  });

  list.appendChild(readButton);
  list.appendChild(removeButton);

  list.className = 'book';

  return list;
}

function createBookForm() {
  const form = document.createElement('div');

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.name = 'title';
  titleInput.id = 'title-input';

  const authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.name = 'author';
  authorInput.id = 'author-input';

  const pagesInput = document.createElement('input');
  pagesInput.type = 'number';
  pagesInput.name = 'pages';
  pagesInput.id = 'pages-input';

  const hasBeenRead = document.createElement('input');
  hasBeenRead.type = 'checkbox';
  hasBeenRead.name = 'hasbeenread';
  hasBeenRead.id = 'hasbeenread-input';

  const submitButton = document.createElement('input');
  submitButton.type = 'button';
  submitButton.value = 'Submit';
  submitButton.className = 'submit';

  submitButton.addEventListener('click', submit);

  form.innerHTML = 'Title:<br>';
  form.appendChild(titleInput);
  form.innerHTML += '<br>Author:<br>';
  form.appendChild(authorInput);
  form.innerHTML += '<br>Number of Pages:<br>';
  form.appendChild(pagesInput);
  form.innerHTML += '<br>Have you Read It?<br>';
  form.appendChild(hasBeenRead);
  form.innerHTML += '<br>';
  form.appendChild(submitButton);

  form.id = 'form';
  return form;
}

function loadBookForm() {
  const toRemove = document.querySelector('#form');

  if (toRemove !== null) {
    // closes the form
    body.removeChild(toRemove);
    toggleAddBookButtonText();
    return;
  }

  const form = createBookForm();
  toggleAddBookButtonText();

  body.appendChild(form);
}

function submit() {
  const form = document.querySelector('#form');

  const title = document.querySelector('#title-input');
  const author = document.querySelector('#author-input');
  const pages = document.querySelector('#pages-input');
  const hasBeenRead = document.querySelector('#hasbeenread-input');

  const titleValue = title.value;
  const authorValue = author.value;
  const pagesValue = pages.value;
  const hasBeenReadValue = hasBeenRead.checked;

  const book = new Book(titleValue, authorValue, pagesValue, hasBeenReadValue);

  addBookToLibrary(book);

  renderLibrary();
  body.removeChild(form);
  toggleAddBookButtonText();
}

function removeBooksFromWindow() {
  const books = booksContainer.querySelectorAll('.book');

  books.forEach((book) => {
    booksContainer.removeChild(book);
  });
}

function renderLibrary() {
  // we call this so that we can rerender all the books without readding
  // the ones already present
  removeBooksFromWindow();

  if (storageAvailable('localStorage')) {
    populateStorage();
  }

  myLibrary.forEach((book) => {
    booksContainer.appendChild(createBookElement(book));
  });
}

// Storage Function
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
    // everything except Firefox
      e.code === 22
            // Firefox
            || e.code === 1014
            // test name field too, because code might not be present
            // everything except Firefox
            || e.name === 'QuotaExceededError'
            // Firefox
            || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
            // acknowledge QuotaExceededError only if there's something already stored
            && (storage && storage.length !== 0);
  }
}

function populateStorage() {
  localStorage.clear();
  localStorage.setItem('stored', 'store');

  for (let i = 0; i < myLibrary.length; i += 1) {
    localStorage.setItem(i, JSON.stringify(myLibrary[i]));
  }
}

if (storageAvailable('localStorage') && localStorage.getItem('stored') !== null) {
  myLibrary = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const item = localStorage.getItem(i);

    if (item !== 'store' && item !== null) {
      myLibrary[i] = JSON.parse(item);
      myLibrary[i].toggleRead = Book.prototype.toggleRead;
    }
  }
}

renderLibrary();

addBookButton.addEventListener('click', loadBookForm);
