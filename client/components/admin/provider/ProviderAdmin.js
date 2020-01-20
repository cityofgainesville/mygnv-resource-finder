import React, { useState, useEffect, useGlobal } from 'reactn';
import { ListGroup, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import '../../../custom.scss';

import ProviderEdit from './ProviderEdit';
import ProviderDelete from './ProviderDelete';

const CategoryAdmin = (props) => {
  const [currentUser] = useGlobal('currentUser');

  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
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

  const getProvidersAllowedToModify = () => {
    if (!currentUser || !categories || !providers) return [];
    if (currentUser.role === 'Owner') {
      return providers;
    } else {
      const allowedProviders = [];
      const categoryMap = new Map(
        categories.map((category) => [category._id, category])
      );
      const providerMap = new Map(
        providers.map((provider) => [provider._id, provider])
      );
      if (currentUser.role === 'Editor') {
        currentUser.provider_can_edit.forEach((id) => {
          if (!providerMap.has(id)) return;
          allowedProviders.push(providerMap.get(id));
        });

        // for each category in cat_can_edit_provider_in, get all providers and stick in array
        currentUser.cat_can_edit_provider_in.forEach((id) => {
          if (!categoryMap.has(id)) return;
          allowedProviders.push(
            ...categoryMap
              .get(id)
              .providers.filter((id) => providerMap.has(id))
              .map((id) => {
                console.log(id);
                return providerMap.get(id);
              })
          );
        });
      }
      if (
        currentUser.can_edit_assigned_provider &&
        currentUser.assigned_provider &&
        currentUser.assigned_provider !== '' &&
        providerMap.has(currentUser.assigned_provider)
      )
        allowedProviders.push(providerMap.get(currentUser.assigned_provider));

      const removeDuplicates = (array) => {
        return array.filter((a, b) => array.indexOf(a) === b);
      };

      return removeDuplicates(allowedProviders);
    }
  };

  const mapProviders = () => {
    return getProvidersAllowedToModify()
      .filter(
        (provider) =>
          provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
          provider._id.includes(filterText)
      )
      .map((provider) => {
        return (
          <ListGroup.Item key={provider._id}>
            <ProviderEdit
              refreshDataCallback={handleRefreshData}
              categories={categories}
              providers={providers}
              buttonName='Edit'
              id={provider._id}
            />{' '}
            {currentUser.role === 'Owner' ? (
              <ProviderDelete
                providers={providers}
                refreshDataCallback={handleRefreshData}
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
                refreshDataCallback={handleRefreshData}
                providers={providers}
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

export default CategoryAdmin;
