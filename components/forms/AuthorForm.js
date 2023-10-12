import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { createAuthor, updateAuthor } from '../../api/authorData';
import { useAuth } from '../../utils/context/authContext';

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  image: '',
  favorite: false,
};

function AuthorForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => (
      {
        ...prevState,
        [name]: value,
      }
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (obj.firebaseKey) {
      updateAuthor(formInput).then(() => router.push(`/authors/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createAuthor(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };

        updateAuthor(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="floatingInput1">
          <Form.Label>Author First Name</Form.Label>
          <Form.Control type="text" placeholder="Author's First Name" name="first_name" value={formInput.first_name} onChange={handleChange} required />

          <Form.Label>Author Last Name</Form.Label>
          <Form.Control type="text" placeholder="Author's First Name" name="last_name" value={formInput.last_name} onChange={handleChange} required />

          <Form.Label>Author Email</Form.Label>
          <Form.Control type="email" placeholder="Author's Email" name="email" value={formInput.email} onChange={handleChange} />

          <Form.Label>Author Image</Form.Label>
          <Form.Control type="text" placeholder="Image URL" name="image" value={formInput.image} onChange={handleChange} />

        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Favorite?"
            name="favorite"
            value={formInput.favorite}
            onChange={(e) => {
              setFormInput((prevState) => ({
                ...prevState,
                favorite: e.target.checked,
              }));
            }}
          />
        </Form.Group>
        <Button type="submit">{obj.firebaseKey ? 'Update' : 'Create'} Author</Button>
      </Form>
    </>
  );
}

AuthorForm.propTypes = {
  obj: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    favorite: PropTypes.bool,
    firebaseKey: PropTypes.string,
  }),
};

AuthorForm.defaultProps = {
  obj: initialState,
};

export default AuthorForm;
