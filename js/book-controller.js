'use strict';

function onInit() {
    renderBooks();
}

function renderBooks() {
    var books = getBooksForDisplay();
    var strHTMLs = books.map(function(book) {
        var className = (book.isDone) ? 'done' : '';
        return `
        <tr class="${className}">
        <td>${book.id}</td>
            <td>${book.name}</td>
            <td> ${book.price} $</td>
            <td><button class="btn btn-read" title="Book Details" onclick="onShowBookDetails(event, ${book.id})">Read</button></td>
            <td><button class="btn btn-update" title="Edit Book" onclick="onEditBook(event, ${book.id})">Update</button></td>
            <td><button class="btn btn-delete" onclick="onRemoveBook(event, ${book.id})">Delete</button></td>
        </tr>`
    })
    var elBookList = document.querySelector('.book-list');
    strHTMLs.unshift(`<th class="th-id" scope="col">Id</th>
        <th class="th-title" onclick="onSort('name')" scope="col">Title</th>
        <th class="th-price" onclick="onSort('price')" scope="col">Price</th>
        <th class="th-actions" scope="col" colspan="3">Actions</th>`)
    elBookList.innerHTML = strHTMLs.join('');
    renderPages()
}

function renderPages() {
    var strHTML = '';
    var lastPage = getLastPage();
    var elPages = document.querySelector('.pages');

    for (var i = 0; i < lastPage; i++) {
        strHTML += `<button class="page-${i+1}" onclick="onChoosePage(${i+1})">${i+1}</button>`
    }
    elPages.innerHTML = strHTML;
    var currPage = getCurrPage();
    var elCurrPage = document.querySelector(`.page-${currPage}`)
    elCurrPage.classList.add('curr-page')
}

function onRemoveBook(event, bookId) {
    event.stopPropagation();
    var isSure = confirm('Are you sure?');
    if (isSure) {
        removeBook(bookId);
        renderBooks();
    }
}

function onEditBook(event, bookId) {

    var book = getBook(bookId);

    var elTxtPrice = document.querySelector('.txt-price');
    elTxtPrice.value = book.price;

    var elTxtName = document.querySelector('.txt-name');
    elTxtName.value = book.name;

    var elTxtImg = document.querySelector('.txt-img');
    elTxtImg.value = book.imgUrl;

    elTxtName.dataset.id = bookId;
    event.stopPropagation();
}

function onSaveBook() {
    console.log('onSaveBook');
    var elTxtName = document.querySelector('.txt-name');
    var elTxtPrice = document.querySelector('.txt-price');
    var elTxtImg = document.querySelector('.txt-img');
    var name = elTxtName.value;
    var price = elTxtPrice.value;
    var img = elTxtImg.value
    if (!name || !price) return;

    var bookId = +elTxtName.dataset.id;
    if (bookId) {
        var book = getBook(bookId);
        book.name = name;
        book.price = price;
        book.imgUrl = img;
        updateBook(book)
    } else {
        addBook([name, img, price])
    }

    elTxtName.value = '';
    elTxtName.dataset.id = '';
    elTxtPrice.value = '';
    renderBooks();
}

function onShowBookDetails(event, bookId) {
    var book = getBook(bookId);
    var elModal = document.querySelector('.modal');
    elModal.querySelector('h2').dataset.id = book.id;
    elModal.querySelector('h3').innerText = book.name;
    elModal.querySelector('h4').innerText = `${book.price}$`;
    elModal.querySelector('img').src = book.imgUrl;
    elModal.querySelector('h5').innerText = book.rating;
    elModal.hidden = false;
}

function onCloseModal() {
    document.querySelector('.modal').hidden = true;
}

function onSort(sortBy) {
    sort(sortBy)
    renderBooks()
}

function onChangePage(diff) {
    changePage(diff)
    renderBooks();
}

function onChoosePage(pageNum) {
    ChoosePage(pageNum);
    renderBooks();
}

function onChangeRate(diff) {
    var bookId = +document.querySelector('.modal h2').dataset.id
    changeRate(diff, bookId)
    var book = getBook(bookId);
    document.querySelector('.modal h5').innerText = book.rating
}