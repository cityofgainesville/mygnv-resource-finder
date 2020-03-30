import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ListGroup, Container, Form, InputGroup, Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../../RouterPaths';
import Homepage from './Title';
import '../../index.scss';
import './Search.scss';
import './Covid19.scss';

const Covid19 = (props) => {
    return(
        <React.Fragment>
		
      <div className = 'scroll'>
      
      <div
        className='hotline-con'
      >
          <Form className= 'white-0-bg search-form'>
            <Form.Group className='search-form-group' controlId='formFilterText'>
              
          
              <Container style={{margin:'0 0'}}>
			  <Form.Label className='form-label-n'>
				  COVID-19 Resources
              </Form.Label>
              </Container>
            </Form.Group>
          </Form>
          <Container className='body-hotline'>
            {/*<p>To help answer your COVID-19 concerns and questions, we have provided a list of resources for you.</p>*/}
		  <ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div  provider-hotline'>
				<h5 className=' hotline-pname providerName'>COVID-19 Testing Questions</h5>
				<p className ='provider-phoneNumber mobile-phone'>
				
				Business Hours:<Button href='tel:+13523348810' variant='outline-info' style={{width: '100%',marginBottom: '16px'}}>352-334-8810 </Button>
				<br></br>
				After Hours: <Button href='tel:+13523347900' variant='outline-info'>352-334-7900</Button>
				</p>
				<p className ='provider-phoneNumber phone'>
				Business Hours: 352-334-8810
				<br></br>
				After Hours: 352-334-7900
				</p>
                <p className="description">The Alachua County Health Department is hosting a call center for the community to address questions about testing and any concerns with COVID-19.</p>
				</div>
			</ListGroup.Item>
            <ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div  provider-hotline'>
				<h5 className=' hotline-pname providerName'>COVID-19 Rumor Control</h5>
				<p className ='provider-phoneNumber mobile-phone'>
					<Button href='tel:311' variant='outline-info'>311</Button>
				
				</p>
				<p className ='provider-phoneNumber phone'>
				311
				</p>
                <p className="description">The 311 Critical Information Line is now staffed by live operators 24 hours a day, 7 days a week. It also now has translation services. Call and inform the operator what language you need, and a translator will be dialed in on the call.</p>
				</div>
			</ListGroup.Item>
            <ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div provider-hotline'>
				<h5 className='hotline-pname providerName '>Compliance Issue Reports</h5>
				<p className ='provider-phoneNumber mobile-phone'>
				<Button href='tel:+13529551818' variant='outline-info'>352-955-1818</Button>
				</p>
				<p className ='provider-phoneNumber phone'>
					352-955-1818
				</p>
                <p className="description">If you see non-compliance with the current emergency orders, you may report it at 352-955-1818.</p>
				</div>
			</ListGroup.Item>
			<ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div provider-hotline'>
				<h5 className='hotline-pname providerName '>Coronavirus Information Line</h5>
				<p className ='provider-phoneNumber mobile-phone'>
					<Button href='tel:+18667796121' variant='outline-info'>866-779-6121</Button>
				</p>
				<p className ='provider-phoneNumber phone'>
					866-779-6121
				</p>
                <p className="description">The state of Florida's Coronavirus information hotline is open 24 hours a day 7 days a week to answer any questions or concerns.</p>
				</div>
			</ListGroup.Item>
			<ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div  provider-hotline'>
				<h5 className='hotline-pname providerName '>Crisis Center Line</h5>
				<p className ='provider-phoneNumber mobile-phone'>
				<Button href='tel:+13522646789' variant='outline-info'>352-264-6789</Button>
				</p>
				<p className ='provider-phoneNumber phone'>
				352-264-6789
				</p>
                <p className="description">As we cope with this quickly escalating crisis, and we face significant changes to our day-to-day lives, it is more important than ever that we find ways to connect and build community. Volunteers both locally and from across the country have come forward to make sure that we are able to keep answering the call and be a source of support and information for our community. We encourage people to reach out whenever they feel the need for someone to listen.</p>
				</div>
			</ListGroup.Item>
			
          </Container>
          </div>
          </div>
		</React.Fragment>
		);
    
};

export default Covid19;