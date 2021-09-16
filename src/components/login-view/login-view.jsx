import config from '../../config';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './login-view.scss';

export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios.post(`${config.API_URL}/login`, {
      Username: username,
      Password: password
    })
    .then(response => {
      const data = response.data;
      props.onLoggedIn(data);
    })
    .catch(e => {
      console.log('no such user')
    });
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={8}>
        <Form>
        <Form.Group controlId="formUsername">
            <Form.Label className="form-label">Username:</Form.Label>
            <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formPassword">
            <Form.Label className="form-label">Password:</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
        </Button>
        </Form>
      </Col>
    </Row>
  );
}

LoginView.propTypes = {
  register: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }),
  onRegistration: PropTypes.func.isRequired
};
