import React, { useState, useEffect } from 'reactn';
import { Alert, Jumbotron} from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import RedirectButton from './RedirectButton';
import paths from '../../RouterPaths';
import CategoryView from './category/CategoryView.js';
import TopLevelCategory from './category/TopLevelCategory.js';
import '../../index.scss';
import './Search.scss';

// Title component, displays blue bar with icon and text

const Homepage = (props) => {
  const [visible, setVisible] = useState(false);
  const [hotline, setHotline] = useState("");
  const [search, setSearch] = useState("");

  const handleEntailmentRequest = (e) => {
		e.preventDefault();
		setVisible(!visible);
		console.log(visible);
	
  };

  const handleClick = (e) => {
    e.preventDefault()
}


  return (
    <React.Fragment >
        <div class='menu-container' >
        <Alert
          variant='primary'
          className='menu scroll'
        >
          <Row className='justify-content-center menu-title title-title top-title'>
                All Resources
          </Row>
         
          {/*<Row className='justify-content-center'>
          <NavLink to={paths.safeplacesPath} onClick={(e)=>handleClick(e)} className='menuButton disabled' activeClassName='navbar-active active'>
                    <i class="fal fa-hands-heart"></i>
                        Locate my nearest safe place
          </NavLink>
            <RedirectButton className='menuButton disabled'>
              <i class="far fa-hands-heart"  ></i>
              <span className="menu-name">Locate my nearest safe place</span>
          </RedirectButton>
          </Row>*/}
          <Row className='justify-content-center'>
          {/*<NavLink to={paths.searchPath} className='menuButton' activeClassName='navbar-active active'>
          <i class="fal fa-search"></i>
              Search for a resource
</NavLink>*/}
            <RedirectButton className='menuButton' path={paths.searchPath}  active={search}>
              <i class="far fa-search"  ></i>
              <span className="menu-name">Search for a resource</span>
          </RedirectButton>
          </Row>
            
          <Row className='justify-content-center menu-title title-title'>
            Browse by Category
          </Row>
          <CategoryView></CategoryView>
          <hr></hr>
          <Row className='justify-content-center'>
            {/*<NavLink to={paths.hotlinesPath} className='menuButton' activeClassName='navbar-active active'>
            <i class="fal fa-phone" ></i>
              Call a hotline
  </NavLink>*/}

            <RedirectButton className='menuButton menu-hotline' path={paths.hotlinesPath} active={hotline} >
              <i class="far fa-phone" ></i>
              <span className="menu-name">Call a hotline</span>
              </RedirectButton>
          </Row>
          <Row className='justify-content-center' style={{ margin: 'auto' }}>
            <Col xs={11} className='phrase'>
              <div>
              Spot something wrong or want to add a new resource? Let us know!
              </div>
              <Button className='title-links top-link' variant="link" href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_74157YeIb6ttlYx' target='_blank'>Feedback</Button>
              <Button className='title-links'  variant="link" href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_bNMcXknvBcVfxoV' target='_blank'>Add a Resource</Button>
            </Col>
          </Row>
        </Alert>
        </div>
      {/*<div class="exit-container">
      <button onClick={(e) => handleEntailmentRequest(e)} class='menu-buttons exit' style={{display: !visible ? '' : 'none'}}>
              <i class="fal fa-times fa-2x"  ></i>
  </button>
  
      </div>
      </div>
      <div class="exit-container">
      <button onClick={(e) => handleEntailmentRequest(e)} class='menu-buttons exit' style={{display: visible ? '' : 'none'}}><i class="fal fa-bars"></i></button>
</div>*/}
    </React.Fragment>
  );
};

export default Homepage;
