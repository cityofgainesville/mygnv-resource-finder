import React, { useState, useGlobal } from 'reactn';
import { ListGroup, Container, Row, Col, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

import UserEdit from './UserEdit';
import UserDelete from './UserDelete';

const UserAdmin = (props) => {
  const [currentUser] = useGlobal('currentUser');

  const [filterText, setFilterText] = useState('');

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const mapUsers = (users) => {
    return users
      .filter((user) => {
        return (
          (user.email &&
            user.email.toLowerCase().includes(filterText.toLowerCase())) ||
          (user.first_name &&
            user.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
          (user.last_name &&
            user.last_name.toLowerCase().includes(filterText.toLowerCase())) ||
          user._id.includes(filterText)
        );
      })
      .map((user) => {
        return (
          <ListGroup.Item key={user._id}>
            <Row lg='auto'>
              <Col md='auto'>
                <UserEdit
                  categories={props.categories}
                  providers={props.providers}
                  users={props.users}
                  refreshDataCallback={props.refreshDataCallback}
                  buttonName='Edit'
                  id={user._id}
                  style={{ marginRight: '0.5em' }}
                />
                <UserDelete
                  categories={props.categories}
                  providers={props.providers}
                  users={props.users}
                  refreshDataCallback={props.refreshDataCallback}
                  buttonName='Delete'
                  id={user._id}
                />
              </Col>
              <Col>
                <Row>
                  <h6>
                    <strong>Email: </strong>
                    {user.email}
                  </h6>
                </Row>
                <Row>
                  <h6>
                    <strong>Name: </strong>
                    {`${user.first_name} ${user.last_name}`}
                  </h6>
                </Row>
                <Row>
                  <h6>
                    <strong>Role: </strong>
                    {user.role}
                  </h6>
                </Row>
              </Col>
            </Row>
          </ListGroup.Item>
        );
      });
  };

  const filterFormElement = (
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
  );

  const renderUsers = () => {
    return (
      <Row>
        <ListGroup
          style={{
            display: 'inline-block',
            margin: '0 auto',
            alignSelf: 'flex-start',
          }}
        >
          <strong>Users</strong>
          <Row>
            <Col xs='auto'>
              <ListGroup>
                {mapUsers(
                  props.users.slice(0, Math.floor(props.users.length / 2))
                )}
              </ListGroup>
            </Col>
            <Col xs='auto'>
              <ListGroup>
                {mapUsers(
                  props.users.slice(
                    Math.floor(props.users.length / 2),
                    props.users.length
                  )
                )}
              </ListGroup>
            </Col>
          </Row>
        </ListGroup>
      </Row>
    );
  };

  // Center the two columns of top level categories and subcategories
  return (
    <Container>
      <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Col>
          <Form style={{ width: '100%' }}>
            {currentUser && currentUser.role === 'Owner' ? (
              <UserEdit
                categories={props.categories}
                providers={props.providers}
                users={props.users}
                refreshDataCallback={props.refreshDataCallback}
                buttonName='Add User'
                style={{ marginBottom: '1em' }}
              />
            ) : null}
            {currentUser && currentUser.role === 'Owner'
              ? filterFormElement
              : null}
          </Form>
        </Col>
      </Row>
      {currentUser && currentUser.role === 'Owner' ? renderUsers() : null}
    </Container>
  );
};

UserAdmin.propTypes = {
  categories: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  refreshDataCallback: PropTypes.func.isRequired,
};

export default UserAdmin;
