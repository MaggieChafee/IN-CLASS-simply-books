import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { deleteOrder } from '../api/orderData';

function OrderCard({ orderObj, onUpdate }) {
  const deleteAnOrder = () => {
    if (window.confirm(`Do you want to delete order by ${orderObj.customer_name}?`)) {
      deleteOrder(orderObj.firebaseKey).then(() => (onUpdate));
    }
  };

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{orderObj.customer_name}</Card.Title>
        <Card.Text>{orderObj.dateCreated}</Card.Text>
        <Link href={`/orders/${orderObj.firebaseKey}`} passHref>
          <Button variant="info">Add Items to Order</Button>
        </Link>
        <Link href={`/orders/edit/${orderObj.firebaseKey}`} passHref>
          <Button variant="info">EDIT Order Information</Button>
        </Link>
        <Button variant="danger" onClick={deleteAnOrder} className="m-2">
          DELETE
        </Button>
      </Card.Body>
    </Card>
  );
}

OrderCard.propTypes = {
  orderObj: PropTypes.shape({
    customer_name: PropTypes.string,
    orderType: PropTypes.string,
    email: PropTypes.string,
    firebaseKey: PropTypes.string,
    dateCreated: PropTypes.number,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default OrderCard;
