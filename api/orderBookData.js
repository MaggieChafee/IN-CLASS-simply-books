import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getOrderBooks = (orderId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orderBooks.json?orderBy="orderId"&equalTo="${orderId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});

const createOrderBook = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orderBooks.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const updateOrderBook = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orderBooks/${payload.firebaseKey}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const getSingleOrderBook = async (bookId, orderId) => {
  const allOrderBooks = await getOrderBooks(orderId);
  const singleOrderBook = await allOrderBooks.find((book) => book.bookId === bookId);
  return singleOrderBook;
};

const deleteOrderBook = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orderBooks/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

export {
  getOrderBooks,
  createOrderBook,
  updateOrderBook,
  getSingleOrderBook,
  deleteOrderBook,
};
