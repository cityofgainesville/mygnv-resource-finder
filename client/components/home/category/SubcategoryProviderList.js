import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import { ListGroup, Container, Row, Col, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../../../RouterPaths';
import './SubcategoryProviderList.scss';
import Homepage from '../Title';

const SubcategoryProviderList = (props) => {
  const [visible, setVisible] = useState(false);
  //const [translation, setTranslation] = useState(false);
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
  // On click, redirects to individual provider view of clicked provider
  const doRedirect = (providerId) => {
    props.history.push(`${paths.providerPath}/${providerId}`);
  };

  // Renders a list of provider in subcategory, provides summary and
  // address quick view
  console.log(props.providers);
  
  const providerList = props.providers.sort((a, b) => (a.name > b.name) ? 1 : -1).map((provider) => {
    return (
      <div className='providerCard-container'>
      <ListGroup.Item
        key={provider._id}
        action
        onClick={() => doRedirect(provider._id)}
      >
        <div className='subcat-provider-div'>
          <h5 className='subcat-provider-h5 providerName'>{provider.name}</h5>
          {provider.addresses !== undefined &&
                provider.addresses.length > 0
                  ? provider.addresses.map((addresses) => (
                    <div>
                    <i class="fas fa-map-marker-alt" style={{marginRight: ".5rem", color:'black'}}></i>
              <span key={`${provider._id}_address`}>
                {addresses.line_1}
                {/*{'\n'}
                {addresses.state} {addresses.zipcode}*/}
              </span>
              </div>
            )): ''}
            <p className="services">
              {provider.services_provided !== '' &&
                provider.services_provided !== undefined
                  ? (provider.services_provided.includes('●') || provider.services_provided.includes('•') || provider.services_provided.includes('*')? provider.services_provided.split(/['●'||'•'||'*']/).map((line)=> {return(line !== "" && line !== "\n" ? (<span>{`• ${line.trim()}`}<br></br></span>) : null)}) : provider.services_provided)
                  : 'Services not listed'}
              {'\n'}
            </p>
            {/*<p className="updated">
              {'Updated '}
              {provider.updated_at.substring(5,7) + '/' + provider.updated_at.substring(8,10)+ '/' + provider.updated_at.substring(0,4)}
              {'\n'}
            </p>*/}
        </div>
      </ListGroup.Item>
      {/*<div className='tagsContainer'>
        {provider.cost_info.cost_type == undefined ||
            provider.cost_info.cost_type == '' ? null : (<button value={provider.cost_info.cost_type} className='tags'>{provider.cost_info.cost_type}</button>)}
        
          {provider.translation_available == undefined ||
            provider.translation_available == '' ||
            provider.translation_available == 'No' ? null : (<button value="Translation Available" className='tags' id='translationTag'>Translation Available</button>)}
           {provider.demographics_eligible == undefined ||
            provider.demographics_eligible == '' ? null : (<button className='tags'>{provider.demographics_eligible}</button>)}
           </div>*/}
      </div>
    );
  });

  const handleEntailmentRequest = (e) => {
		e.preventDefault();
		setVisible(!visible);
		console.log(visible);
	
  }
  console.log(props.subcategory.name);
  return( 
    <React.Fragment>
      <div>
      <div
        className='search-con scroll'
      >
          <Form className= 'white-0-bg search-form'>
            <Form.Group className='search-form-group' controlId='formFilterText'>
              
              <Container style={{margin:'0 0'}}>
			  <Form.Label className='form-label-n'>
                {props.subcategory.name}
              </Form.Label>
              </Container>
            </Form.Group>
          </Form>
  <Container className ='body'>
  {/*<button className='tags' id='exampleTag'>Click a tag to filter <i class="fal fa-times fa-1x"></i></button>*/}
    {providerList}
    </Container>
  </div>
  </div>
  </React.Fragment>
  );
};

SubcategoryProviderList.propTypes = {
  subcategory: PropTypes.instanceOf(Object).isRequired,
  providers: PropTypes.instanceOf(Array).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
};

export default withRouter(SubcategoryProviderList);
