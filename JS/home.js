import booksData from "../DATA/books.json" with {type: 'json'}
let count = 10;

function createBook(book) {
    // קריאה מ-LocalStorage
    let booksData = JSON.parse(localStorage.getItem('books') || '[]');

    // הגדרת מזהה ייחודי
    book.id = count++;

    // הוספת הספר למערך
    booksData.push(book);

    // שמירת העדכון ב-LocalStorage
    localStorage.setItem('books', JSON.stringify(booksData));

    console.log("Book added to LocalStorage!");
}

function getBook(id) {
    let booksData = JSON.parse(localStorage.getItem('books'));
    if (booksData) {
        let book = booksData.find(item => item.id === id)
        if (book) {
            return book;
        }
    }
    return ("ERROR: book not faund");
}

function updateBook(book) {
    let booksData = JSON.parse(localStorage.getItem('books'));
    if (booksData) {
        let bookIndex = booksData.findIndex(item => item.id == book.id)
        if (bookIndex != -1) {
            booksData[bookIndex] = book;
            localStorage.setItem('books', JSON.stringify(booksData));
            console.log("Book updated successfully!");
        }
    }
    else {
        console.log("Book not found!");
    }

}

function deleteBook(id) {
    let booksData = JSON.parse(localStorage.getItem('books'));
    if (booksData) {
        let bookIndex = booksData.findIndex(item => item.id == book.id)
        if (bookIndex != -1) {
            booksData.splice(bookIndex,1);
            localStorage.setItem('books', JSON.stringify(booksData));
            console.log("Book delete successfully!");
        }
    }
    else {
        console.log("Book not found!");
    }

}