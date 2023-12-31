/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Card } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { getBooksNotInOrder, getOrderDetails } from '../../api/mergedData';
import {
  createOrderBook, deleteOrderBook, getSingleOrderBook, updateOrderBook,
} from '../../api/orderBookData';

export default function ViewOrder() {
  const [orderDetails, setOrderDetails] = useState({});
  const [booksNotInOrder, setBooksNotInOrder] = useState([]);
  const { user } = useAuth();

  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    getOrderDetails(firebaseKey).then(setOrderDetails);
    getBooksNotInOrder(user.uid, firebaseKey).then(setBooksNotInOrder);
  }, [orderDetails.orderBooks]);

  const addBookToOrder = (bookFbKey) => {
    const payload = { orderId: orderDetails.firebaseKey, bookId: bookFbKey };

    createOrderBook(payload).then(({ name }) => {
      const patchPayload = { firebaseKey: name };

      updateOrderBook(patchPayload).then(() => router.push(`/orders/${firebaseKey}`));
    });
  };

  const deleteBookFromOrder = (bookId) => {
    getSingleOrderBook(bookId, firebaseKey).then((orderBook) => deleteOrderBook(orderBook.firebaseKey));
  };

  const total = orderDetails.orderBooks?.reduce((prev, next) => prev + +next.price, 0);

  return (
    <>
      <div className="mt-5 d-flex flex-wrap">
        <div className="d-flex flex-column">
          <div className="text-white ms-5 details">
            <h2>{orderDetails.customer_name} {orderDetails.orderType}</h2>
            Order Email: ${orderDetails.email}
          </div>
          <h4>Order Total ${total?.toFixed(2)}</h4>
          <h2>Books In Order</h2>
          { orderDetails.orderBooks?.map((book) => (
            <Card style={{ width: '18rem', margin: '10px' }}>
              <Card.Img variant="top" src={book.image} alt={book.title} style={{ height: '400px' }} />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className="card-text bold">{book.sale && <span>SALE<br /></span> } ${book.price}</p>
                {/* DYNAMIC LINK TO VIEW THE BOOK DETAILS  */}
                <Link href={`/book/${book.firebaseKey}`} passHref>
                  <Button variant="primary" className="m-2">VIEW</Button>
                </Link>
                <Button variant="danger" onClick={() => deleteBookFromOrder(book.firebaseKey)} className="m-2">
                  DELETE
                </Button>
              </Card.Body>
            </Card>
          ))}
          <h3> Add Books to Order</h3>
          { booksNotInOrder.map((book) => (
            <Card>
              <img className="card-img-top" src={book.image} alt={book.title} style={{ height: '80px', width: '80px' }} />
              <div className="card-body">
                <h5 className="card-title">${book.title}</h5>
                <p className="card-text bold">{ book.sale ? `🏷️ Sale $${book.price}` : `$${book.price}` }</p>
              </div>
              <Button onClick={() => addBookToOrder(book.firebaseKey)}> Add Book To Bag</Button>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
