import React from 'reactn';
import { Redirect } from 'react-router';
import { Form, FormControl, Container, Row, Col } from 'react-bootstrap';
import RedirectButton from './RedirectButton';
import paths from '../../RouterPaths';
import Search from './Search.js';
import Homepage from './Title';

// Main page component with two buttons for search by category and by name

const MainPage = (props) => {
  return (
    
    <Redirect to="/home/search"></Redirect>
    /*<React.Fragment>
      <Homepage></Homepage>
      <Container
        style={{
          margins: 'auto auto',
          //maxWidth: '60em',
          'z-index': '0',
          padding: '0',
          margin: '0',
          width: '75%',
          float: 'right',
        }}
      >
       <Search></Search>
       <Row className='justify-content-md-center' style={{ margin: 'auto' }}>
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <RedirectButton path={paths.categoryPath}>
              Find a resource by category.
            </RedirectButton>
          </Col>
      </Row>
      </Container>
    </React.Fragment>*/
  );
};

export default MainPage;
