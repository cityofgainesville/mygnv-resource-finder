import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, ListGroup, Row, Col,Form, InputGroup, } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../../RouterPaths';
import Homepage from './Title';
import '../../index.scss';
import './Hotlines.scss';

const Hotlines = (props) => {
	const [providers, setProviders] = useState([]);
	const [visible, setVisible] = useState(false);
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

	const doRedirect = (providerId) => {
		props.history.push(`${paths.providerPath}/${providerId}`);
	  };

	  // Loads in all providers for filtering through
	/*useEffect(() => {
		axios
		.get(`/api/providers/list`)
		.then((res) => {
			setProviders(res.data);
		})
		.catch((err) => {
			console.log(err);
		});
	}, []);*/

	  /*const providerList = providers.map((provider) => {
		return (
		  <ListGroup.Item
			key={provider._id}
			action
			onClick={() => doRedirect(provider._id)}
			className = 'providerCard-container'
		  >
			<div className='subcat-provider-div'>
			  <h5 className='subcat-provider-h5 providerName'>{provider.name}</h5>
			  <p className ='provider-phoneNumber'>
			  {provider.phone_numbers && provider.phone_numbers.length > 0
                  ? provider.phone_numbers[0].number
                  : null}
                
				{'\n'}
			  </p>
			</div>
		  </ListGroup.Item>
		);
	  });*/

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
				  Call a hotline
              </Form.Label>
              </Container>
            </Form.Group>
          </Form>
          <Container className='body'>
		  <ListGroup.Item
				className = 'providerCard-container'
			>
				<div className='subcat-provider-div'>
				<h5 className='subcat-provider-h5 providerName'>Alachua County COVID-19 Hotline</h5>
				<p className ='provider-phoneNumber'>
				Business Hours: 352-334-8810
				<br></br>
				After Hours: 352-334-7900
				</p>
				</div>
			</ListGroup.Item>
			<ListGroup.Item
				className = 'providerCard-container'
			>
				<div className='subcat-provider-div'>
				<h5 className='subcat-provider-h5 providerName'>Coronavirus Information Line</h5>
				<p className ='provider-phoneNumber'>
					866-779-6121
				</p>
				</div>
			</ListGroup.Item>
			<ListGroup.Item
				className = 'providerCard-container'
			>
				<div className='subcat-provider-div'>
				<h5 className='subcat-provider-h5 providerName'>Department of Children and Families-Abuse Hotline</h5>
				<p className ='provider-phoneNumber'>
				1-800-96-ABUSE
				</p>
				</div>
			</ListGroup.Item>
			<ListGroup.Item
				className = 'providerCard-container'
			>
				<div className='subcat-provider-div'>
				<h5 className='subcat-provider-h5 providerName'>Florida AIDS Hotline</h5>
				<p className ='provider-phoneNumber'>
				1-800-352-2437
				</p>
				</div>
			</ListGroup.Item>
          </Container>
          </div>
          </div>
		</React.Fragment>
		);
};

Hotlines.propTypes = {
 	history: PropTypes.instanceOf(Object).isRequired,
  };
  

export default withRouter(Hotlines);