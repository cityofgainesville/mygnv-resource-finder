import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ListGroup, Container, Form, InputGroup, Button, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../../RouterPaths';
import Homepage from './Title';
import '../../index.scss';
import './Search.scss';
import IndivProvider from './IndivProvider';
import TopLevelCategory from './category/TopLevelCategory.js';
import CategoryView from './category/CategoryView.js';

// Search component for all providers,
// When provider is clicked redirects to
// individual provider view

const Search = (props) => {
  const [providers, setProviders] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visible, setVisible] = useState(false);
  const [translation, setTranslation] = useState(false);
  const [cost, setCost] = useState(false);
  const [myStyle, setStyle] = useState ({borderColor: 'default'});
  const [clicked, setClicked] = useState(false);

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

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };
  const handleFilterChange2 = (value) => {
    console.log(value);
    setClicked(true);
    if(value == "Translation Available")
      setTranslation(true);


    if(value == "Free")
      setCost(true);
  
    
    //console.log(translation);
    /*if(translation)
      setFI(providers.filter((provider)=> provider.translation_available != undefined ||
    provider.translation_available != '' ||
    provider.translation_available != 'No' ||
    provider.translation_available != 'N'));*/
  };

  const doRedirect = (providerId) => {
    props.history.push(`${paths.providerPath}/${providerId}`);
  };

  const providerList = providers
    .filter((provider) => {
      return (translation ? 
        (cost ? ((provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
        provider._id.includes(filterText)) && (provider.translation_available != undefined &&
          provider.translation_available != '' &&
          !provider.translation_available.includes('No') &&
          provider.translation_available != 'N') && (provider.cost_info != undefined &&
            provider.cost_info != '' &&
            (provider.cost_info.includes('free') || provider.cost_info.includes('Free')))) : ((provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
        provider._id.includes(filterText)) && (provider.translation_available != undefined &&
          provider.translation_available != '' &&
          !provider.translation_available.includes('No') &&
          provider.translation_available != 'N'))) : ( cost ? ((provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
          provider._id.includes(filterText)) && (provider.cost_info != undefined &&
            provider.cost_info != '' &&
            (provider.cost_info.includes('free') || provider.cost_info.includes('Free')))) : (provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
        provider._id.includes(filterText)))
      );
    })

    .sort((a, b) => (a.name > b.name) ? 1 : -1)

    .map((provider) => {
      return (
        <React.Fragment>
        <div className='providerCard-container' key={provider._id}>
        <ListGroup.Item
          key={provider._id}
          action
          onClick={() => doRedirect(provider._id)}
          className = 'providersList'
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <h5 class='providerName'>
              {provider.name}
             
            </h5>
            
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
        {provider.cost_info !== undefined &&
            provider.cost_info !== '' &&  (provider.cost_info.includes('free') || provider.cost_info.includes('Free'))  ? (<button value="Free" className='tags'  onClick={(e)=> handleFilterChange2("Free")}>Free</button>): null}
        
          {provider.translation_available == undefined ||
            provider.translation_available == '' ||
            provider.translation_available.includes('No') ||
            provider.translation_available == 'N' ? null : (<button value="Translation Available" className='tags' id='translationTag' onClick={(e)=> handleFilterChange2("Translation Available")}>Translation Available</button>)}
           {/*{provider.demographics_eligible == undefined ||
            provider.demographics_eligible == '' ? null : (<button className='tags'>{provider.demographics_eligible}</button>)}
           </div>*/}
        </div>
        </React.Fragment>
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

  const handleFocusRequest = (e) => {
    e.preventDefault();
    setStyle({border: '3px solid #007bff40'});
    console.log(myStyle);
}

const handleBlurRequest = (e) => {
  e.preventDefault();
  setStyle({border: '1px solid #ced4da'});
  console.log(myStyle);
}
    
  return (
    <React.Fragment>

      <div >
      <div  className='search-con scroll' >

          <Form className= 'white-0-bg search-form'>
            <Form.Group className='search-form-group' controlId='formFilterText'>
              <Container className = 'mobile-con' style={{margin:'0 0'}}>
              <InputGroup>
              <Form.Control
                value={filterText}
                onChange={handleFilterChange}
                onFocus={(e)=>handleFocusRequest(e)}
                onBlur={(e)=>handleBlurRequest(e)}
                placeholder='Search by Provider Name'
                className='search'
              />
              <InputGroup.Prepend>
                    <InputGroup.Text style={myStyle}>
                      <i class="fal fa-search"></i>
                    </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
              </Container>
            </Form.Group>
            <div className='search-cat-con'><p className='search-cat'><Button onClick={(e)=>handleEntailmentRequest(e)} className='search-cat-button' style={{display: !visible ? '' : 'none'}}>Browse by Category <i class="fal fa-chevron-down" style={{color:'black !important'}}></i></Button><Button onClick={(e)=>handleEntailmentRequest(e)} className='search-cat-button' style={{display: visible ? '' : 'none'}}>Browse by Category <i class="fal fa-chevron-up"></i></Button></p><div style={{display: visible ? '' : 'none'}}><CategoryView/></div></div>
          </Form>
          <Container className='body searchb'>
          {/*<button className='tags' id='exampleTag' style={{display: !clicked ? '' : 'none'}} onClick={(e)=>handleClickedRequest(e)}>Click a tag to filter <i class="fal fa-times fa-1x"></i></button>
          <button className='tags' id='exampleTag' style={{display: cost ? '' : 'none'}} onClick={(e)=>handleExitCostRequest(e)}>Free <i class="fal fa-times fa-1x"></i></button>
  <button className='tags' id='exampleTag' style={{display: translation ? '' : 'none'}} onClick={(e)=>handleExitTranslationRequest(e)}>Translation Available <i class="fal fa-times fa-1x"></i></button>*/}
          
            {providerList}

  </Container>

         </div>
          </div>
    </React.Fragment>
  );
};

Search.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(Search);
