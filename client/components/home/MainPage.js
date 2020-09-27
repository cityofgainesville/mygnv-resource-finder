//import React from 'reactn';
import React, { useState, useEffect } from 'reactn';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Form, FormControl, Container, Row, Col,  ListGroup, InputGroup, Button } from 'react-bootstrap';
import mygnvIcon from '../../images/mygnv.png';
import accrgIcon from '../../images/accrg.png';
import './NavBar.scss';
import ciseIcon from '../../images/cise.png';
import cogIcon from '../../images/cog.png' ;
import designgnvIcon from '../../images/designgnv.png';
import mocIcon from '../../images/moc.png';
import RedirectButton from './RedirectButton';
import CategoryView from './category/CategoryView.js';
import paths from '../../RouterPaths';
import { withRouter } from 'react-router-dom';
import homeIcon from '../../images/myGNVrf.png';
import Search from './Search.js';
import Homepage from './Title';

// Main page component with two buttons for search by category and by name

const MainPage = (props) => {
  const [myStyle, setStyle] = useState ({borderColor: 'default'});
  const [myZipStyle, setZipStyle] = useState ({borderColor: 'default'});
  const [filterText, setFilterText] = useState('');
  const [filterZipText, setFilterZipText] = useState('');
  const handleFocusRequest = (e) => {
    e.preventDefault();
    setStyle({border: '3px solid #007bff40'});
    console.log(myStyle);
}

const doRedirect = (providerId) => {
  if(event.key === 'Enter'){
    console.log(`${paths.providerPath}/${providerId}`);
    props.history.push(`${paths.providerPath}/?name=${filterText}&zip=${filterZipText}&age=`);
  }
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
    /*<Redirect to="/home/search"></Redirect>*/

    <React.Fragment>
       
    <div >
    <div  className='home-con scroll'>
      <div className= 'white-0-bg homepage-form  '>
      <Container className = 'mobile-con  home-mobile-con' style={{margin:'0 auto', padding: '0'}}>
      <div id='feedback'>Find the latest COVID-19 information at the <a target='_blank' href='https://alachuacounty.us/covid-19/Pages/default.aspx?' id='feedback-link'>Alachua County COVID-19 Community Resource Portal</a></div>
      <div className='descriptionRF extra' id='how-can-we-help'>
        <div className='homepage-subtitle-2'>Find Gainesville programs and services all in one place.</div>
        <div  className='description-box left-box mobile-box-search'>
              <div className='menu-title-home menu-title'>Search for providers by name or zip code.</div>
              <div className='menu-title-mobile'>Search for providers by name or zip code.</div>
              <Container className = 'mobile-con input-con' style={{margin:'0 0'}}>
              <div className='inputTitle'>NAME</div>
              <InputGroup>
              <Form.Control
               value={filterText}
               onChange={handleFilterChange}
                onFocus={(e)=>handleFocusRequest(e)}
                onBlur={(e)=>handleBlurRequest(e)}
                onKeyPress={() => doRedirect(filterText)}
                placeholder='Search by Name'
                className='search'
              />
              <InputGroup.Prepend>
                    <InputGroup.Text style={myStyle}>
                      <i class="far fa-search" style={{color:'#074b69'}}></i>
                    </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
              </Container>
              <Container className = 'mobile-con input-con' style={{margin:'0 0'}}>
              <div className='inputTitle'>ZIP CODE</div>
              <InputGroup>
              <Form.Control
               value={filterZipText}
               onChange={handleFilterZipChange}
                onFocus={(e)=>handleFocusZipRequest(e)}
                onBlur={(e)=>handleBlurZipRequest(e)}
                onKeyPress={() => doRedirect(filterZipText)}
                placeholder='Search by Zip Code'
                className='search'
              />
              <InputGroup.Prepend>
                    <InputGroup.Text style={myZipStyle}>
                      <i class="far fa-search" style={{color:'#074b69'}}></i>
                    </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
              </Container>
              <RedirectButton className='menuButton homeMenuButton' path={paths.searchPath} >
              See all resources
          </RedirectButton>
          </div>
          <div className='description-box-container'>
          <div  className='description-box top-box hotline-box'>
              <div className='menu-title-home menu-title'>Search for providers by name or zip code.</div>
              <div className='menu-title-mobile'>Search for providers by name or zip code.</div>
              <Container className = 'mobile-con input-con' style={{margin:'0 0'}}>
              <div className='inputTitle'>NAME</div>
              <InputGroup>
              <Form.Control
                value={filterText}
                onChange={handleFilterChange}
                onFocus={(e)=>handleFocusRequest(e)}
                onBlur={(e)=>handleBlurRequest(e)}
                onKeyPress={() => doRedirect(filterText)}
                placeholder='Search by Name'
                className='search'
              />
              <InputGroup.Prepend>
                    <InputGroup.Text style={myStyle}>
                      <i class="far fa-search" style={{color:'#074b69'}}></i>
                    </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
              </Container>
              <Container className = 'mobile-con input-con' style={{margin:'0 0'}}>
                <div className='inputTitle'>ZIP CODE</div>
              <InputGroup>
              <Form.Control
              value={filterZipText}
              onChange={handleFilterZipChange}
                onFocus={(e)=>handleFocusZipRequest(e)}
                onBlur={(e)=>handleBlurZipRequest(e)}
                onKeyPress={() => doRedirect(filterZipText)}
                placeholder='Search by Zip Code'
                className='search'
              />
              <InputGroup.Prepend>
                    <InputGroup.Text style={myZipStyle}>
                      <i class="far fa-search" style={{color:'#074b69'}}></i>
                    </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
              </Container>
              <RedirectButton className='resourceButton homeMenuButton' path={paths.searchPath} >
         
              See all resources
          </RedirectButton>
          </div>
        
          <div className='description-box top-box hotline-box'>
              <div className='menu-title-home menu-title'>Not sure what you're looking for? Browse by categories.</div>
              <div className='menu-title-mobile'>Not sure what you're looking for? </div>
              <div className='cat-container'>
                <div className='menu-title-mobile'>Browse by Categories</div>
              <CategoryView></CategoryView>
              </div>
          </div>
          
          <div  className='description-box hotline-box'>
              <div className='menu-title-home menu-title'>Need a quick access to hotlines?</div>
              <div className='menu-title-mobile'>Need a quick access to hotlines?</div>
              <RedirectButton className='menuButton homeMenuButton' path={paths.hotlinesPath}  >
              <span className="menu-name">View list of hotlines</span>
              </RedirectButton>
          </div>
        </div>
      </div>

      <div className='sponsor-rf extra sponsor-logos'>
      <div className='homepage-subtitle-2' >Our Partners</div>
        <div className='homepage-subtitle sponsor-subtitle'>The Resource Finder is created in collaboration with:</div>
        <div  className='sponsor-icons'>
   
        <div className='sponsors-container'>
          <img className='sponsors' src={accrgIcon} alt='Alachua County Community Resource Guide'></img>
        </div>
        <div className='sponsors-container'>
          <img className='sponsors' src={ciseIcon} alt='UF CISE'></img>
        </div>
        <div className='sponsors-container'>
          <img className='sponsors' src={cogIcon} alt='City of Gainesville'></img>
        </div>
      
        <div className='sponsors-container'>
          <img className='sponsors' src={designgnvIcon} alt='designGNV'></img>
        </div>
        <div className='sponsors-container'>
          <img className='sponsors' src={mocIcon} alt='Mobile Outreach Clinic'></img>
        </div>
        <div className='sponsors-container'>
          <img className='sponsors' src={mygnvIcon} alt='myGNV Resource Finder'></img>
        </div>
        
        </div>
        <div className='homepage-subtitle sponsor-blurb'>The City of Gainesville is in partnership with our community partners to release this information as a benefit to the community. This information is correct at the time of posting. If you find an error or would like to comment, please do so at <a href="mailto:designgnv@cityofgainesville.org">designgnv@cityofgainesville.org</a>.</div>
  </div>

      <div className='extra feedback-rf'>
        <div className='homepage-subtitle'>Spot something wrong or want to add a new resource? Let us know!</div>
        <div className='feedback-container'>
          <Button className='feedback-buttons' href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_74157YeIb6ttlYx' target='_blank'>Feedback</Button>
          <Button className='feedback-buttons' id='feedback-right' href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_bNMcXknvBcVfxoV' target='_blank'>Add a Resource</Button>
        </div>
      </div>
      </Container>
         </div>
         </div>
          </div>
    </React.Fragment>
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

MainPage.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(MainPage);
