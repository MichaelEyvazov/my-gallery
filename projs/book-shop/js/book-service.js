'use strict'

var gBooks = [];
var gNextId = 1;
var isAscending = true;


function createBooks() {
    var books = [];
    books.push(creatBook('Grokking Algorithms', 42.74, 'img/books/Grokking_Algorithms.png'));
    books.push(creatBook('Programming Elixir', 38.36, 'img/books/Elixir.png'));
    books.push(creatBook('Go Programming Blueprints', 50.00, 'img/books/Go_Programming.png'));
    return books;
}

function creatBook(name, price, img) {
    return {
        id: gNextId++,
        name: name,
        price: price,
        imgUrl: img,
        rate: 0
    }
}

function findNextId() {
    var max = 0;
    gBooks.forEach(function (book) {
        if (book.id > max) max = book.id;
    })
    return max + 1;
}

function deleteBook(bookId) {
    var bookIdx = findBookById(bookId)
    gBooks.splice(bookIdx, 1);
}

function readAndAddNewBook() {
    clearModalValue();
    $('.modal-title').html('Add New Book');
    $('.saveData').attr('onclick', ' addBook()');
    tooggleModalAndTable();
}

function tooggleModalAndTable() {
    $('.main-modal').toggle();
    $('.books-container').toggle();
}

function addBook() {
    var bookName = $('#book-name').val();
    var bookPrice = $('#book-price').val();

    var newBook = creatBook(bookName, bookPrice, '');
    gBooks.push(newBook);
    tooggleModalAndTable();
    renderBooks();
}

function clearModalValue() {
    $('#book-name').val('');
    $('#book-price').val('');
}

function updateBook(bookId) {
    var bookName = $('#book-name').val();
    var bookPrice = $('#book-price').val();
    gBooks[bookId].price = bookPrice;
    gBooks[bookId].name = bookName;
    tooggleModalAndTable();
    clearModalValue();
    renderBooks();
}

function findBookById(bookId) {
    return gBooks.findIndex(function (book) {
        return bookId === book.id;
    });
}

function readAndUpdateBook(bookId) {
    var bookIdx = findBookById(bookId);
    $('.modal-title').html('Update Book Info');
    $('#book-name').val(gBooks[bookIdx].name);
    $('#book-price').val(gBooks[bookIdx].price);
    $('.saveData').attr("onclick", `updateBook(${bookIdx})`);
    tooggleModalAndTable();
}

function showBookDetails(bookId) {
    var bookIdx = findBookById(bookId);
    $('.books-container').hide();
    
    var book = gBooks[bookIdx];
    var bookImg = book.imgUrl;
    if (bookImg === '') bookImg = 'https://via.placeholder.com/150';
    $('.card-img-top').attr('src', `${bookImg}`);
    $('.card-title').text(`${book.name}`);
    $('.card-text').text(`Price: ${book.price}$`);
    $('.input-group-field').attr('data-id', `${bookIdx}`);
    $('.input-group-field').attr('data-field',`${gBooks[bookIdx].rate}`);
    
}

function updateRate() {
    var elDataId = document.querySelector('.input-group-field');
    var bookId = elDataId.dataset.id;
    var search = $('[data-quantity="plus"]').attr('data-field');
    var currentVal = parseInt($('input[name=' + search + ']').val());
    gBooks[bookId].rate = currentVal;
    $('input[name=' + search + ']').val('0');
}

function sortTableByPrice() {
    if (isAscending) {
        gBooks.sort(function (a, b) {
            return (a.price - b.price);
        });
        isAscending = false;
    } else {
        gBooks.sort(function (a, b) {
            return (b.price - a.price);
        });
        isAscending = true;
    }
    renderBooks();
}

function sortTableByName() {
    gBooks.sort(function (a, b) {
        return (a.name.toLowerCase() - b.name.toLowerCase() ? 1 : -1);
    });
    renderBooks();
}