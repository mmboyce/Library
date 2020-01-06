const booksContainer = document.querySelector("#books")
const addBookButton = document.querySelector("#add-book")

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
    console.log("clicked")
})