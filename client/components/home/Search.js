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
  const [women, setWomen] = useState(false);
  const [child, setChild] = useState(false);
  const [veterans, setVeterans] = useState(false);
  const [adult, setAdult] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [elderly, setElderly] = useState(false);
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

  const doRedirect = (providerId) => {
    props.history.push(`${paths.providerPath}/${providerId}`);
  };

  const providerList = providers
    .filter((provider) => {
      return ( provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
                     provider._id.includes(filterText)
      );
    })
    .filter((provider) => {
      return (translation ? 
         (provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
              provider._id.includes(filterText)) && (provider.translation_available != undefined &&
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
        {(provider.cost_info !== undefined &&
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
           
           
          </div>) : null}
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
      <div id="topOfListMobile"  className='search-con scroll' >

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
          <Container id="topOfList" className='body searchb'>
          <div >
          <button className='tags exampleTag' style={{display: !clicked ? '' : 'none'}} onClick={(e)=>handleClickedRequest(e)}>Click a tag to filter <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: adult ? '' : 'none'}} onClick={(e)=>handleExitAdultRequest(e)}>Adults (18+) <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: disabled ? '' : 'none'}} onClick={(e)=>handleExitDisabledRequest(e)}>Disabled <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: elderly ? '' : 'none'}} onClick={(e)=>handleExitElderlyRequest(e)}>Elderly <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag costFilter' style={{display: cost ? '' : 'none'}} onClick={(e)=>handleExitCostRequest(e)}>Free <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag transFilter' style={{display: translation ? '' : 'none'}} onClick={(e)=>handleExitTranslationRequest(e)}>Translation Available <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: veterans ? '' : 'none'}} onClick={(e)=>handleExitVeteransRequest(e)}>Veterans <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: women ? '' : 'none'}} onClick={(e)=>handleExitWomenRequest(e)}>Women <i class="fal fa-times fa-1x"></i></button>
          <button className='tags exampleTag demoFilter' style={{display: child ? '' : 'none'}} onClick={(e)=>handleExitChildRequest(e)}>Youths (0-17) <i class="fal fa-times fa-1x"></i></button>
          </div>
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
