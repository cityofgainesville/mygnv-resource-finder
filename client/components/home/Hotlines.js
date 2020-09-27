import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, ListGroup, Row, Col,Form, InputGroup, Button} from 'react-bootstrap';
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
		

      <div >
      
      <div
        className='hotline-con scroll'

      >
          <Form className= 'white-0-bg search-form' id='hotline-form-group'>
            <Form.Group className='search-form-group' controlId='formFilterText'>
              
          
              <Container style={{margin:'0 0'}}>
			  <Form.Label className='form-label-n'>
				  Hotlines
              </Form.Label>
              </Container>
            </Form.Group>
          </Form>
          <Container className='body-hotline'>
		  <ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div  provider-hotline'>
				<h5 className=' hotline-pname providerName'>Alachua County COVID-19 Hotline</h5>
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
				</div>
			</ListGroup.Item>
			<ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div  provider-hotline'>
				<h5 className='hotline-pname providerName '>Department of Children and Families-Abuse Hotline</h5>
				<p className ='provider-phoneNumber mobile-phone'>
				<Button href='tel:+18009622873' variant='outline-info'>1-800-96-ABUSE</Button>
				</p>
				<p className ='provider-phoneNumber phone'>
				1-800-96-ABUSE
				</p>
				</div>
			</ListGroup.Item>
			<ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div  provider-hotline'>
				<h5 className=' hotline-pname providerName'>Florida AIDS Hotline</h5>
				<p className ='provider-phoneNumber mobile-phone'>
				<Button href='tel:+18003522437' variant='outline-info'>1-800-352-2437</Button>
				</p>
				<p className ='provider-phoneNumber phone'>
				1-800-352-2437
				</p>
				</div>
			</ListGroup.Item>

			<ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div provider-hotline'>
				<h5 className='hotline-pname providerName '>State of Florida's Coronavirus Information Line</h5>
				<p className ='provider-phoneNumber mobile-phone'>
					<Button href='tel:+18667796121' variant='outline-info'>866-779-6121</Button>
				</p>
				<p className ='provider-phoneNumber phone'>
					866-779-6121
				</p>
				</div>
			</ListGroup.Item>

			<ListGroup.Item
				className = 'providerCard-container hotline-card-container'
			>
				<div className='subcat-provider-div provider-hotline'>
				<h5 className='hotline-pname providerName '>United Way</h5>
				<p className ='provider-phoneNumber mobile-phone'> 
				Available 24/7<br></br>
				Call
					<Button href='tel:211' variant='outline-info'>2-1-1</Button>
				
					<Button href='tel:+13523324636' variant='outline-info' style={{width: '100%',marginBottom: '16px'}}>352-332-4636</Button>
				
				<br></br>
				Text
					<Button href='sms:898-211' variant='outline-info'>898-211</Button>
				</p>
				<p className ='provider-phoneNumber phone'>
					Available 24/7
					<br></br>
					Call 2-1-1 or 352-332-4636
				<br></br>
					Text your zip code to 898-211
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