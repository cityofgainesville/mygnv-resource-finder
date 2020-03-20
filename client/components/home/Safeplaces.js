import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, ListGroup, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../../RouterPaths';
import Homepage from './Title';
import '../../index.scss';
import './Safeplaces.scss';


const Safeplaces = (props) => {
	const [providers, setProviders] = useState([]);
	const [visible, setVisible] = useState(false);
	const [dropdown, setDropdown] = useState(false);
	const [myStyle, setMyStyle] = useState({
		margins: 'auto auto',
		//maxWidth: '60em',
		zIndex: '0',
		padding: '0',
		margin: '0',
		width: '75%',
		float: 'right',
	  });
	  const [formStyle, setFormStyle] = useState({
		width: '75%', 
		borderBottom : '1px solid #DBDBDB', 
		position:'fixed', 
		zIndex:'100', 
		marginTop:'53px'
	  });

	    // Loads in all providers for filtering through
	useEffect(() => {
		axios
		.get(`/api/providers/list`)
		.then((res) => {
			setProviders(res.data);
		})
		.catch((err) => {
			console.log(err);
		});
	}, []);

	  const providerList = providers.map((provider) => {
		return (
		  <ListGroup.Item
			key={provider._id}
			id='safeplaces-items'
		  >
			<div className='subcat-provider-div'>
			  <h5 className='subcat-provider-h5 providerName'>{provider.name}</h5>
	
			  <div className='provider-phone-location'>
			  <div>
			  <i class="fas fa-map-marker-alt"></i>
            {provider.addresses.map((addresses) => (
              
              <span key={`${provider._id}_address`} style={{ color: 'black' }}>
                {addresses.line_1}
                {/*{'\n'}
                {addresses.state} {addresses.zipcode}*/}
              </span>
            ))}
			</div>
			<div>
			<i class="fas fa-phone"></i>
			  <span className ='provider-phoneNumber'>
			  {provider.phone_numbers && provider.phone_numbers.length > 0
                  ? provider.phone_numbers[0].number
                  : null}
                
				{'\n'}
			  </span>
			  </div>
			  </div>
			  <div className='safeplace-map-button-container'>
				  <Button variant="primary" className='safeplace-map-button'>Map</Button>
			  </div>
			</div>
		  </ListGroup.Item>
		);
	  });

	const handleDropdownRequest = (e) => {
		e.preventDefault();
		setDropdown(!dropdown);
	}

	return (
		<React.Fragment>
			
      <div>
      
      <div
        style={myStyle}
      >
          <Form className= 'white-0-bg' style={formStyle}>
            <Form.Group controlId='formFilterText'>
              <Container style={{margin:'0 0'}}>
			  <Form.Label>
				  Locate my nearest safe place
              </Form.Label>
              </Container>
            </Form.Group>
          </Form>
          <Container className='body'>
			<div id='safeplace-body-left'>
			<div class='safeplace-instructions'>
				How Safe Places Work 
				<button className='dropdown' onClick={(e) => handleDropdownRequest(e)} style={{display: !dropdown ? '' : 'none'}}>
				<i class="fal fa-angle-down" ></i>
				</button >
				<button className="dropdown" onClick={(e) => handleDropdownRequest(e)} style={{display: dropdown ? '' : 'none'}}>
				<i class="fal fa-angle-up" ></i>
				</button>
				<div id='instructions' style={{display: dropdown? '' : 'none'}}>
				1. A youth can go to a safe place for abuse, depression, and others and ask for help. A safe place will have a “Safe Place” sign.
				<br></br>
				<br></br>
				2. The employee will guide you somewhere comfortable to wait while they contact the licensed safe place agency.
				<br></br>
				<br></br>
				3. Within 30 minutes, a qualified Safe Place volunteer or agency staff member will arrive to talk with you and, if necessary, provide transportation to the agency.
				<br></br>
				<br></br>
				4. Once at the agency, counselors meet with the you and provide support.
				<br></br>
				<br></br>
				<Button id='nsp' href='https://www.nationalsafeplace.org/' target="_blank" variant='outline-info'>
					www.nationalsafeplace.org
				</Button>
				</div>
			</div>
            {providerList}
			</div>
          </Container>
          </div>
          </div>
		</React.Fragment>
		);
};

export default Safeplaces;