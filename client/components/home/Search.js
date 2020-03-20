import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ListGroup, Container, Form, InputGroup,} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../../RouterPaths';
import Homepage from './Title';
import '../../index.scss';
import './Search.scss';

// Search component for all providers,
// When provider is clicked redirects to
// individual provider view

const Search = (props) => {
  const [providers, setProviders] = useState([]);
  const [filterText, setFilterText] = useState('');
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
  let filteredItems = providers;

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
  /*const handleFilterChange2 = (value) => {
    if(value == "Translation Available")
      setTranslation(true);
    else
      setTranslation(false);
    
    if(translation)
     filteredItems = providers.filter((provider)=> provider.translation_available != undefined ||
    provider.translation_available != '' ||
    provider.translation_available != 'No');
  };*/

  const doRedirect = (providerId) => {
    props.history.push(`${paths.providerPath}/${providerId}`);
  };

  const providerList = providers
    .filter((provider) => {
      return (
        provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
        provider._id.includes(filterText)
        /*provider.cost_info.cost_type.includes(filterText) ||
        provider.demographics_eligible.includes(filterText)*/
      );
    })
    .map((provider) => {
      return (
        <React.Fragment>
        <div className='providerCard-container'>
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
            <i class="fas fa-map-marker-alt"></i>
            {provider.addresses.map((addresses) => (
              
              <span key={`${provider._id}_address`} style={{ color: 'black' }}>
                {addresses.line_1}
                {/*{'\n'}
                {addresses.state} {addresses.zipcode}*/}
              </span>
            ))}
            <p>
              {provider.services_provided}
              {'\n'}
            </p>
            <p>
              {'Updated '}
              {provider.updated_at.substring(5,7) + '/' + provider.updated_at.substring(8,10)+ '/' + provider.updated_at.substring(0,4)}
              {'\n'}
            </p>
            
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
        </React.Fragment>
      );
    });

    const handleEntailmentRequest = (e) => {
      e.preventDefault();
      setVisible(!visible);
      console.log(visible);
      /*if(visible){
        setMyStyle({
          margins: 'auto auto',
          //maxWidth: '60em',
          zIndex: '0',
          padding: '0',
          margin: '0',
          width: '75%',
          float: 'right',
        });
        setFormStyle({
          width: '75%', 
          borderBottom : '1px solid #DBDBDB', 
          position:'fixed', 
          zIndex:'100', 
          marginTop:'53px'
        });
      }
        
      else{
        setMyStyle({
          margins: 'auto auto',
          //maxWidth: '60em',
          zIndex: '0',
          padding: '0',
          margin: '0',
          width: '100%',
          float: 'right',
        });
        setFormStyle({
          width: '100%', 
          borderBottom : '1px solid #DBDBDB', 
          position:'fixed', 
          zIndex:'100', 
          marginTop:'53px'
        });
      } */
        
  
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
              <InputGroup>
              <Form.Control
                value={filterText}
                onChange={handleFilterChange}
                placeholder='Search for a resource'
                className='search'
              />
              <InputGroup.Prepend>
                    <InputGroup.Text>
                      <i class="fal fa-search"></i>
                    </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
              </Container>
            </Form.Group>
          </Form>
          <Container className='body'>
          {/*<button className='tags' id='exampleTag'>Click a tag to filter <i class="fal fa-times fa-1x"></i></button>*/}
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
