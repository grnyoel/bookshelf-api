const { nanoid } = require("nanoid");
const booksList = require('./books');

const addNewBookHandler = (request, h) => {
    let { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    let bookId = nanoid(10);
    let isFinished = readPage === pageCount;
    let createdAt = new Date().toISOString();
    let updatedAt = createdAt;

    let newBook = {
        id: bookId,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: isFinished,
        reading,
        insertedAt: createdAt,
        updatedAt,
    };

    if (!newBook.name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }

    if (newBook.readPage > newBook.pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    booksList.push(newBook);
    const isSuccess = booksList.some(book => book.id === bookId);

    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: { bookId },
        }).code(201);
    }

    return h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    }).code(500);
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = booksList;

    if (name) {
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading != null) {
        filteredBooks = filteredBooks.filter(book => book.reading === (reading === '1'));
    }

    if (finished != null) {
        filteredBooks = filteredBooks.filter(book => book.finished === (finished === '1'));
    }

    return h.response({
        status: 'success',
        data: {
            books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }))
        }
    });
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = booksList.find(b => b.id === id);

    if (book) {
        return {
            status: 'success',
            data: { book }
        };
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    }).code(404);
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = booksList.findIndex(book => book.id === id);

    if (index !== -1) {
        if (!name) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            }).code(400);
        }

        if (readPage > pageCount) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            }).code(400);
        }

        booksList[index] = { ...booksList[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt };

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = booksList.findIndex(book => book.id === id);

    if (index !== -1) {
        booksList.splice(index, 1);
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
};

module.exports = { addNewBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };