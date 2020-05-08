import React from 'reactn';
import { Redirect } from 'react-router';
import { Form, FormControl, Container, Row, Col,  ListGroup, InputGroup, Button } from 'react-bootstrap';
import mygnvIcon from '../../images/mygnv.png';
import accrgIcon from '../../images/accrg.png';
import ciseIcon from '../../images/cise.png';
import cogIcon from '../../images/cog.png' ;
import designgnvIcon from '../../images/designgnv.png';
import mocIcon from '../../images/moc.png';
import RedirectButton from './RedirectButton';
import paths from '../../RouterPaths';
import Search from './Search.js';
import Homepage from './Title';

// Main page component with two buttons for search by category and by name

const MainPage = (props) => {
  return (
    <Redirect to="/home/search"></Redirect>
    /*<React.Fragment>

    <div >
    <div  className='search-con scroll'>
      <div className= 'white-0-bg homepage-form'>
      <Container className = 'mobile-con' style={{margin:'0 0'}}>
      <div className='descriptionRF'>
        <h4 className='homepage-title'>Finding the resources you need shouldn't be so hard.</h4>
        <div  >
        All of your resources in one place:<br></br>
          • National Programs <br></br>
          • State of Florida <br></br>
          • Alachua County <br></br>
          • City of Gainesville <br></br>
          • Non-Profits and Charities <br></br>
          • Community-Based Programs <br></br>
        </div>
      </div>

      <div className='descriptionRF extra'>
        <div className='homepage-subtitle'>You can use this tool two ways:</div>

        <div className='description-box-container'>
          <div className='description-box'>
              <h5>Search for a Provider</h5>
              <div>If you know the name of the provider you are looking for, you can find them by typing their name into the search bar.</div>
          </div>
          <div  className='description-box'>
              <h5>Browse by Category</h5>
              <div>If you are looking for a particular service but don't know who offers it, you can use "Browse by Category".</div>
          </div>
        </div>
      </div>

      <div className='descriptionRF extra'>
        <div className='homepage-subtitle'>The Resource Finder is created in collaboration with:</div>
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
      </div>

      <div className='descriptionRF extra'>
        <div className='homepage-subtitle'>Spot something wrong or want to add a new provider? Please let us know!</div>
        <div className='feedback-container'>
          <Button className='feedback-buttons' href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_74157YeIb6ttlYx' target='_blank'>Feedback</Button>
          <Button className='feedback-buttons' href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_bNMcXknvBcVfxoV' target='_blank'>Add a Provider</Button>
        </div>
      </div>
      </Container>
         </div>
         </div>
          </div>
    </React.Fragment>*/
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
