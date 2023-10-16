import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { createOrder, updateOrder } from '../../api/orderData';

const initialState = {
  customer_name: '',
  orderType: '',
  email: '',
};

function OrderForm({ orderObj }) {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState({ ...initialState, uid: user.uid });
  const router = useRouter();

  useEffect(() => {
    if (orderObj.firebaseKey) setFormInput(orderObj);
  }, [orderObj]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (orderObj.firebaseKey) {
      updateOrder(formInput).then(() => router.push(`/orders/${orderObj.firebaseKey}`));
    } else {
      const payload = { ...formInput, dateCreated: new Date() };
      createOrder(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateOrder(patchPayload).then(() => router.push('/order'));
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="floatingInput1">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control type="text" placeholder="Customer's Name" name="customer_name" value={formInput.customer_name} onChange={handleChange} required />

          <Form.Label>Customer Email</Form.Label>
          <Form.Control type="email" placeholder="Customer's Email" name="email" value={formInput.email} onChange={handleChange} />

          <Form.Label>Order Type</Form.Label>
          <Form.Control type="text" placeholder="In Person or Online?" name="orderType" value={formInput.orderType} onChange={handleChange} />
        </Form.Group>
        <Button type="submit">{orderObj.firebaseKey ? 'Update' : 'Create'} Order</Button>
      </Form>
    </>
  );
}

OrderForm.propTypes = {
  orderObj: PropTypes.shape({
    customer_name: PropTypes.string,
    orderType: PropTypes.string,
    email: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

OrderForm.defaultProps = {
  orderObj: initialState,
};

export default OrderForm;
