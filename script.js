const booksContainer = document.querySelector("#books")
const addBookButton = document.querySelector("#add-book")
const body = document.querySelector("body")

function Book(title, author, pages, hasBeenRead) {
    this.title = title
    this.author = author
    this.pages = pages
    this.hasBeenRead = hasBeenRead
}

Book.prototype.toggleRead = function () {
    this.hasBeenRead = !this.hasBeenRead
}

const book1 = new Book("IT", "Stephen King", 1388, false)
const book2 = new Book("Tuesdays with Morrie", "Mitch Albom", 192, true)
const book3 = new Book("Akira Vol. 1", "Katsuhiro Otomo", 361, true)
const book4 = new Book("Fire", "Bryan Konietzko, Michael Dimartino", 21, true)

let myLibrary = [book1, book2, book3, book4]

function isFunction(possiblyAFunction) {
    return possiblyAFunction === "toggleRead"
}

function toggleAddBookButtonText() {
    const newBook = "New Book"
    const closeForm = "Close"

    let buttonText = addBookButton.value

    addBookButton.value = buttonText == closeForm ? newBook : closeForm
}

function addBookToLibrary(book) {
    myLibrary.push(book)
}

function removeBookFromLibrary(book) {
    for (let i = 0; i < myLibrary.length; i++) {
        if (book === myLibrary[i]) {
            myLibrary.splice(i, 1)
            return
        }
    }
}

function createBookElement(book) {
    let list = document.createElement("ul")

    for (attribute in book) {

        if (isFunction(attribute)) {
            // we don't want to list our functions in our book cards
            continue
        }

        let item = document.createElement("li")
        item.className = attribute
        item.innerText = book[attribute]

        if (attribute == "pages") {
            item.innerText += " pages"
        }

        if (attribute == "hasBeenRead") {
            item.innerText = `${book[attribute] ? 'Has been read.' : 'Has not been read yet.'}`
        }

        list.appendChild(item)
    }

    let readButton = document.createElement("input")
    readButton.type = "button"
    readButton.value = "Toggle Read Status"
    readButton.className = "read"

    readButton.addEventListener("click", () => {
        book.toggleRead()
        renderLibrary()
    })

    let removeButton = document.createElement("input")
    removeButton.type = "button"
    removeButton.value = "Remove Book"
    removeButton.className = "remove"

    removeButton.addEventListener("click", () => {
        removeBookFromLibrary(book)
        renderLibrary()
    })

    list.appendChild(readButton)
    list.appendChild(removeButton)

    list.className = "book"

    return list
}

function createBookForm() {
    const form = document.createElement("div")

    const titleInput = document.createElement("input")
    titleInput.type = "text"
    titleInput.name = "title"
    titleInput.id = "title-input"

    const authorInput = document.createElement("input")
    authorInput.type = "text"
    authorInput.name = "author"
    authorInput.id = "author-input"

    const pagesInput = document.createElement("input")
    pagesInput.type = "number"
    pagesInput.name = "pages"
    pagesInput.id = "pages-input"

    const hasBeenRead = document.createElement("input")
    hasBeenRead.type = "checkbox"
    hasBeenRead.name = "hasbeenread"
    hasBeenRead.id = "hasbeenread-input"

    const submitButton = document.createElement("input")
    submitButton.type = "button"
    submitButton.value = "Submit"
    submitButton.className = "submit"

    submitButton.addEventListener("click", submit)

    form.innerHTML = "Title:<br>"
    form.appendChild(titleInput)
    form.innerHTML += "<br>Author:<br>"
    form.appendChild(authorInput)
    form.innerHTML += "<br>Number of Pages:<br>"
    form.appendChild(pagesInput)
    form.innerHTML += "<br>Have you Read It?<br>"
    form.appendChild(hasBeenRead)
    form.innerHTML += "<br>"
    form.appendChild(submitButton)

    form.id = "form"
    return form
}

function loadBookForm() {
    const toRemove = document.querySelector("#form")

    if (toRemove !== null) {
        // closes the form 
        body.removeChild(toRemove)
        toggleAddBookButtonText()
        return
    }

    const form = createBookForm()
    toggleAddBookButtonText()

    body.appendChild(form)
}

function submit() {
    const form = document.querySelector("#form")

    const title = document.querySelector("#title-input")
    const author = document.querySelector("#author-input")
    const pages = document.querySelector("#pages-input")
    const hasBeenRead = document.querySelector("#hasbeenread-input")

    const titleValue = title.value
    const authorValue = author.value
    const pagesValue = pages.value
    const hasBeenReadValue = hasBeenRead.checked

    const book = new Book(titleValue, authorValue, pagesValue, hasBeenReadValue)

    addBookToLibrary(book)

    renderLibrary()
    body.removeChild(form)
    toggleAddBookButtonText()
}

function removeBooksFromWindow() {
    let books = booksContainer.querySelectorAll(".book")

    books.forEach(book => {
        booksContainer.removeChild(book)
    })
}

function renderLibrary() {
    // we call this so that we can rerender all the books without readding
    // the ones already present
    removeBooksFromWindow()

    if(storageAvailable('localStorage')){
        populateStorage()
    }

    myLibrary.forEach(book => {
        booksContainer.appendChild(createBookElement(book))
    })
}

// Storage Function
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function populateStorage(){
    localStorage.clear()
    localStorage.setItem("store", "stored")

    for(let i = 0; i < myLibrary.length; i++){
        localStorage.setItem(i, JSON.stringify(myLibrary[i]))
    }
}

if(storageAvailable('localStorage') && localStorage.getItem("store") !== null){
    myLibrary = []

    for(let i = 0; i < localStorage.length; i++){
        let item = localStorage.getItem(i)

        if(item !== "stored" && item !== null){
            myLibrary[i] = JSON.parse(item)
        }
    }
}

renderLibrary()

addBookButton.addEventListener("click", loadBookForm)