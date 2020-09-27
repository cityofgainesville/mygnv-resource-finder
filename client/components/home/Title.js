import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Alert, Jumbotron} from 'react-bootstrap';
import { Container, Row, Col, Button, Form, InputGroup, Modal, ListGroup, Dropdown, DropdownButton} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import RedirectButton from './RedirectButton';
import paths from '../../RouterPaths';
import CategoryView from './category/CategoryView.js';
import TopLevelCategory from './category/TopLevelCategory.js';
import '../../index.scss';
import './Search.scss';

// Title component, displays blue bar with icon and text

const Homepage = (props) => {
  var queryString = decodeURIComponent(window.location.search);
  var queries;

  queryString = queryString.substring(1); 
  queries = queryString.split("&");
  
  
  const [providers, setProviders] = useState([]);
  const [filterText, setFilterText] = useState( queries[0].split("=")[1] ? queries[0].split("=")[1] : '');
  const [filterZipText, setFilterZipText] = useState(queries[1].split("=")[1] ? queries[1].split("=")[1]: '');
  const [filterAgeText, setFilterAgeText] = useState(queries[2].split("=")[1] ? queries[2].split("=")[1]: '');
  const [gender, setGender] = useState('');
  const [cat, setCat] = useState('');
  const [subcat, setSubcat] = useState('');
  const [visible, setVisible] = useState(false);
  const [hotline, setHotline] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(null);
  const [parent, setParent] = useState('');
  const [category, setCategory] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [myStyle, setStyle] = useState ({borderColor: 'default'});
  const [myZipStyle, setZipStyle] = useState ({borderColor: 'default'});
  
  //SEARCH
  const handleFocusRequest = (e) => {
    e.preventDefault();
    setStyle({border: '3px solid #007bff40'});
    console.log(myStyle);
}
const handleFilterChange = (event) => {
  setFilterText(event.target.value);
};
const handleFilterZipChange = (event) => {
  setFilterZipText(event.target.value);
};
const handleFilterAgeChange = (event) => {
  setFilterAgeText(event.target.value);
};
const handleBlurRequest = (e) => {
  e.preventDefault();
  setStyle({border: '2px solid #074b69'});
  console.log(myStyle);
}
const handleFocusZipRequest = (e) => {
  e.preventDefault();
  setZipStyle({border: '3px solid #007bff40'});
  console.log(myStyle);
}

const handleBlurZipRequest = (e) => {
e.preventDefault();
setZipStyle({border: '2px solid #074b69'});
console.log(myStyle);
}


 //CATEGORIES 
  const shouldRenderProviders = (category) => {
    return category.is_subcategory || category.children.length === 0;
  };

  const getData = () => {
      axios
        .get('/api/categories/listTopLevel')
        .then((res) => {
          setCategories(Object.values(res.data));
          setLoadingComplete(true);
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(`/api/categories/${props.id}`)
        .then((res) => {
          const queryParam = shouldRenderProviders(res.data)
            ? 'providers'
            : 'children';
          console.log(queryParam);
          axios
            .get(`/api/categories/${props.id}`, {
              params: { [queryParam]: true },
            })
            .then((res) => {
              setCategory(res.data);
              if(!res.data.is_subcategory){
                setParent(res.data.name);
              //console.log(res.data.name);
              }
              setLoadingComplete(true);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
  };
  // Runs when props.id changes (including on initial mount)
  useEffect(() => {
    setCategories(null);
    setCategory(null);
    setLoadingComplete(false);
    getData();
  }, [props.id]);

  const handleDropChange = (event) => {
    setGender(event.target.value);
    console.log(gender);
  };
  const handleEntailmentRequest = (e) => {
		e.preventDefault();
		setVisible(!visible);
		console.log(visible);
	
  };

  const handleClick = (e) => {
    e.preventDefault()
}

//console.log(props);
//console.log(TopLevelCategory.propTypes);
  return (
    
    <React.Fragment >
        <div class='menu-container' >
        <Alert
          variant='primary'
          className='menu scroll'
        >
          <Row className=' menu-title title-title top-title'>
                Filters
          </Row>
         
          {/*<Row className='justify-content-center'>
          <NavLink to={paths.safeplacesPath} onClick={(e)=>handleClick(e)} className='menuButton disabled' activeClassName='navbar-active active'>
                    <i class="fal fa-hands-heart"></i>
                        Locate my nearest safe place
          </NavLink>
            <RedirectButton className='menuButton disabled'>
              <i class="far fa-hands-heart"  ></i>
              <span className="menu-name">Locate my nearest safe place</span>
          </RedirectButton>
          </Row>*/}
            <Form >
            <Form.Group>
          <Row className='title-con'>
          {/*<NavLink to={paths.searchPath} className='menuButton' activeClassName='navbar-active active'>
          <i class="fal fa-search"></i>
              Search for a resource
</NavLink>*/}
             <Container className = 'mobile-con' style={{margin:'0 0'}}>
             <div className='widgetTitle'>NAME</div>
              <InputGroup>
              <Form.Control
                value={filterText}
                onChange={handleFilterChange}
                onFocus={(e)=>handleFocusRequest(e)}
                onBlur={(e)=>handleBlurRequest(e)}
                placeholder='Provider Name'
                className='widget'
              />
              </InputGroup>
              </Container>
              <Container className = 'mobile-con ' style={{margin:'0 0'}}>
              <div className='widgetTitle'>ZIP CODE</div>
              <InputGroup>
              <Form.Control
                value={filterZipText}
                onChange={handleFilterZipChange}
                onFocus={(e)=>handleFocusZipRequest(e)}
                onBlur={(e)=>handleBlurZipRequest(e)}
                placeholder='Zip Code'
                className='widget'
              />
    
              </InputGroup>
              </Container>
           {/* <RedirectButton className='menuButton' path={paths.searchPath}  active={search}>
              <i class="far fa-search"  ></i>
              <span className="menu-name">Search for a resource</span>
</RedirectButton>*/}
          </Row>
          <hr></hr>
          <Row className='title-con'>
          <div className='widgetTitle'>CATEGORIES</div>
            <Dropdown className='widgetDropdown'>
                <div className='widgetSubtitle'>Main Category</div>
              <Dropdown.Toggle className='widgetToggle' variant="secondary" id="dropdown-basic">
                Main Category
              </Dropdown.Toggle>

              <Dropdown.Menu className='widgetDropdown'>
                <Dropdown.Item href="#/action-1">Female</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Male</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Non Binary</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className='widgetDropdown'>
            <div className='widgetSubtitle'>Sub Category</div>
              <Dropdown.Toggle className='widgetToggle' variant="secondary" id="dropdown-basic">
                Sub Category
              </Dropdown.Toggle>

              <Dropdown.Menu className='widgetDropdown'>
                <Dropdown.Item href="#/action-1">Female</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Male</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Non Binary</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Row>
            
          <hr></hr>
          <Row className='title-con'>
            {/*<NavLink to={paths.hotlinesPath} className='menuButton' activeClassName='navbar-active active'>
            <i class="fal fa-phone" ></i>
              Call a hotline
  </NavLink>*/}
            <div className='widgetTitle'>FILTERS</div>
            <Container className = 'mobile-con' style={{margin:'0 0'}}>
            <div className='widgetSubtitle'>Age</div>
              <InputGroup>
              <Form.Control
              value={filterAgeText}
              onChange={handleFilterAgeChange}
                onFocus={(e)=>handleFocusRequest(e)}
                onBlur={(e)=>handleBlurRequest(e)}
                placeholder='Age'
                className='widget'
              />
    
              </InputGroup>
              </Container>
              <Dropdown className='widgetDropdown'>
              <div className='widgetSubtitle'>Gender</div>
              <Dropdown.Toggle className='widgetToggle' variant="secondary" id="dropdown-basic">
                Gender
              </Dropdown.Toggle>

              <Dropdown.Menu  onChange={handleDropChange} className='widgetDropdown'>
                <Dropdown.Item value="female">Female</Dropdown.Item>
                <Dropdown.Item value="male">Male</Dropdown.Item>
                <Dropdown.Item value="non_binary">Non Binary</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Row>
          <Button className='widgetButton' variant="primary" type="submit">
              Search
            </Button>
            <Button className='widgetButton' variant="link">Clear filters</Button>
          </Form.Group>
              </Form>
          <Row className='justify-content-center' style={{ margin: 'auto' }}>
            <Col xs={11} className='phrase'>
              <div>
              Spot something wrong or want to add a new resource? Let us know!
              </div>
              <Button className='title-links top-link' variant="link" href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_74157YeIb6ttlYx' target='_blank'>Feedback</Button>
              <Button className='title-links'  variant="link" href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_bNMcXknvBcVfxoV' target='_blank'>Add a Resource</Button>
            </Col>
          </Row>
        </Alert>
        </div>
      {/*<div class="exit-container">
      <button onClick={(e) => handleEntailmentRequest(e)} class='menu-buttons exit' style={{display: !visible ? '' : 'none'}}>
              <i class="fal fa-times fa-2x"  ></i>
  </button>
  
      </div>
      </div>
      <div class="exit-container">
      <button onClick={(e) => handleEntailmentRequest(e)} class='menu-buttons exit' style={{display: visible ? '' : 'none'}}><i class="fal fa-bars"></i></button>
</div>*/}
    </React.Fragment>
  );
};

export default Homepage;
