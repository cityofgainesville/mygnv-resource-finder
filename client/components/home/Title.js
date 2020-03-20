import React, { useState, useEffect } from 'reactn';
import { Alert, Jumbotron } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import '../../css/all.css';
import '../../js//all.js';
import RedirectButton from './RedirectButton';
import paths from '../../RouterPaths';
import CategoryView from './category/CategoryView.js';
import TopLevelCategory from './category/TopLevelCategory.js';
import '../../index.scss';

// Title component, displays blue bar with icon and text

const Homepage = (props) => {
  const [visible, setVisible] = useState(false);

  const handleEntailmentRequest = (e) => {
		e.preventDefault();
		setVisible(!visible);
		console.log(visible);
	
  };


  return (
    <React.Fragment >
        <div class='menu-container' style={{display: !visible ? '' : 'none'}}>
        <Alert
          variant='primary'
          className='menu-gray-bg menu'
        >
          <Row className='justify-content-center menu-title'>
                Menu
          </Row>
          <Row className='justify-content-center'>
            <RedirectButton className='menuButton' path={paths.hotlinesPath} >
              <i class="fal fa-phone" ></i>
              Call a hotline
            </RedirectButton>
          </Row>
          <Row className='justify-content-center'>
            <RedirectButton className='menuButton disabled'>
              <i class="fal fa-hands-heart"></i>
              Locate my nearest safe place
            </RedirectButton>
          </Row>
          <Row className='justify-content-center'>
            <RedirectButton className='menuButton' path={paths.searchPath}>
              <i class="fal fa-search"></i>
              Search for a resource
           </RedirectButton>
          </Row>
            <hr></hr>
          <Row className='justify-content-center menu-title'>
            Categories
          </Row>
          <CategoryView></CategoryView>
          <Row className='justify-content-center' style={{ margin: 'auto' }}>
            <Col xs={11} className='phrase'>
              <div>
                Life can get tough sometimes. We get it. We’re here to help.
                Find resources here.
              </div>
            </Col>
          </Row>
        </Alert>
      <div class="exit-container">
      <button onClick={(e) => handleEntailmentRequest(e)} class='menu-buttons exit' style={{display: !visible ? '' : 'none'}}>
              <i class="fal fa-times fa-2x"  ></i>
  </button>
  
      </div>
      </div>
      <div class="exit-container">
      <button onClick={(e) => handleEntailmentRequest(e)} class='menu-buttons exit' style={{display: visible ? '' : 'none'}}><i class="fal fa-bars"></i></button>
      </div>
    </React.Fragment>
  );
};

export default Homepage;
