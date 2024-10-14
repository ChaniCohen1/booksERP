import Data from "../DATA/books.json" with {type: 'json'}
let count = 10;

console.log(Data);


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

function getAllBooks() {
    const booksData = localStorage.getItem('books');
    return booksData ? JSON.parse(booksData) : []; }

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

function start(){
    if(!localStorage.getItem("books")){
        localStorage.setItem('books', JSON.stringify(Data.books));
    }
}

function presentingBooks() {
    let books = getAllBooks();
    console.log("books: ", books);
    const booksContainer = document.getElementById("booksContainer");
    if (!Array.isArray(books)) {
        console.error("books is not an array:", books);
        return;
    }
    // ניצור את המבנה של הטבלה
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Read</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
    `;

    // כל ספר יהיה שורה בטבלה
    books.forEach(book => {
        tableHTML += `
            <tr id="${book.id}">
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.price}</td>
                <td><button on class="bookRead">Read</button></td>
                <td><button class="bookUpdate">Update</button></td>
                <td><button class="bookDelete">Delete</button></td>
            </tr>
        `;
    });

    // נסגור את ה-tbody וה-table
    tableHTML += `
            </tbody>
        </table>
    `;

    // נכניס את הטבלה לאלמנט ה-booksContainer
    booksContainer.innerHTML = tableHTML;
}


function showBookDetails(bookId) {
    let book = getBook(bookId);
    const showBook = document.getElementById("showBookDetails");
    showBook.innerHTML = `
    <div></div>
    <div><img src="${book.imageURL}" alt="${book.title}"/></div>
    <div></div>

    
    
    `;


}

start();
presentingBooks();