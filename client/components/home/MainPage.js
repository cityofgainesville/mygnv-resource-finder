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
import CategoryView from './category/CategoryView.js';
import paths from '../../RouterPaths';
import homeIcon from '../../images/myGNVrf.png';
import Search from './Search.js';
import Homepage from './Title';

// Main page component with two buttons for search by category and by name

const MainPage = (props) => {
  return (
    /*<Redirect to="/home/search"></Redirect>*/

    <React.Fragment>

    <div >
    <div  className='home-con scroll'>
      <div className= 'white-0-bg homepage-form  '>
      <Container className = 'mobile-con  home-mobile-con' style={{margin:'0 auto', padding: '0'}}>
      <div className='descriptionRF'>
        <div className='homepage-title'>my<span id='gnv'>GNV</span> Resource Directory</div>
        <div  className='onelineDescription'>
       Find Gainesville programs and services all in one place.
        </div>
        <div className="homepage-hero-img">
          <div className='description-words-container'>
            <div className='description-words'>Your Community</div>
            <div className='description-words bottom-word'>Your Needs</div>
          </div>
          <img  id='hero-img' src={homeIcon}
          
             ></img>
           <div  className='description-words-container'>
            <div className='description-words'>Your Family</div>
            <div className='description-words bottom-word'>Your Health</div>
          </div>
        </div>
        <div className='angle-down'>
        <Button  variant="link" href='#how-can-we-help'>
        <i class="fal fa-angle-down" style={{fontSize:"xxx-large", color: "black", filter: "drop-shadow(1px 3px 5px #aaa)", paddingLeft: '.4em'}}></i>
        </Button>
        </div>
      </div>

      <div className='descriptionRF extra' id='how-can-we-help'>
        <div className='homepage-subtitle-2'>How can we help?</div>
        <div  className='description-box left-box mobile-box-search'>
              <div className='menu-title-home menu-title'>Already know the resource name?</div>
              <div className='menu-title-mobile'>Already know the resource name?</div>
              <RedirectButton className='menuButton homeMenuButton' path={paths.searchPath} >
              <i class="far fa-search"  ></i>
              <span className="menu-name">Search for a resource</span>
          </RedirectButton>
          </div>
        <div className='description-box-container'>
          <div className='description-box top-box'>
              <div className='menu-title-home menu-title'>Not sure what you're looking for? Browse by categories.</div>
              <div className='menu-title-mobile'>Not sure what you're looking for? </div>
              <div className='cat-container'>
                <div className='menu-title-mobile'>Browse by Categories</div>
              <CategoryView></CategoryView>
              </div>
          </div>
          <div className='bottom-container'>
          <div  className='description-box left-box desktop-box-search'>
              <div className='menu-title-home menu-title'>Already know the resource name?</div>
              <div className='menu-title-mobile'>Already know the resource name?</div>
              <RedirectButton className='menuButton homeMenuButton' path={paths.searchPath} >
              <i class="far fa-search"  ></i>
              <span className="menu-name">Search for a resource</span>
          </RedirectButton>
          </div>
          <div  className='description-box hotline-box'>
              <div className='menu-title-home menu-title'>Looking for a hotline?</div>
              <div className='menu-title-mobile'>Looking for a hotline?</div>
              <RedirectButton className='menuButton homeMenuButton' path={paths.hotlinesPath}  >
              <i class="far fa-phone" ></i>
              <span className="menu-name">Call a hotline</span>
              </RedirectButton>
          </div>
          </div>
        </div>
      </div>

      {/*<div className='descriptionRF extra sponsor-logos'>
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
  </div>*/}

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

export default MainPage;
