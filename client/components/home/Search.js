import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Breadcrumb, ListGroup, Container, Form, InputGroup, Button, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../../RouterPaths';
import Title from './Title';
import '../../index.scss';
import './Search.scss';
import IndivProvider from './IndivProvider';
import TopLevelCategory from './category/TopLevelCategory.js';
import CategoryView from './category/CategoryView.js';

// Search component for all providers,
// When provider is clicked redirects to
// individual provider view

const Search = (props) => {
  var d = new Date();
  var n = d.getDay();
  const [providers, setProviders] = useState([]);
  const [providerIds, setProviderIds] = useState([]);
  const [visible, setVisible] = useState(false);
  const [myStyle, setStyle] = useState ({borderColor: 'default'});
  const [clicked, setClicked] = useState(false);
  const [pid, setPid] = useState('');
  const [marginTop, setMarginTop] = useState('300px');

 


  var queryString = decodeURIComponent(window.location.search);
  var queries;
  queryString = queryString.substring(1); 
  queries = queryString.split("&");
  const [filterText, setFilterText] = useState( queries[0].split("=")[1] ? queries[0].split("=")[1] : '');
  const [filterZipText, setFilterZipText] = useState(queries[1].split("=")[1] ? queries[1].split("=")[1]: '');
  const [filterAgeText, setFilterAgeText] = useState(queries[2].split("=")[1] ? queries[2].split("=")[1]: '');
  const [gender, setGender] = useState(queries[3].split("=")[1] ? queries[3].split("=")[1]: 'Not Selected');
  const [cat, setCat] = useState('Not Selected');
  const [subcat, setSubcat] = useState('Not Selected');
  const [catId, setCatId] = useState(queries[4].split("=")[1] ? queries[4].split("=")[1]:'');
  const [subcatId, setSubcatId] = useState(queries[5].split("=")[1] ? queries[5].split("=")[1]:'');
  const [loadingComplete, setLoadingComplete] = useState(subcatId=='' ? true : false);
  const [loadingCompleteSub, setLoadingCompleteSub] = useState(subcatId=='' ? true : false);
  const [className, setClassname] = useState('')
  const [showFilter, setShowFilter] = useState(catId == '' && subcatId == '' && gender=='Not Selected' && filterAgeText=='' && filterText == '' && filterZipText == "" ? false : true);
  const [showMap, setShowMap] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(catId != '' && subcatId == '' ? true : false);
  // Loads in all providers for filtering through
  useEffect(() => {
    if(subcatId != ''){
      axios
      .get(`/api/categories/${catId}`)
      .then((res) => {
        setCat(res.data.name)
        setLoadingComplete(true);
        
      })
      .catch((err) => {
        console.log(err);
      });
      axios
      .get(`/api/categories/${subcatId}`)
      .then((res) => {
        setProviderIds(res.data.resources);
        setSubcat(res.data.name);
        setLoadingCompleteSub(true);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    
      axios
      .get(`/api/locations/list`)
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
  };

  const open = (provider) => {
    var h = d.getHours() * 3600;
    var m = d.getMinutes() * 60;
    var s = d.getSeconds();
    var sum = s + m + h;
    console.log(d);
    var daylist = ["sunday","monday","tuesday","wednesday ","thursday","friday","saturday"];
    var openclose = "Closed Now";
    switch(n){
      case 0:
        if(provider.hours.sunday !== undefined){
          if(sum <= provider.hours.sunday.close && sum >= provider.hours.sunday.open)
            openclose = 'Open Now';
        }
        break;
      case 1:
        if(provider.hours.monday !== undefined){
          if(sum <= provider.hours.monday.close && sum >= provider.hours.monday.open)
            openclose = 'Open Now';
        }
        break;
      case 2:
        if(provider.hours.tuesday !== undefined){
          if(sum <= provider.hours.tuesday.close && sum >= provider.hours.tuesday.open)
            openclose = 'Open Now';
        }
        break;
      case 3:
        if(provider.hours.wednesday !== undefined){
          if(sum <= provider.hours.wednesday.close && sum >= provider.hours.wednesday.open)
            openclose = 'Open Now';
        }
        break;
      case 4:
        if(provider.hours.thursday !== undefined){
          if(sum <= provider.hours.thursday.close && sum >= provider.hours.thursday.open)
            openclose = 'Open Now';
        }
        break;
      case 5:
        if(provider.hours.friday !== undefined){
          if(sum <= provider.hours.friday.close && sum >= provider.hours.friday.open)
            openclose = 'Open Now';
        }
        break;
      case 6:
        if(provider.hours.saturday !== undefined){
          if(sum <= provider.hours.saturday.close && sum >= provider.hours.saturday.open)
            openclose = 'Open Now';
        }
        break;
    };
    return (
    <span><i class="fas fa-clock " style={{color: "black !important", marginRight: ".5rem"}}></i>{openclose}</span>
    );
    
  }

  const convertTime = (time) => {
    var hours = Math.floor((time/3600)+.49);
    var minutes = Math.ceil(((time - (hours*3600))/60)-.5); 
    if(minutes < 0)
      minutes = 0;
    var ampm = 'am';
    if (hours == 24){
      hours = 12;
    }
    else if(hours >= 12){
      ampm = 'pm';
      if(hours > 12)
        hours -= 12;
    }
      
    return hours + ":" + (minutes < 10 ? '0' + minutes: minutes ) + ampm;
  }
  
  const renderHours = (provider) => {
    return (
      <React.Fragment>
      <span><i class="fas fa-clock" style={{marginRight: ".5rem", color: 'black !important'}}></i></span>
      <span>
        
        {provider.hours == undefined || provider.hours == '' || ((provider.hours.monday == undefined || provider.hours.monday == '') && (provider.hours.tuesday == undefined || provider.hours.tuesday == '') && (provider.hours.wednesday == undefined ||
        provider.hours.wednesday == '') && (provider.hours.thursday == undefined || provider.hours.thursday == '') && (provider.hours.friday == undefined || provider.hours.friday == '') && (provider.hours.saturday == undefined || provider.hours.saturday == '') && (provider.hours.sunday == undefined || provider.hours.sunday == '')) ? 'No hours listed.': '' }
        {provider.hours.monday !== undefined && provider.hours.monday !== ''
          ?( <div style={n == 1 ? {color: '#20668F'} : null}>Monday: {convertTime(provider.hours.monday.open)} - {convertTime(provider.hours.monday.close)}<br></br></div>)
          : ''}
        
        {provider.hours.tuesday !== undefined && provider.hours.tuesday !== ''
          ? ( <div style={n == 2 ? {color: '#20668F'} : null}>Tuesday: {convertTime(provider.hours.tuesday.open)} - {convertTime(provider.hours.tuesday.close)}<br></br></div>)
          : ''}
       
        {provider.hours.wednesday !== undefined &&
        provider.hours.wednesday !== ''
          ? ( <div style={n == 3 ? {color: '#20668F'} : null}>Wednesday: {convertTime(provider.hours.wednesday.open)} - {convertTime(provider.hours.wednesday.close)}<br></br></div>)
          : ''}
          
        {provider.hours.thursday !== undefined && provider.hours.thursday !== ''
          ? ( <div style={n == 4 ? {color: '#20668F'} : null}>Thursday: {convertTime(provider.hours.thursday.open)} - {convertTime(provider.hours.thursday.close)}<br></br></div>)
          : ''}
          
        {provider.hours.friday !== undefined && provider.hours.friday !== ''
          ? ( <div style={n == 5 ? {color: '#20668F'} : null}>Friday: {convertTime(provider.hours.friday.open)} - {convertTime(provider.hours.friday.close)}<br></br></div>)
          : ''}
          
        {provider.hours.saturday !== undefined && provider.hours.saturday !== ''
          ? ( <div style={n == 6 ? {color: '#20668F'} : null}>Saturday: {convertTime(provider.hours.saturday.open)} - {convertTime(provider.hours.saturday.close)}<br></br></div>)
          : ''}
          
        {provider.hours.sunday !== undefined && provider.hours.sunday !== ''
          ? ( <div style={n == 0 ? {color: '#20668F'} : null}>Sunday: {convertTime(provider.hours.sunday.open)} - {convertTime(provider.hours.sunday.close)}<br></br></div>)
          : ''}
      </span>
      </React.Fragment>
    );
  };
  const handleArrowClickedRequest = () => {
    setClicked(!clicked);
}

  const handleClickedRequest = (id) => {
    if(pid != id)
      setClicked(false);
    setPid(id);
   // setClassname('active');
}

const handleFilterClickedRequest = () => {
  setShowFilter(!showFilter);
}

const handleMobileFilterClickedRequest = () => {
  setShowMobileFilter(!showMobileFilter);
}

const handleMapClickedRequest = () => {
  setShowMap(!showMap);
}


  const doRedirect = (providerId) => {
    props.history.push(`${paths.providerDetailPath}/${providerId}/?main=${catId}&sub=${subcatId}`);
  };

  const providerList = (loadingComplete && loadingCompleteSub) ? providers
    .filter((provider) => {
      return ( providerIds.length != 0 ? providerIds.includes(provider.resource) : provider
      );
    })
    .filter((provider) => {
      return ( provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
                     provider.id.includes(filterText)
      );
    }) 
   .filter((provider) => {
      return ( provider.address && filterZipText != '' ? provider.address.zipcode.toLowerCase().includes(filterZipText) : filterZipText == '' ? provider : null
      );
    }) 
    .filter((provider) => {
      return (provider.eligibility_criteria && filterAgeText != '' ? (parseInt(filterAgeText) >= provider.eligibility_criteria.min_age && parseInt(filterAgeText) <= provider.eligibility_criteria.max_age) : filterAgeText == '' ? provider : null
      );
    })
    .filter((provider) => {
      return ( gender != 'Not Selected' ? provider.eligibility_criteria ? provider.eligibility_criteria.gender ? (gender == 'Female' ? provider.eligibility_criteria.gender.female : gender == 'Male' ? provider.eligibility_criteria.gender.male : gender == 'Non Binary' ? provider.eligibility_criteria.gender.non_binary : null) : null : null : provider
      );
    })

    .sort((a, b) => (a.name > b.name) ? 1 : -1)

    .map((provider) => {
      return (
        <React.Fragment>
        <div className='providerCard-container' key={provider.id} style={pid==provider.id ? {border: '1px solid #20668F'} : null}>
        <ListGroup.Item
        
          key={provider.id}
          id={provider.id}
          action
          onClick={() => doRedirect(provider.id)}
          className = 'providersList'
          
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <h5 class='providerName'>
              {provider.name}
             
            </h5>
            
           {provider.address !== undefined 
                  ? 
                    <div>
                    <i class="fas fa-map-marker-alt" style={{marginRight: ".5rem", color:'black'}}></i>
              <span key={`${provider.id}_address`}>
                {provider.address.street_1 + (provider.address.street_2 != '' ? ', ' + provider.address.street_2 : '')}
                {/*{'\n'}
                {addresses.state} {addresses.zipcode}*/}
              </span>
              </div> : null}
              {provider.hours !== undefined ?
              (<div >
                {pid == provider.id && clicked ? (<div className='list-hours-2'>{ renderHours(provider)}
                {pid == provider.id ? (<Button className='arrow' onClick={handleArrowClickedRequest}><i class="far fa-angle-up"></i></Button>) : null}</div>)
                :  pid==provider.id ? <div class='list-hours' style={{color: '#20668F'}}>{ open(provider)}
                {pid == provider.id ? (<Button className='arrow' onClick={handleArrowClickedRequest}><i class="far fa-angle-down"></i></Button>) : null}</div> : <div class='list-hours' >{ open(provider)}
                {pid == provider.id ? (<Button className='arrow' onClick={handleArrowClickedRequest}><i class="far fa-angle-down"></i></Button>) : null}</div>
              }
              </div>)
              : null}
            <p className="services">
              {provider.services_offered !== '' &&
                provider.services_offered !== undefined
                  ? provider.services_offered.description !== '' &&
                  provider.services_offered.description !== undefined ? provider.services_offered.description.length < 250 ? (provider.services_offered.description.includes('●') || provider.services_offered.description.includes('•') || provider.services_offered.description.includes('*')? provider.services_offered.description.split(/['●'||'•'||'*']/).map((line)=> {return(line !== "" && line !== "\n" ? ('• '+ line.trim() +'\n') : null)}) : `${provider.services_offered.description} \n`): provider.services_offered.description.substring(0, 250) +'...'
                  : 'Services not listed' : 'Services not listed'} 
            </p>
              {/*pid == provider.id ? <Button className='more-info' onClick={() => doRedirect(provider.id)}>MORE INFO  <i class="far fa-angle-right"></i></Button>  : null*/}
          </div>
        </ListGroup.Item>
        </div>
        </React.Fragment>
      );
    }) : [];

    const handleEntailmentRequest = (e) => {
      e.preventDefault();
      setVisible(!visible);
      console.log(visible);
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



let breadcrumbs = <React.Fragment><Breadcrumb.Item href={`${paths.providerPath}/?name=&zip=&age=&gender=&main=&sub=`}>Providers</Breadcrumb.Item></React.Fragment>;

if(loadingComplete && loadingCompleteSub && subcatId != ''){
  breadcrumbs = (
    <React.Fragment>
      {breadcrumbs}
      <Breadcrumb.Item >{cat}</Breadcrumb.Item>
      <Breadcrumb.Item href={`${paths.providerPath}/?name=${filterText}&zip=${filterZipText}&age=${filterAgeText}&gender=${gender}&main=${catId}&sub=${subcatId}`}>{subcat}</Breadcrumb.Item>
    </React.Fragment>
  );
}

/*if(window.innerWidth <= 767){
  setMarginTop('300px');
}
else if(window.innerWidth >= 401 && window.innerWidth <= 1024){
  //setMarginTop('430px');
}
else if(window.innerWidth >= 426 && window.innerWidth <= 767){

}*/

  return (
    <React.Fragment>
      <div className='mobile-filter-bread-con'>
      <Breadcrumb className='breadcrumbs'>
        {breadcrumbs}
      </Breadcrumb>
      {!showMobileFilter ? <div className='filter-con mobile-filter'><Button className='filter-btn' onClick={handleMapClickedRequest}>{!showMap ? <div><i class="fas fa-map"></i><strong> MAP VIEW</strong></div> : <div><i class="fas fa-list-ul"></i><strong> LIST VIEW</strong></div>} </Button><Button className='filter-btn' onClick={handleMobileFilterClickedRequest}><strong> FILTER PROVIDERS</strong> {showMobileFilter ? <i class="fas fa-chevron-circle-left"></i> : <i class="fas fa-chevron-circle-right"></i>}</Button></div>: null}
      {showMobileFilter ? <div className='filter-con mobile-filter'><Button className='filter-btn' onClick={handleMobileFilterClickedRequest}>{showMobileFilter ? <i class="fas fa-chevron-circle-left"></i> : <i class="fas fa-chevron-circle-right"></i>} <strong> FILTER PROVIDERS</strong></Button></div> : null}
      {showMap && !showMobileFilter ? <div class='map'>MAP</div>
          : null}
      </div>
      {showFilter? <div className="noDisplay"><Title/></div>: null}
      {showMobileFilter? <div className='mobile-title'><Title/></div>: null}
      
      <div className='mapPage-con noDisplay' style={showFilter ? {width: '80%'}: {width: '100%'}}>
      <div id="topOfListMobile"  className='search-con ' >
      
        
          {/*<Form className= 'white-0-bg search-form'>
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
            <div className='search-cat-con'><p className='search-cat'><Button onClick={(e)=>handleEntailmentRequest(e)} className='search-cat-button' style={{display: !visible ? '' : 'none'}}>Browse by Category <i class="fal fa-chevron-down" style={{color:'black !important'}}></i></Button><Button onClick={(e)=>handleEntailmentRequest(e)} className='search-cat-button' style={{display: visible ? '' : 'none'}}>Browse by Category <i class="fal fa-chevron-up"></i></Button></p><div className="cat-mobile-container" style={{display: visible ? '' : 'none'}}><CategoryView/></div></div>
  </Form>*/}
          <Container id="topOfList" className='body searchb'>
          <div className='filter-con desktop-filter'><Button className='filter-btn' onClick={handleFilterClickedRequest}>{showFilter ? <i class="fas fa-chevron-circle-left"></i> : <i class="fas fa-chevron-circle-right"></i>} <strong> FILTER PROVIDERS</strong></Button></div>
          <ListGroup  variant = 'flush' className ='noDisplay scroll'>{providerList}</ListGroup>
            

  </Container>

         </div>
         <div class='map-desk' style={showFilter ? {width: '40%'}: {width: '50%'}}>MAP</div>
          </div>
          
         <div className='mapPage-con mobile-mapPage-con' style={{width: '100%'}}>
         
      <div id="topOfListMobile"  className='search-con ' >

        
          {/*<Form className= 'white-0-bg search-form'>
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
            <div className='search-cat-con'><p className='search-cat'><Button onClick={(e)=>handleEntailmentRequest(e)} className='search-cat-button' style={{display: !visible ? '' : 'none'}}>Browse by Category <i class="fal fa-chevron-down" style={{color:'black !important'}}></i></Button><Button onClick={(e)=>handleEntailmentRequest(e)} className='search-cat-button' style={{display: visible ? '' : 'none'}}>Browse by Category <i class="fal fa-chevron-up"></i></Button></p><div className="cat-mobile-container" style={{display: visible ? '' : 'none'}}><CategoryView/></div></div>
  </Form>*/}
          <Container id="topOfList" className='body searchb' style={showMap ? {marginTop: '50vh'} : null}>
            {!showMobileFilter ? <ListGroup  variant = 'flush' className =' scroll'>{providerList}</ListGroup>: null}
            

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
