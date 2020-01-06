const booksContainer = document.querySelector("#books")
const addBookButton = document.querySelector("#add-book")
const body = document.querySelector("body")

function Book(title, author, pages, hasBeenRead){
    this.title = title
    this.author = author
    this.pages = pages
    this.hasBeenRead = hasBeenRead
}

const book1 = new Book("IT", "Stephen King", 1388, false)
const book2 = new Book("Tuesdays with Morrie", "Mitch Albom", 192, true)

let myLibrary = [book1, book2]

function addBookToLibrary(book){
    myLibrary.push(book)
}

function createBookElement(book){
    let list = document.createElement("ul")

    for(attribute in book){
        let item = document.createElement("li")
        item.className = attribute
        item.innerText = book[attribute]

        if(attribute == "pages"){
            item.innerText += " pages"
        }

        if(attribute == "hasBeenRead"){
            item.innerText = `${book[attribute] ? 'Has been read.' : 'Has not been read yet.'}`
        }

        list.appendChild(item)
    }

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
    const form = createBookForm()
    
    body.appendChild(form)
}

function submit(){
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
}

function removeBooksFromWindow(){
    let books = booksContainer.querySelectorAll(".book")

    books.forEach(book => {
        booksContainer.removeChild(book)
    })
}

function renderLibrary(){
    // we call this so that we can rerender all the books without readding
    // the ones already present
    removeBooksFromWindow()

    myLibrary.forEach(book => {
        booksContainer.appendChild(createBookElement(book))
    })
}


renderLibrary()

addBookButton.addEventListener("click", () => {
    loadBookForm()
})