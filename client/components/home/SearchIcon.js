//import React from 'reactn';
import React, { useState, useEffect } from 'reactn';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Form, FormControl, Container, Row, Col,  ListGroup, InputGroup, Button } from 'react-bootstrap';
import mygnvIcon from '../../images/mygnv.png';
import accrgIcon from '../../images/accrg.png';
import './NavBar.scss';
import './SearchIcon.scss';
import ciseIcon from '../../images/cise.png';
import cogIcon from '../../images/cog.png' ;
import designgnvIcon from '../../images/designgnv.png';
import mocIcon from '../../images/moc.png';
import RedirectButton from './RedirectButton';
import CategoryView from './category/CategoryView.js';
import paths from '../../RouterPaths';
import homeIcon from '../../images/myGNVrf.png';
import Search from './Search.js';
import Homepage from './Title';

// Main page component with two buttons for search by category and by name

const SearchIcon = (props) => {
  const [myStyle, setStyle] = useState ({borderColor: 'default'});
  const [myZipStyle, setZipStyle] = useState ({borderColor: 'default'});
  const [filterText, setFilterText] = useState('');
  const [filterZipText, setFilterZipText] = useState('');
  const handleFocusRequest = (e) => {
    e.preventDefault();
    setStyle({border: '3px solid #007bff40'});
    console.log(myStyle);
}

const doRedirect = () => {

    props.history.push(`${paths.providerPath}/?name=${filterText}&zip=${filterZipText}&age=`);
};
const handleFilterChange = (event) => {
  setFilterText(event.target.value);
};
const handleFilterZipChange = (event) => {
  setFilterZipText(event.target.value);
};
const handleBlurRequest = (e) => {
  e.preventDefault();
  setStyle({border: '2px solid #074b69'});
  console.log(myStyle);
}
const handleFocusZipRequest = (e) => {
  e.preventDefault();
  setZipStyle({border: '3px solid #007bff40'});
  console.log(myStyle);
}

const handleBlurZipRequest = (e) => {
e.preventDefault();
setZipStyle({border: '2px solid #074b69'});
console.log(myStyle);
}
  return (
   

    <React.Fragment>
        <div >
    <div  className='home-con scroll'>
      <div className= 'white-0-bg homepage-form  '>
      <Container className = 'mobile-con  home-mobile-con searchIcon-con ' style={{margin:'0 auto', padding: '0'}}>
          <div className='center-con'>
       <div className='searchTitle'>Search for a Provider</div>
       <Container className = 'mobile-con input-con' style={{margin:'0 0'}}>
              <div className='inputTitle search-input'>NAME</div>
              <InputGroup>
              <Form.Control
                value={filterText}
                onChange={handleFilterChange}
                onFocus={(e)=>handleFocusRequest(e)}
                onBlur={(e)=>handleBlurRequest(e)}
            
                placeholder='Search by Name'
                className='searchIcon'
              />
         
              </InputGroup>
              </Container>
              <Container className = 'mobile-con input-con' style={{margin:'0 0'}}>
                <div className='inputTitle search-input'>ZIP CODE</div>
              <InputGroup>
              <Form.Control
              value={filterZipText}
              onChange={handleFilterZipChange}
                onFocus={(e)=>handleFocusZipRequest(e)}
                onBlur={(e)=>handleBlurZipRequest(e)}
                
                placeholder='Search by Zip Code'
                className='searchIcon'
              />
             
              </InputGroup>
              </Container>
              <Button onClick={() => doRedirect()} className='searchIconButton' variant="primary" type="submit">
              Search
            </Button>
            </div>
       </Container>
       </div>
       </div>
       </div>
    </React.Fragment>
  );
};

SearchIcon.propTypes = {
    history: PropTypes.instanceOf(Object).isRequired,
  };
  
  export default withRouter(SearchIcon);
  