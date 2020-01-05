function Book(title, author, pages, hasBeenRead){
    this.title = title
    this.author = author
    this.pages = pages
    this.hasBeenRead = hasBeenRead
}

Book.prototype.info = function(){
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.hasBeenRead ? 'not read yet' : 'has been read'}`
}

const book1 = new Book("IT", "Stephen King", 1388, false)
const book2 = new Book("Tuesdays with Morrie", "Mitch Albom", 192, true)

let myLibrary = [book1, book2]

function addBookToLibrary(book){
    myLibrary.push(book)
}