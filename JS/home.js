import Data from "../DATA/books.json" with {type: 'json'};


function createBook(book) {
    // קריאה מ-LocalStorage
    let booksData = JSON.parse(localStorage.getItem('books') || '[]');
    let count = localStorage.getItem("count");
    // הגדרת מזהה ייחודי
    book.id = count++;
    localStorage.setItem("count", count);
    console.log(count, "addbook");
    
    // הוספת הספר למערך
    booksData.push(book);

    // שמירת העדכון ב-LocalStorage
    localStorage.setItem('books', JSON.stringify(booksData));

    console.log("Book added to LocalStorage!");
    presentingBooks();
}

function getBook(id) {
    let booksData = JSON.parse(localStorage.getItem('books'));

    if (booksData) {
        let book = booksData.find(item => item.id == id)

        if (book) {
            return book;
        }
    }
    console.log("ERROR: book not faund");
}

function getAllBooks() {
    const booksData = localStorage.getItem('books');
    return booksData ? JSON.parse(booksData) : [];
}

function updateBook(book) {
    console.log("updateBook", book);
    
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
    console.log("deleteBook", booksData);

    if (booksData) {
        let books = booksData.filter(book => book.id != id);
        console.log(books, "filter");

        localStorage.setItem('books', JSON.stringify(books));
        console.log("Book delete successfully!");
        presentingBooks();
    }
    else {
        console.log("Book not found!");
    }
}

function start() {
    if (!localStorage.getItem("books")) {
        localStorage.setItem('books', JSON.stringify(Data.books));
    }
    const booksContainer = document.getElementById("booksContainer");
    booksContainer.addEventListener('click', (event) => {
        // אם נלחץ כפתור מחיקה
        if (event.target.classList.contains('bookDelete')) {
            console.log("Delete Event", event.target.parentElement.parentElement.id);
            deleteBook(event.target.parentElement.parentElement.id);
        }
        //אם נלחץ כפתור עדכון
        if (event.target.classList.contains('bookUpdate')) {
            console.log("Update Event", event.target.parentElement.parentElement.id);
            showUpdateBook(event.target.parentElement.parentElement.id);
        }
        //אם נלחץ כפתור קריאה
        if (event.target.classList.contains('bookRead')) {
            console.log("Read Event", event.target.parentElement.parentElement.id);
            showBookDetails(event.target.parentElement.parentElement.id);

        }
    }
    );
    if(!localStorage.getItem("count")){
        localStorage.setItem("count", 11);
    }
    const addBookButton = document.getElementById("addBookButton");
    addBookButton.addEventListener("click", showAddBook);
    document.getElementById("showAddBook").style.display = 'none';
    document.getElementById("showUpdateBook").style.display = 'none';
    document.getElementById("showBookDetails").style.display = 'none';
    //הצגת ספרים
    presentingBooks("id");
}

function presentingBooks(orderBy) {
    let books = getAllBooks();
    //מיון על פי פרמטר
    books = orderBy === "price" 
    ? books.sort((a, b) => a.price - b.price) 
    : (orderBy === "title" 
        ? books.sort((a, b) => a.title.localeCompare(b.title)) 
        : books);
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
                    <th>ID   <button id="orderById">▲<button/></th>
                    <th>Title   <button id="orderByTitle">▲<button/></th>
                    <th>Price   <button id="orderByPrice">▲<button/></th>
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
                <td><button class="bookRead">Read</button></td>
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

    document.getElementById("orderById").addEventListener('click', function() {
        presentingBooks("id");
    });
    document.getElementById("orderByPrice").addEventListener('click', function() {
        presentingBooks("price");
    });
    document.getElementById("orderByTitle").addEventListener('click', function() {
        presentingBooks("title");
    });

}

function showBookDetails(bookId) {
    document.getElementById("showAddBook").style.display = 'none';
    document.getElementById("showUpdateBook").style.display = 'none';
    document.getElementById("showBookDetails").style.display = '';

    console.log("bookID", bookId);

    let book = getBook(bookId);
    const showBook = document.getElementById("showBookDetails");
    showBook.innerHTML = `
    <div class="showWindow">book datils</div>
    <div><img src="${book.imageURL}" alt="${book.title}"/></div>
    <div>
        <p>price:   ${book.price}</p>
        <p>    rate:   <button id="subRatingChange">-</button>   ${book.rate}  <button id="addRatingChange">+</button></p>
    </div>
    `;

    document.getElementById("addRatingChange").addEventListener('click', function() {
        addRatingChange(book.id);
    });

    document.getElementById("subRatingChange").addEventListener('click', function() {
        subRatingChange(book.id);
    });
}

function showAddBook() {
    document.getElementById("showAddBook").style.display = '';
    document.getElementById("showUpdateBook").style.display = 'none';
    document.getElementById("showBookDetails").style.display = 'none';

    // תחילה נמצא את הטופס
    const form = document.getElementById('formAddBook');

    // הוספת מאזין לאירוע 'submit'
    form.addEventListener('submit', function (event) {
        // מונע את התנהגות ברירת המחדל של הטופס (רענון עמוד)
        event.preventDefault();

        // מקבל את הנתונים מהשדות בטופס
        const title = document.getElementById("addTitle").value;
        const rate = document.getElementById("addRate").value;
        const price = document.getElementById("addPrice").value;
        const imageURL = document.getElementById("addImageURL").value;
        //מרוקן את השדות
        document.getElementById("addTitle").value = "";
        document.getElementById("addRate").value = "";
        document.getElementById("addPrice").value = "";
        document.getElementById("addImageURL").value = "";

        let book = {
            "id": 0,
            "title": title,
            "price": price,
            "rate": rate,
            "imageURL": imageURL
        };

        // כאן אפשר להוסיף לוגיקה נוספת כדי להשתמש בנתונים, כמו להוסיף ספר חדש
        createBook(book);
    });

}

function showUpdateBook(id) {
    document.getElementById("showAddBook").style.display = 'none';
    document.getElementById("showUpdateBook").style.display = '';
    document.getElementById("showBookDetails").style.display = 'none';

    let book = getBook(id);
    const showUpdateBook = document.getElementById("showUpdateBook");
    console.log("show update", book);
    
    showUpdateBook.innerHTML = `
        <form id="formUpdateBook"> Update Book:
            <label> Title:
                <input id="updateTitle" type="text" value="${book.title}">
            </label>
            <label> Price:
                <input id="updatePrice" type="number" value="${book.price}">
            </label>
            <label> Rate:
                <input id="updateRate" min="1" max="10" type="number" value="${book.rate}">
            </label>
            <label> Image URL:
                <input id="updateImageURL" type="file" value="${book.imageURL}">
            </label>
            <input type="submit" value="Update">
        </form>
    `;

    const form = document.getElementById('formUpdateBook');

    // הוספת מאזין לאירוע 'submit'
    form.addEventListener('submit', function (event) {
        // מונע את התנהגות ברירת המחדל של הטופס (רענון עמוד)
        event.preventDefault();

        // מקבל את הנתונים מהשדות בטופס
        const title = document.getElementById("updateTitle").value;
        const price = document.getElementById("updatePrice").value;
        const rate = document.getElementById("updateRate").value;
        let imageURL = document.getElementById("updateImageURL").value; // מקבל קובץ
        if(imageURL == ''){
            imageURL = book.imageURL;
        }

        document.getElementById('updateTitle').value = "";
        document.getElementById('updatePrice').value = "";
        document.getElementById("updateRate").value = "";
        document.getElementById("updateImageURL").value = ""; // מתייחס לערך כאל טקסט

        // יצירת אובייקט ספר מעודכן
        let newBook = {
            "id": id,
            "title": title,
            "price": price,
            "rate": rate, // אפשר להשתמש בערך המקורי
            "imageURL": imageURL
        };

        // קריאה לפונקציה שמעדכנת את הספר
        updateBook(newBook);
    });
}

function addRatingChange(id){
    let book = getBook(id);
    console.log("addRatingChange",id, book);
    
    if(book.rate < 10)
        book.rate += 1;
    updateBook(book);
    showBookDetails(id);
}

function subRatingChange(id){
    let book = getBook(id);
    if(book.rate > 1)
        book.rate -= 1;
    updateBook(book);
    showBookDetails(id);

}

start();
