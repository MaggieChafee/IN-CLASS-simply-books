import { getAuthorBooks, getSingleAuthor, deleteSingleAuthor } from './authorData';
import { getSingleBook, deleteBook, getBooks } from './bookData';
import { getOrderBooks } from './orderBookData';
import { getSingleOrder } from './orderData';

const viewBookDetails = (bookFirebaseKey) => new Promise((resolve, reject) => {
  getSingleBook(bookFirebaseKey)
    .then((bookObject) => {
      getSingleAuthor(bookObject.author_id)
        .then((authorObject) => {
          resolve({ authorObject, ...bookObject });
        });
    }).catch((error) => reject(error));
});

const viewAuthorDetails = (authorFirebaseKey) => new Promise((resolve, reject) => {
  Promise.all([getSingleAuthor(authorFirebaseKey), getAuthorBooks(authorFirebaseKey)])
    .then(([authorObject, authorBooksArray]) => {
      resolve({ ...authorObject, books: authorBooksArray });
    }).catch((error) => reject(error));
});

const getAuthorDetails = async (firebaseKey) => {
  const author = await getSingleAuthor(firebaseKey);
  const books = await getAuthorBooks(author.firebaseKey);

  return { ...author, books };
};

const deleteAuthorBooks = (firebaseKey) => new Promise((resolve, reject) => {
  getAuthorBooks(firebaseKey).then((booksArray) => {
    const deleteBookPromises = booksArray.map((book) => deleteBook(book.firebaseKey));

    Promise.all(deleteBookPromises).then(() => {
      deleteSingleAuthor(firebaseKey).then(resolve);
    });
  }).catch((error) => reject(error));
});

const getOrderDetails = async (orderId) => {
  const order = await getSingleOrder(orderId);
  const allOrderBooks = await getOrderBooks(orderId);
  const getSingleBooks = await allOrderBooks.map((orderBook) => getSingleBook(orderBook.bookId));
  const orderBooks = await Promise.all(getSingleBooks);
  return { ...order, orderBooks };
};

const getBooksNotInOrder = async (uid, orderId) => {
  // Gets all the Books
  const allBooks = await getBooks(uid);

  // Get all the orderBooks related to the order
  const orderBooks = await getOrderBooks(orderId);

  // Get the books found in the order books and returns an array of promises
  const bookPromises = await orderBooks.map((orderBook) => getSingleBook(orderBook.bookId));

  // using Promise.all to return each book as an object
  const books = await Promise.all(bookPromises);

  // filter and compare the two arrays of all books and all orderBooks
  const filterBooks = await allBooks.filter((obj) => !books.some((e) => e.firebaseKey === obj.firebaseKey));

  return filterBooks;
};

export {
  viewBookDetails, viewAuthorDetails, deleteAuthorBooks, getAuthorDetails, getOrderDetails, getBooksNotInOrder,
};
