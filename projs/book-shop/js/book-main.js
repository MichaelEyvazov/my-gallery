'use strict'

function init() {
    $('.main-modal').hide();
    hideBookDetailsModal();
    gBooks = createBooks();
    renderBooks();
}

function renderBooks() {
    var elBookTableBody = $('.tbody-container');
    var strHTML = '';
    gBooks.forEach(function (book) {
        strHTML += `<tr>
                        <th scope="row">${book.id}</th>
                        <td>${book.name}</td>
                        <td>${book.price}$</td>
                        <td><button type='button' class='btn btn-primary'
                         onclick='onReadBookInfo(${book.id})'>Read</button></td>
                        <td><button type='button' class='btn btn-warning'
                        onclick='readAndUpdateBook(${book.id})'>Update</button></td>
                        <td><button type='button' class='btn btn-danger' 
                        onclick='onDeleteBook(${book.id})' >Delete</button></td>
                    </tr>`;
    });
    elBookTableBody.html(strHTML);
}

function onReadBookInfo(bookId) {
    showBookDetails(bookId);
    $('.book-details').show();
}
 
function onDeleteBook(bookId) {
    deleteBook(bookId);
    renderBooks();
}

function hideBookDetailsModal() {
    $('.book-details').hide();
    $('.books-container').show();
}