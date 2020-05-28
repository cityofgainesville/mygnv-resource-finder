import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import { ListGroup, Container, Row, Col, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../../../RouterPaths';
import './SubcategoryProviderList.scss';
import Homepage from '../Title';

const SubcategoryProviderList = (props) => {
  const [visible, setVisible] = useState(false);
  const [translation, setTranslation] = useState(false);
  const [cost, setCost] = useState(false);
  const [women, setWomen] = useState(false);
  const [child, setChild] = useState(false);
  const [veterans, setVeterans] = useState(false);
  const [adult, setAdult] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [elderly, setElderly] = useState(false);
  const [clicked, setClicked] = useState(false);
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

  const handleFilterChange2 = (value) => {
    console.log(value);
    setClicked(true);
    if(value == "Translation Available")
      setTranslation(true);


    if(value == "Free")
      setCost(true);

      if(value == "Women")
      setWomen(true);
      if(value == "Child")
      setChild(true);
      if(value == "Veterans")
      setVeterans(true);

      if(value == "Adult")
      setAdult(true);
      if(value == "Disabled")
      setDisabled(true);
      if(value == "Elderly")
      setElderly(true);

      if(window.innerWidth >= 1025){
        location.href = "#";
        location.href = "#topOfList";
      }
      else {
        location.href = "#";
        location.href = "#topOfListMobile";
      }
      /*window.scrollTo({
        top: 0,
        behavior: "smooth"
      });*/
    
    //console.log(translation);
    /*if(translation)
      setFI(providers.filter((provider)=> provider.translation_available != undefined ||
    provider.translation_available != '' ||
    provider.translation_available != 'No' ||
    provider.translation_available != 'N'));*/
  };

  // Renders a list of provider in subcategory, provides summary and
  // address quick view
  console.log(props.providers);
  
  const providerList = props.providers
  .filter((provider) => {
    return (translation ? 
      (provider.translation_available != undefined &&
            provider.translation_available != '' &&
            !provider.translation_available.includes('No') &&
            provider.translation_available != 'N') : provider
    );
  })
  .filter((provider) => {
    return (cost ? 
          (provider.cost_info != undefined &&
            provider.cost_info != '' &&
            (provider.cost_info.includes('free') || provider.cost_info.includes('Free'))) : provider
    );
  })
  .filter((provider) => {
    return (child ?
      (provider.demographics_eligible!== undefined ? provider.demographics_eligible.youth: null ): provider
    );
  })
  .filter((provider) => {
    return (women ?
      (provider.demographics_eligible!== undefined ? provider.demographics_eligible.women: null ): provider
    );
  })
  .filter((provider) => {
    return (veterans ?
      (provider.demographics_eligible!== undefined ? provider.demographics_eligible.veterans: null ): provider
    );
  })
  .filter((provider) => {
    return (adult ?
      (provider.demographics_eligible!== undefined ? provider.demographics_eligible.adults: null ): provider
    );
  })
  .filter((provider) => {
    return (disabled ?
      (provider.demographics_eligible!== undefined ? provider.demographics_eligible.disabled: null ): provider
    );
  })
  .filter((provider) => {
    return (elderly ?
      (provider.demographics_eligible!== undefined ? provider.demographics_eligible.elderly: null ): provider
    );
  })
  .sort((a, b) => (a.name > b.name) ? 1 : -1)
  .map((provider) => {
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
                  ? (provider.services_provided.includes('●') || provider.services_provided.includes('•') || provider.services_provided.includes('*')? provider.services_provided.split(/['●'||'•'||'*']/).map((line)=> {return(line !== "" && line !== "\n" ? ('• '+ line.trim() +'\n') : null)}) : `${provider.services_provided} \n`)
                  : 'Services not listed'}
        
            </p>
            <p className="updated">
              {'Updated '}
              {provider.updated_at.substring(5,7) + '/' + provider.updated_at.substring(8,10)+ '/' + provider.updated_at.substring(0,4)}
              {'\n'}
            </p>
        </div>
      </ListGroup.Item>
      {/*{(provider.cost_info !== undefined &&
            provider.cost_info !== '' &&  (provider.cost_info.includes('free') || provider.cost_info.includes('Free')) ) || !(provider.translation_available == undefined ||
              provider.translation_available == '' ||
              provider.translation_available.includes('No') ||
              provider.translation_available == 'N') || (provider.demographics_eligible !== undefined ? (provider.demographics_eligible.adults || provider.demographics_eligible.disabled || provider.demographics_eligible.elderly || provider.demographics_eligible.women || provider.demographics_eligible.veterans || provider.demographics_eligible.youth) : false) ? (<div className='tagsContainer'>
                {provider.demographics_eligible == undefined ? null : (provider.demographics_eligible.adults !== undefined && provider.demographics_eligible.adults ? (<button value="Adult" className='tags demographicsTag' onClick={(e)=> handleFilterChange2("Adult")}>Adults (18+)</button>): null)}
           {provider.demographics_eligible == undefined ? null : (provider.demographics_eligible.disabled !== undefined && provider.demographics_eligible.disabled ? (<button value="Disabled" className='tags demographicsTag' onClick={(e)=> handleFilterChange2("Disabled")}>Disabled</button>): null)}
           {provider.demographics_eligible == undefined ? null : (provider.demographics_eligible.elderly !== undefined && provider.demographics_eligible.elderly ? (<button value="Elderly" className='tags demographicsTag' onClick={(e)=> handleFilterChange2("Elderly")}>Elderly</button>): null)}
        {provider.cost_info !== undefined &&
            provider.cost_info !== '' &&  (provider.cost_info.includes('free') || provider.cost_info.includes('Free'))  ? (<button value="Free" className='tags'  id='costTag' onClick={(e)=> handleFilterChange2("Free")}>Free</button>): null}
        
          {provider.translation_available == undefined ||
            provider.translation_available == '' ||
            provider.translation_available.includes('No') ||
            provider.translation_available == 'N' ? null : (<button value="Translation Available" className='tags' id='translationTag' onClick={(e)=> handleFilterChange2("Translation Available")}>Translation Available</button>)}
            {provider.demographics_eligible == undefined ? null : (provider.demographics_eligible.veterans !== undefined && provider.demographics_eligible.veterans ? (<button value="Veterans" className='tags demographicsTag' onClick={(e)=> handleFilterChange2("Veterans")}>Veterans</button>): null)}
           {provider.demographics_eligible == undefined ? null : (provider.demographics_eligible.women !== undefined && provider.demographics_eligible.women ? (<button value="Women" className='tags demographicsTag' onClick={(e)=> handleFilterChange2("Women")}>Women</button>): null)}
           {provider.demographics_eligible == undefined ? null : (provider.demographics_eligible.youth !== undefined && provider.demographics_eligible.youth ? (<button value="Child" className='tags demographicsTag' onClick={(e)=> handleFilterChange2("Child")}>Youths (0-17)</button>): null)}
           
           
          </div>) : null}*/}
      </div>
    );
  });

  const handleEntailmentRequest = (e) => {
		e.preventDefault();
		setVisible(!visible);
		console.log(visible);
	
  }

  const handleClickedRequest = (e) => {
    e.preventDefault();
    setClicked(true);
}

const handleExitTranslationRequest = (e) => {
  e.preventDefault();
  setTranslation(false);
}

const handleExitCostRequest = (e) => {
  e.preventDefault();
  setCost(false);
}

const handleExitChildRequest = (e) => {
  e.preventDefault();
  setChild(false);
}
const handleExitWomenRequest = (e) => {
  e.preventDefault();
  setWomen(false);
}
const handleExitVeteransRequest = (e) => {
  e.preventDefault();
  setVeterans(false);
}

const handleExitAdultRequest = (e) => {
  e.preventDefault();
  setAdult(false);
}
const handleExitDisabledRequest = (e) => {
  e.preventDefault();
  setDisabled(false);
}
const handleExitElderlyRequest = (e) => {
  e.preventDefault();
  setElderly(false);
}
  //console.log(props.subcategory.name);
  return( 
    <React.Fragment>
      <div>
      <div id="topOfListMobile"
        className='search-con scroll'
      >
          <Form className= 'white-0-bg search-form'>
            <Form.Group className='search-form-group' controlId='formFilterText'>
              
              <Container style={{margin:'0 0'}}>
			  <Form.Label className='form-label-n'>{props.parentName} / {props.subcategory.name}
              </Form.Label>
              </Container>
            </Form.Group>
          </Form>
  <Container id="topOfList" className ='body'>
  {/*<div >
          <button className='tags exampleTag' style={{display: !clicked ? '' : 'none'}} onClick={(e)=>handleClickedRequest(e)}>Click a tag to filter <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: adult ? '' : 'none'}} onClick={(e)=>handleExitAdultRequest(e)}>Adults (18+) <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: disabled ? '' : 'none'}} onClick={(e)=>handleExitDisabledRequest(e)}>Disabled <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: elderly ? '' : 'none'}} onClick={(e)=>handleExitElderlyRequest(e)}>Elderly <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag costFilter' style={{display: cost ? '' : 'none'}} onClick={(e)=>handleExitCostRequest(e)}>Free <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag transFilter' style={{display: translation ? '' : 'none'}} onClick={(e)=>handleExitTranslationRequest(e)}>Translation Available <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: veterans ? '' : 'none'}} onClick={(e)=>handleExitVeteransRequest(e)}>Veterans <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: women ? '' : 'none'}} onClick={(e)=>handleExitWomenRequest(e)}>Women <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: child ? '' : 'none'}} onClick={(e)=>handleExitChildRequest(e)}>Youths (0-17) <i class="fal fa-times fa-1x"></i></button>
  </div>*/}
    {providerList}
    </Container>
  </div>
  </div>
  </React.Fragment>
  );
};

SubcategoryProviderList.propTypes = {
  parentName: PropTypes.string.isRequired,
  subcategory: PropTypes.instanceOf(Object).isRequired,
  providers: PropTypes.instanceOf(Array).isRequired,
  history: PropTypes.instanceOf(Object).isRequired
};

export default withRouter(SubcategoryProviderList);
