import React, { useState, useGlobal } from 'reactn';
import { ListGroup, Container, Row, Col, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ProviderEdit from './ProviderEdit';
import ProviderDelete from './ProviderDelete';

const ProviderAdmin = (props) => {
  const [currentUser] = useGlobal('currentUser');

  const [filterText, setFilterText] = useState('');

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const mapProviders = () => {
    return props.providersAllowedToModify
      .filter(
        (provider) =>
          provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
          provider._id.includes(filterText)
      )
      .map((provider) => {
        return (
          <ListGroup.Item key={provider._id}>
            <ProviderEdit
              providers={props.providersAllowedToModify}
              refreshDataCallback={props.refreshDataCallback}
              buttonName='Edit'
              id={provider._id}
              style={{ marginRight: '0.5em' }}
            />
            {currentUser.role === 'Owner' ? (
              <ProviderDelete
                providers={props.providersAllowedToModify}
                refreshDataCallback={props.refreshDataCallback}
                buttonName='Delete'
                id={provider._id}
              />
            ) : null}
            <h5
              style={{
                color: 'black',
                fontWeight: 'bold',
                display: 'inline',
                paddingLeft: '1em',
              }}
            >
              {provider.name}
            </h5>
          </ListGroup.Item>
        );
      });
  };

  return (
    <Container>
      <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Col>
          <Form style={{ width: '100%' }}>
            {currentUser && currentUser.role === 'Owner' ? (
              <ProviderEdit
                providers={props.providersAllowedToModify}
                refreshDataCallback={props.refreshDataCallback}
                buttonName='Add Provider'
                style={{ marginBottom: '1em' }}
              />
            ) : null}
            <Form.Group controlId='formFilterText'>
              <Form.Label>
                <strong>Filter providers</strong>
              </Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    value={filterText}
                    onChange={handleFilterTextChange}
                    placeholder='Filter categories'
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
          <strong>Providers</strong>
          {mapProviders()}
        </ListGroup>
      </Row>
    </Container>
  );
};

ProviderAdmin.propTypes = {
  providersAllowedToModify: PropTypes.array.isRequired,
  refreshDataCallback: PropTypes.func.isRequired,
};

export default ProviderAdmin;
