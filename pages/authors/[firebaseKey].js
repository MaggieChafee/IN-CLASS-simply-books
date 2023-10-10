/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getAuthorDetails } from '../../api/mergedData';
import BookCard from '../../components/BookCard';

export default function ViewAuthorSpecifics() {
  const [authorDetails, setAuthorDetails] = useState({});

  const router = useRouter();

  const { firebaseKey } = router.query;

  const getAuthDeats = () => {
    getAuthorDetails(firebaseKey).then(setAuthorDetails);
  };
  console.warn(getAuthDeats);

  useEffect(() => {
    getAuthDeats();
  }, []);

  return (

    <div className="mt-5 d-flex flex-wrap">
      <div className="text-white ms-5 details">
        <h5>
          {authorDetails?.first_name} {authorDetails?.last_name}
        </h5>
        <h4>
          {authorDetails?.favorite ? ' 🤍' : ''}
        </h4>
        Author Email: <a href={`mailto:${authorDetails?.email}`}>{authorDetails?.email}</a>
        <div className="d-flex flex-wrap">
          {authorDetails.books?.map((book) => (
            <BookCard key={book.firebaseKey} bookObj={book} onUpdate={getAuthDeats} />
          ))}
        </div>
      </div>
    </div>
  );
}
