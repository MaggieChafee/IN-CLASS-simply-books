import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  image: '',
  favorite: false,
};

function AuthorForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  console.warn(setFormInput);
  return (
    <Form>
      <Form.Group className="mb-3" controlId="floatingInput1">
        <Form.Label>Author First Name</Form.Label>
        <Form.Control type="text" placeholder="Author's First Name" name="first_name" value={formInput.first_name} required />

        <Form.Label>Author Last Name</Form.Label>
        <Form.Control type="text" placeholder="Author's First Name" name="last_name" value={formInput.last_name} required />

        <Form.Label>Author Email</Form.Label>
        <Form.Control type="email" placeholder="Author's Email" name="email" value={formInput.email} />

        <Form.Label>Author Image</Form.Label>
        <Form.Control type="text" placeholder="Image URL" name="image" value={formInput.image} />

      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Favorite?" />
      </Form.Group>
      <Button type="submit">{obj.firebaseKey ? 'Update' : 'Create'} Author</Button>
    </Form>
  );
}

AuthorForm.propTypes = {
  obj: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

AuthorForm.defaultProps = {
  obj: initialState,
};

export default AuthorForm();
