import React, { useState, useEffect } from 'reactn';
import { ListGroup, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import UserEdit from './UserEdit';
import UserDelete from './UserDelete';
import UserRegister from './UserRegister';

const UserAdmin = (props) => {
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState('');

  const getData = () => {
    axios
      .get('/api/categories/list')
      .then((res) => {
        setCategories(Object.values(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get('/api/providers/list')
      .then((res) => {
        setProviders(Object.values(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get('/api/users/list')
      .then((res) => {
        setUsers(Object.values(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleRefreshData = () => {
    getData();
  };

  const mapUsers = () => {
    return users.map((user) => {
      return (
        <ListGroup.Item key={user._id}>
          <UserEdit
            refreshDataCallback={handleRefreshData}
            categories={categories}
            providers={providers}
            buttonName='Edit'
            id={user._id}
          />{' '}
          <UserDelete
            categories={user}
            refreshDataCallback={handleRefreshData}
            id={user._id}
          />
          <h5
            style={{
              color: 'black',
              fontWeight: 'bold',
              display: 'inline',
              paddingLeft: '2em',
            }}
          >
            {`${user.email}`}
          </h5>
        </ListGroup.Item>
      );
    });
  };

  // Center the two columns of top level categories and subcategories
  return (
    <Container>
      <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Col>
          <Form style={{ width: '100%' }}>
            <UserRegister
              refreshDataCallback={handleRefreshData}
              categories={categories}
              providers={providers}
              buttonName='Add User'
              style={{ marginBottom: '1em' }}
            />
            <Form.Group controlId='formFilterText'>
              <Form.Label>
                <strong>Filter users</strong>
              </Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    value={filterText}
                    onChange={handleFilterTextChange}
                    placeholder='Filter users'
                  />
                </Col>
                <Col sm='auto'>
                  <Row
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  ></Row>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <ListGroup
          style={{
            display: 'inline-block',
            margin: '0 auto',
            alignSelf: 'flex-start',
          }}
        >
          <strong>Users</strong>
          {mapUsers()}
        </ListGroup>
      </Row>
    </Container>
  );
};

export default UserAdmin;
