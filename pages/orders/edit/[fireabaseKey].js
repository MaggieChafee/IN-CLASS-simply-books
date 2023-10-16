import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleOrder } from '../../../api/orderData';
import OrderForm from '../../../components/forms/OrderForm';

export default function EditOrder() {
  const [editOrderInfo, setEditOrderInfo] = useState({});
  const router = useRouter();

  const { firebaseKey } = router.query;

  useEffect(() => {
    console.warn(firebaseKey);
    getSingleOrder(firebaseKey).then(setEditOrderInfo);
  }, [firebaseKey]);

  return (<OrderForm obj={editOrderInfo} />);
}
