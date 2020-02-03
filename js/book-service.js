const KEY = 'books'
const BOOKS_IN_PAGE = 3;

var gCurrPage = 1;
var gFilterBy = 'All';

var gBooks = _createBooks();



function getBooksForDisplay() {
    var from = (gCurrPage - 1) * BOOKS_IN_PAGE;
    var to = from + BOOKS_IN_PAGE;
    return gBooks.slice(from, to);
}

function getBookCount() {
    return gBooks.length
}

function removeBook(bookId) {
    var idx = gBooks.findIndex(function(book) {
        return book.id === bookId
    })
    gBooks.splice(idx, 1);
    saveToStorage(KEY, gBooks);
}

function getBook(bookId) {
    return gBooks.find(book => book.id === bookId)

}

function addBook(vendor) {
    var book = _createBook(vendor);
    gBooks.unshift(book);
    saveToStorage(KEY, gBooks);
}

function updateBook(book) {
    var idx = gBooks.findIndex(currBook => currBook.id === book.id)
    gBooks[idx] = book;
    saveToStorage(KEY, gBooks);
}

function changePage(diff) {
    gCurrPage += diff;
    var lastPage = getLastPage();

    if (gCurrPage > lastPage) gCurrPage = 1;
    else if (gCurrPage < 1) gCurrPage = lastPage;

}

function ChoosePage(pageNum) {
    gCurrPage = pageNum;
}

function getLastPage() {
    return Math.ceil(gBooks.length / BOOKS_IN_PAGE);
}

function getCurrPage() {
    return gCurrPage;
}

function changeRate(diff, bookId) {

    var currBook = gBooks.find(book => {
        return book.id === bookId
    })
    currBook.rating += diff;
    if (currBook.rating > 10) currBook.rating = 10;
    else if (currBook.rating < 0) currBook.rating = 0;
    saveToStorage(KEY, gBooks)
}

function sort(sortBy) {
    if (sortBy === 'name') {
        gBooks.sort((item1, item2) => {
            return item1.name.localeCompare(item2.name);
        })
    } else if (sortBy === 'price')
        gBooks.sort((item1, item2) => item1.price - item2.price)
}

// Private functions:
function _createBooks() {
    var books = loadFromStorage(KEY);
    if (books) return books;
    var books = [
            ['The Catcher in the Rye', 'img/the-catcher-in-the-rye.jpg', 40],
            ['Thinking like a Parrot', 'img/thinking-like-a-parrot.jpg', 20],
            ['The Holocaus:A New History', 'img/the-holocaust-a-new-history.jpg', 10],
            ['Purgatory: The Logic of Total Transformation', 'img/purgatory-the-logic-of-total-transformation.jpg', 25],
            ['The Life and Death of Anne Boleyn', 'img/the-life-and-death-of-anne-boleyn.jpg', 20],
            ['The Greatest Story Ever Told', `img/The-greatest-story-ever-told.jpg`, 1000]
        ]
        .map(_createBook)

    return books;
}

function _createBook([name, imgUrl, price]) {
    return {
        id: parseInt(Math.random() * 1000),
        name: name,
        price: price,
        imgUrl: imgUrl,
        rating: 0
    }
}