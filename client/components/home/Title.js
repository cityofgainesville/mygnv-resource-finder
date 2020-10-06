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
  var sublisting = [];
  queryString = queryString.substring(1); 
  /*console.log(queryString);
  if(queryString.includes(' & ')){
    queryString.replaceAll(/\s/g,'\-');
    console.log(queryString);
  }*/
  queries = queryString.split("&");
  
  
  const [providers, setProviders] = useState([]);
  const [filterText, setFilterText] = useState( queries[0].split("=")[1] ? queries[0].split("=")[1] : '');
  const [filterZipText, setFilterZipText] = useState(queries[1].split("=")[1] ? queries[1].split("=")[1]: '');
  const [filterAgeText, setFilterAgeText] = useState(queries[2].split("=")[1] ? queries[2].split("=")[1]: '');
  const [gender, setGender] = useState(queries[3].split("=")[1] ? queries[3].split("=")[1]: 'Not Selected');
  const [cat, setCat] = useState('Not Selected');
  const [subcat, setSubcat] = useState('Not Selected');
  //const [cat, setCat] = useState(queries[4].split("=")[1] ? queries[4].split("=")[1]: 'Not Selected');
  //const [subcat, setSubcat] = useState(queries[5].split("=")[1] ? queries[5].split("=")[1]: 'Not Selected');
  const [catId, setCatId] = useState(queries[4].split("=")[1] ? queries[4].split("=")[1]:'');
  const [subcatId, setSubcatId] = useState(queries[5].split("=")[1] ? queries[5].split("=")[1]:'');
  const [visible, setVisible] = useState(false);
  const [hotline, setHotline] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(null);
  const [subcategories, setSubcategories] = useState(null);
  const [parent, setParent] = useState('');
  const [category, setCategory] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadingCompleteSub, setLoadingCompleteSub] = useState(false);
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

  // Runs when props.id changes (including on initial mount)
  useEffect(() => {
    setCategories(null);
    setSubcategories(null);
    setCategory(null);
    setLoadingComplete(false);
    setLoadingCompleteSub(false);
    getData();
  }, [catId]);

 

  const getData = () => {
    
      axios
        .get('/api/categories/listTopLevel')
        .then((res) => {
          setCategories(Object.values(res.data).sort((a, b) => (a.name > b.name) ? 1 : -1));
          setLoadingComplete(true);
          console.log(categories);
          
        })
        .catch((err) => {
          console.log(err);
        });
    if(catId != ""){
     
      axios
        .get(`/api/categories/${catId}`)
        .then((res) => {
          const queryParam = shouldRenderProviders(res.data)
            ? 'providers'
            : 'children';
          console.log(queryParam);
          axios
            .get(`/api/categories/${catId}`, {
              params: { [queryParam]: true },
            })
            .then((res) => {
              setCategory(res.data);
              
              res.data.children.forEach((child, i) => {
                console.log(child);
              axios
                      .get(`/api/categories/${child}`)
                      .then((res2) => {
                        //setCategories(res2.data);
                        sublisting.push(res2.data);
                        console.log(res2.data);
                  
                        setSubcategories(Object.values(sublisting).sort((a, b) => (a.name > b.name) ? 1 : -1));
                        //console.log(res.data.children);
                        //if(!res.data.is_subcategory){
                          //setParent(res.data.name);
                        //console.log(res.data.name);
                       // }
                       //console.log(res.data.children.length);
                       //console.log(i+1);
                       if(res.data.children.length == i+1)
                          setLoadingCompleteSub(true);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    });
                    console.log(sublisting);
                    console.log(sublisting.length);
                //setSubcategories([sublisting[0], sublisting[1], sublisting[2]]);
                console.log(subcategories);
              if(!res.data.is_subcategory){
                setParent(res.data.name);
              //console.log(res.data.name);
              }
              //setLoadingComplete(true);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
  };
};
  

  const handleDropChange = (event) => {
    setGender(event);
    console.log(gender);
  };

  const handleDropCatChange = (event) => {
    setCat(event);
    if(!(subcatId != "" && subcat == 'Not Selected')){
      setSubcat("Not Selected");
    setSubcatId('');
    console.log("4");
    }
    
    var selected = false;
    categories.forEach((category) => {
      console.log(event);
      if(category.name == event){
        setCatId(category.id);
        selected = true;
      }
    });
    
    if(catId != "" && !selected){
      categories.forEach((category) => {
        //console.log(category);
        if(category.id == catId){
          setCat(category.name);
        }
      });
    }
    
  };

  const handleDropSubcatChange = (event) => {
    setSubcat(event);
    var selected = false;
    console.log("2");
    subcategories.forEach((category) => {
      console.log(event);
      if(category.name == event){
        setSubcatId(category.id);
        selected = true;
        console.log("1");
      }
    });
    
    if(subcatId != "" && !selected){
      console.log(subcategories.length);
      subcategories.forEach((category) => {
        console.log(category.id);
        console.log(subcatId);
        console.log("5");
        if(category.id == subcatId){
          setSubcat(category.name);
          console.log("3");
        }
      });
    }
    console.log(subcat);
  };
  const handleEntailmentRequest = (e) => {
		e.preventDefault();
		setVisible(!visible);
		console.log(visible);
	
  };

  const handleClick = (e) => {
    e.preventDefault()
}

const clear = (e) => {
  //e.preventDefault();
  setCat('Not Selected');
  setCatId('');
  setSubcat('Not Selected');
  setSubcatId('');
  setGender('Not Selected');
  setFilterText('');
  setFilterAgeText('');
  setFilterZipText('');
}

const handleKeyPress = (event) => {
  if(event.key === 'Enter'){
    //props.history.push(`${paths.providerPath}/?name=${filterText}&zip=${filterZipText}&age=${filterAgeText}&gender=${gender}&main=${catId}&sub=${subcatId}`);
  }
} ; 

let dropList = <React.Fragment> <Dropdown.Item eventKey="Not Selected" onSelect={handleDropCatChange}>Not Selected</Dropdown.Item></React.Fragment>;
if(loadingComplete)
  categories.forEach((category) => {
    if(catId != "" && cat == 'Not Selected'){
      handleDropCatChange();
    }
    dropList = (
      <React.Fragment>
        {dropList}
        <Dropdown.Item eventKey={category.name} onSelect={handleDropCatChange}>{category.name}</Dropdown.Item>
      </React.Fragment>
    );
  });

  let dropSubcatList = <React.Fragment><Dropdown.Item eventKey="Not Selected" onSelect={handleDropSubcatChange}>Not Selected</Dropdown.Item></React.Fragment>;
  //console.log(sublisting.length);
  
if(loadingCompleteSub && subcategories != null){
  subcategories.forEach((subcategory, i) => {
    if(subcatId != "" && subcat == 'Not Selected'){
      handleDropSubcatChange();
    }
    dropSubcatList = (
      <React.Fragment>
        {dropSubcatList}
        <Dropdown.Item eventKey={subcategory.name} onSelect={handleDropSubcatChange}>{subcategory.name}</Dropdown.Item>
      </React.Fragment>
    );
  });
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
            <Form className='filter-form' id='filter-form-id'>
            <Form.Group>
          <Row className='title-con'>
          {/*<NavLink to={paths.searchPath} className='menuButton' activeClassName='navbar-active active'>
          <i class="fal fa-search"></i>
              Search for a resource
</NavLink>*/}
             <Container className = 'mobile-con mobile-text-input' style={{margin:'0 0'}}>
             <div className='widgetTitle'>NAME</div>
              <InputGroup>
              <Form.Control
                value={filterText}
                onChange={handleFilterChange}
                onFocus={(e)=>handleFocusRequest(e)}
                onBlur={(e)=>handleBlurRequest(e)}
                onKeyPress={handleKeyPress}
                placeholder='Provider Name'
                className='widget'
              />
              </InputGroup>
              </Container>
              <Container className = 'mobile-con mobile-text-input' style={{margin:'0 0'}}>
              <div className='widgetTitle'>ZIP CODE</div>
              <InputGroup>
              <Form.Control
                value={filterZipText}
                onChange={handleFilterZipChange}
                onKeyPress={handleKeyPress}
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
                {cat}
              </Dropdown.Toggle>

              <Dropdown.Menu className='widgetDropdown'>
                {dropList}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className='widgetDropdown'>
            <div className='widgetSubtitle'>Sub Category</div>
              <Dropdown.Toggle className='widgetToggle' variant="secondary" id="dropdown-basic">
                {subcat}
              </Dropdown.Toggle>

              <Dropdown.Menu className='widgetDropdown'>
                {dropSubcatList}
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
            <Container className = 'mobile-con mobile-text-input' style={{margin:'0 0'}}>
            <div className='widgetSubtitle'>Age</div>
              <InputGroup>
              <Form.Control
              value={filterAgeText}
              onChange={handleFilterAgeChange}
              onKeyPress={handleKeyPress}
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
                {gender}
              </Dropdown.Toggle>

              <Dropdown.Menu  className='widgetDropdown'>
              <Dropdown.Item eventKey="Not Selected" onSelect={handleDropChange}>Not Selected</Dropdown.Item>
                <Dropdown.Item eventKey="Female" onSelect={handleDropChange}>Female</Dropdown.Item>
                <Dropdown.Item eventKey="Male" onSelect={handleDropChange}>Male</Dropdown.Item>
                <Dropdown.Item eventKey="Non Binary" onSelect={handleDropChange}>Non Binary</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Row>
          <Button className='widgetButton' id='search-widget' variant="primary" type="submit" href={`${paths.providerPath}/?name=${filterText}&zip=${filterZipText}&age=${filterAgeText}&gender=${gender}&main=${catId}&sub=${subcatId}`}>
              Search
            </Button>
            <Button className='widgetButton' id='clear-widget' variant="link" onClick={clear}>Clear filters</Button>
          </Form.Group>
              </Form>
          <Row className='justify-content-center noDisplay' style={{ margin: 'auto' }}>
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
