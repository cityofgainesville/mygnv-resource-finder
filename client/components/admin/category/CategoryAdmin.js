import React, { useState, useEffect } from 'reactn';
import { ListGroup, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import CategoryEdit from './CategoryEdit';
import CategoryDelete from './CategoryDelete';

// This component creates an admin view
// With filtering for adding, modifying, and
// deleting categories and subcategories

const CategoryAdmin = (props) => {
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

  const mapCategories = (categoriesToMap) => {
    return categoriesToMap.map((category) => {
      return (
        <ListGroup.Item key={category._id}>
          <CategoryEdit
            refreshDataCallback={handleRefreshData}
            categories={categories}
            providers={providers}
            buttonName='Edit'
            id={category._id}
          />{' '}
          <CategoryDelete
            categories={categories}
            refreshDataCallback={handleRefreshData}
            id={category._id}
          />
          <h5
            style={{
              color: 'black',
              fontWeight: 'bold',
              display: 'inline',
              paddingLeft: '2em',
            }}
          >
            {category.name}
          </h5>
        </ListGroup.Item>
      );
    });
  };

  const topLevelCategories = mapCategories(
    categories.filter((category) => {
      return (
        !category.is_subcategory &&
        category.name.toLowerCase().includes(filterText.toLowerCase())
      );
    })
  );

  const subcategories = mapCategories(
    categories.filter((category) => {
      return (
        category.is_subcategory &&
        category.name.toLowerCase().includes(filterText.toLowerCase())
      );
    })
  );

  // Center the two columns of top level categories and subcategories
  return (
    <Container>
      <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Col>
          <Form style={{ width: '100%' }}>
            <CategoryEdit
              refreshDataCallback={handleRefreshData}
              categories={categories}
              providers={providers}
              buttonName='Add Category'
              style={{ marginBottom: '1em' }}
            />
            <Form.Group controlId='formFilterText'>
              <Form.Label>
                <strong>Filter categories</strong>
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
          <strong>Top Level Categories</strong>
          {topLevelCategories}
        </ListGroup>
        <ListGroup
          style={{
            display: 'inline-block',
            margin: '0 auto',
            alignSelf: 'flex-start',
          }}
        >
          <strong>Subcategories</strong>
          {subcategories}
        </ListGroup>
      </Row>
    </Container>
  );
};

export default CategoryAdmin;
