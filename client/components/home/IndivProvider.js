import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Breadcrumb, Container, Card, Form, Button, Row, Col} from 'react-bootstrap';
import Homepage from './Title';
import paths from '../../RouterPaths';
import '../../index.scss';
import './IndivProvider.scss';
// This component renders the individual provider view,
// with more detail
// Checks fields for validity to prevent crashes if undefined

const IndivProvider = (props) => {
  var queryString = decodeURIComponent(window.location.search);
  console.log(queryString);
  var queries;
  queryString = queryString.substring(1); 
  queries = queryString.split("&");
  const [provider, setProvider] = useState(null);
  const [visible, setVisible] = useState(false);
  const [hours, setHours] = useState(true);
  const [services, setServices] = useState(false);
  const [appt, setAppt] = useState(false);
  const [info, setInfo] = useState(false);
  const [cat, setCat] = useState('');
  const [subcat, setSubcat] = useState('');
  const [catId, setCatId] = useState(queries[0].split("=")[1] ? queries[0].split("=")[1]:'');
  const [subcatId, setSubcatId] = useState(queries[1].split("=")[1] ? queries[1].split("=")[1]:'');
  const [loadingComplete, setLoadingComplete] = useState(subcatId=='' ? true : false);
  const [loadingCompleteP, setLoadingCompleteP] = useState(false);
  const [loadingCompleteSub, setLoadingCompleteSub] = useState(subcatId=='' ? true : false);

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
        setSubcat(res.data.name);
        setLoadingCompleteSub(true);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    
  }, []);


  // Get provider from backend based on id passed in
  useEffect(() => {
    axios
      .get(`/api/locations/${props.id}`)
      .then((res) => {
        setProvider(res.data);
        setLoadingCompleteP(true)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addBreakToEnd = (string) => {
    return (
      <React.Fragment>
        {string}
        <br />
      </React.Fragment>
    );
  };

  const clickHours = (e) => {
    e.preventDefault();
    setHours(true);
    setInfo(false);
    setServices(false);
    setAppt(false);
  }

  const clickServices = (e) => {
    e.preventDefault();
    setHours(false);
    setInfo(false);
    setServices(true);
    setAppt(false);
  }

  const clickAppt = (e) => {
    e.preventDefault();
    setHours(false);
    setInfo(false);
    setServices(false);
    setAppt(true);
  }

  const clickInfo = (e) => {
    e.preventDefault();
    setHours(false);
    setInfo(true);
    setServices(false);
    setAppt(false);
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

  const renderHours = () => {
    return (
      <Card.Text className='hours-left'>
        <div><strong className="subtitle ">Hours:<br></br></strong></div>
        {provider.hours == undefined || provider.hours == '' || ((provider.hours.monday == undefined || provider.hours.monday == '') && (provider.hours.tuesday == undefined || provider.hours.tuesday == '') && (provider.hours.wednesday == undefined ||
        provider.hours.wednesday == '') && (provider.hours.thursday == undefined || provider.hours.thursday == '') && (provider.hours.friday == undefined || provider.hours.friday == '') && (provider.hours.saturday == undefined || provider.hours.saturday == '') && (provider.hours.sunday == undefined || provider.hours.sunday == '')) ? 'No hours listed.': '' }
        {provider.hours.monday !== undefined && provider.hours.monday !== ''
          ?( <div>Monday: {convertTime(provider.hours.monday.open)} - {convertTime(provider.hours.monday.close)}<br></br><br></br></div>)
          : ''}
        
        {provider.hours.tuesday !== undefined && provider.hours.tuesday !== ''
          ? ( <div>Tuesday: {convertTime(provider.hours.tuesday.open)} - {convertTime(provider.hours.tuesday.close)}<br></br><br></br></div>)
          : ''}
       
        {provider.hours.wednesday !== undefined &&
        provider.hours.wednesday !== ''
          ? ( <div>Wednesday: {convertTime(provider.hours.wednesday.open)} - {convertTime(provider.hours.wednesday.close)}<br></br><br></br></div>)
          : ''}
          
        {provider.hours.thursday !== undefined && provider.hours.thursday !== ''
          ? ( <div>Thursday: {convertTime(provider.hours.thursday.open)} - {convertTime(provider.hours.thursday.close)}<br></br><br></br></div>)
          : ''}
          
        {provider.hours.friday !== undefined && provider.hours.friday !== ''
          ? ( <div>Friday: {convertTime(provider.hours.friday.open)} - {convertTime(provider.hours.friday.close)}<br></br><br></br></div>)
          : ''}
          
        {provider.hours.saturday !== undefined && provider.hours.saturday !== ''
          ? ( <div>Saturday: {convertTime(provider.hours.saturday.open)} - {convertTime(provider.hours.saturday.close)}<br></br><br></br></div>)
          : ''}
          
        {provider.hours.sunday !== undefined && provider.hours.sunday !== ''
          ? ( <div>Sunday: {convertTime(provider.hours.sunday.open)} - {convertTime(provider.hours.sunday.close)}<br></br><br></br></div>)
          : ''}
      </Card.Text>
    );
  };

  const br = <br></br>;

  let breadcrumbs = <React.Fragment><Breadcrumb.Item href={`${paths.providerPath}/?name=&zip=&age=&gender=&main=&sub=`}>Provider</Breadcrumb.Item></React.Fragment>;

if(loadingComplete && loadingCompleteSub && subcatId != '' && loadingCompleteP){
  breadcrumbs = (
    <React.Fragment>
      {breadcrumbs}
      <Breadcrumb.Item >{cat}</Breadcrumb.Item>
      <Breadcrumb.Item href={`${paths.providerPath}/?name=&zip=&age=&gender=&main=${catId}&sub=${subcatId}`}>{subcat}</Breadcrumb.Item>
      <Breadcrumb.Item href='#'>{provider.name}</Breadcrumb.Item>
    </React.Fragment>
  );
}

  return (
    <React.Fragment>
      <div className='mobile-filter-bread-con'>
       <Breadcrumb className='breadcrumbs'>
        {breadcrumbs}
      </Breadcrumb>
      </div>
      <div >
      <div
        className='search-con indiv-container scroll'

      >
          {/*<Form className= 'white-0-bg' className='search-form'>
            <Form.Group controlId='formFilterText'>
              
              <Container style={{margin:'0 0'}}>
			  <Form.Label>
				  
              </Form.Label>
              </Container>
            </Form.Group>
  </Form>*/}
      {!provider ? null : (
        <Container className='body provider'>
          <Card
            color='#000'
            className="providerCard-container indiv-con"
            id="main-info"
          >
            <Card.Title className='text-center p-3 main-title'>
           
                {provider.united_way_approved !== undefined
                  ? provider.united_way_approved
                    ?  <Card.Text className='united-way-mobile'>United Way Approved</Card.Text>
                    : ''
                  : ''}
              
              <Card.Text className='top-left'>
              <h5 className='indivp-name'>{provider.name}</h5>
              </Card.Text>
              <Card.Text className='provider-buttons-con top-right'>
             { provider.phone_number_1
                  ?(<span><Button href={(`tel:${provider.phone_number_1.number}`)} target='_blank' variant='info' className="provider-buttons call">Call</Button></span>):null}
                {provider.appointment.url !== undefined && provider.appointment.url !== ''
             ? ( <span>
                  
                  <Button href={provider.appointment.url} target='_blank' variant='info' className="provider-buttons website">Go to Website</Button></span>) : ''}
                  {provider.address !== undefined 
                  ? (<span><Button href={(`https://www.google.com/maps/place/${provider.address.street_1}+${provider.address.city !== undefined && provider.address.city !== '' ? provider.address.city : 'Gainesville'}+FL+${provider.address.zipcode}/`)} target='_blank' variant='info' className="provider-buttons maps">Maps</Button></span>):null}
                  
              </Card.Text>
             
              </Card.Title>
            <Card.Body className="first-card">
           
            
              <div id='left'>
              <Card.Title className='text-left p-3 description-title mobile-description-title'>Location & Contact</Card.Title>
            <Card.Text>
            
            <div><span><strong className="subtitle">Location:</strong><br></br></span></div>
                {provider.address !== undefined 
                  ? ''
                  : 'No address listed.'}
                {provider.address !== undefined  ? (<a href={(`https://www.google.com/maps/place/${provider.address.street_1}+${provider.address.city !== undefined && provider.address.city !== '' ? provider.address.city : 'Gainesville'}+FL+${provider.address.zipcode}/`)} target='_blank' className="call-link">
                {provider.address !== undefined
                  ? provider.address.street_1
                  : ''}
                {provider.address !== undefined &&
                provider.address.street_2 !== undefined &&
                provider.address.street_2 !== ''
                  ? ', ' + provider.address.street_2
                  : ''}
                {provider.address !== undefined &&
                provider.address.city !== undefined &&
                provider.address.city !== ''
                  ? ', ' + provider.address.city
                  : ''}
                {provider.address !== undefined &&
                provider.address.state !== undefined &&
                provider.address.state !== ''
                  ? ', ' + provider.address.state
                  : ''}
                {provider.address !== undefined &&
                provider.address.zipcode !== undefined &&
                provider.address.zipcode !== ''
                  ? ', ' + provider.address.zipcode
                  : ''}
                </a>) : ''}
                  <Card.Text className='bus'>
                {provider.bus_routes !== undefined &&
                provider.bus_routes !== ''
                  ? 'Bus Route(s): ' + provider.bus_routes
                  : ''}
              </Card.Text>
              </Card.Text>
              
              <Card.Text>
                {provider.phone_number_1 
                  ?(<div><span><strong className="subtitle">Phone Number(s):</strong><br></br>{provider.phone_number_1.name}<br></br><a href={(`tel:${provider.phone_number_1.number}`)} target='_blank' className="call-link">{provider.phone_number_1.number}</a></span></div>)
                  : null}
                 {provider.phone_number_2 
                  ?(<div>{provider.phone_number_2.name}<br></br><a href={(`tel:${provider.phone_number_2.number}`)} target='_blank' className="call-link"> {provider.phone_number_2.number}</a></div>)
                  : null}
              </Card.Text>
              <Card.Text style={{marginBottom: '1rem'}}>
                {provider.email !== undefined && provider.email !== ''
                  ? (<div><span><strong className="subtitle">Email:</strong><br></br><a href = {(`mailto: ${provider.email}`)}>{provider.email}</a></span></div>)
                  : ''}
              </Card.Text>
              
              </div>
              
              <div id='right'>
              <Card.Title className='text-left p-3 description-title mobile-description-title'>Language Translation Offered</Card.Title>
              <span className="subtitle mobile-lang-sub"><strong >Language Translation Offered:</strong><br></br></span>
                {provider.translation_services !== undefined && (provider.translation_services.always_available || provider.translation_services.by_appointment || provider.translation_services.over_phone)
                  ? (<Card.Text class='translation'>Translation services are {provider.translation_services.always_available ? 'always available': ''}{provider.translation_services.always_available && provider.translation_services.by_appointment ? ', by appointment':  provider.translation_services.by_appointment ? 'by appointment': ''}{(provider.translation_services.always_available || provider.translation_services.by_appointment) && provider.translation_services.over_phone ? ', over phone':  provider.translation_services.over_phone ? 'over phone': ''}</Card.Text>)
                  : ''}
         
            
                {provider.languages_available !== undefined ? (
                <Card.Text className='mobile-lang'>
                  {provider.languages_available.english ? (<div><i class="far fa-check" style={{marginRight: ".5rem",color: 'green'}}></i> <span>English</span></div>) : (<div><i class="far fa-times"  style={{marginRight: ".8rem",color: 'red'}}></i>  <span> English</span></div>)}
                  {provider.languages_available.creole ? (<div><i class="far fa-check" style={{marginRight: ".5rem",color: 'green'}}></i> <span>Creole</span></div>) : (<div><i class="far fa-times" style={{marginRight: ".8rem",color: 'red'}}></i>  <span> Creole</span></div>)}
                  {provider.languages_available.hatian ? (<div><i class="far fa-check" style={{marginRight: ".5rem",color: 'green'}}></i> <span>Hatian</span></div>) : (<div><i class="far fa-times" style={{marginRight: ".8rem",color: 'red'}}></i>  <span> Hatian</span></div>)}
                  {provider.languages_available.spanish? (<div><i class="far fa-check" style={{marginRight: ".5rem",color: 'green'}}></i> <span>Spanish</span></div>) : (<div><i class="far fa-times" style={{marginRight: ".8rem",color: 'red'}}></i>  <span> Spanish</span></div>)}
                  {provider.languages_available.others ? (<div><i class="far fa-check" style={{marginRight: ".5rem",color: 'green'}}></i> <span>Others</span></div>) : (<div><i class="far fa-times" style={{marginRight: ".8rem",color: 'red'}}></i>  <span> Others</span></div>)}
                </Card.Text>
                  ) : <Card.Text className='mobile-lang'>No translation services listed.</Card.Text>}
              
              <Card.Text className='united-way'>
                {provider.united_way_approved !== undefined
                  ? provider.united_way_approved
                    ? <strong>United Way Approved</strong>
                    : ''
                  : ''}
              </Card.Text>
             
              </div>
              </Card.Body>
              <Card.Body>
              <Card.Text className='provider-buttons-con mobile-p-btn'>
             { provider.phone_number_1
                  ?(<span><Button href={(`tel:${provider.phone_number_1.number}`)} target='_blank' variant='info' className="provider-buttons call">Call</Button></span>):null}
                {provider.appointment.url !== undefined && provider.appointment.url !== ''
             ? ( <span>
                  
                  <Button href={provider.appointment.url} target='_blank' variant='info' className="provider-buttons website">Go to Website</Button></span>) : ''}
                  {provider.address !== undefined 
                  ? (<span><Button href={(`https://www.google.com/maps/place/${provider.address.street_1}+${provider.address.city !== undefined && provider.address.city !== '' ? provider.address.city : 'Gainesville'}+FL+${provider.address.zipcode}/`)} target='_blank' variant='info' className="provider-buttons maps">Maps</Button></span>):null}
                  
              </Card.Text>
              <div className="hours-card desktop-hours-card">
              <Card.Title className='text-left p-3 description-title mobile-description-title'>Hours</Card.Title>
              <div className ="top-hours-con">
              {provider.hours  &&  provider.hours !== '' ? renderHours() : null}
              {provider.services_frequency !== undefined && (provider.services_frequency.weekly|| provider.services_frequency.monthly || provider.services_frequency.ad_hoc || provider.services_frequency.specific_dates ) ?
              (<Card.Text className='hours-right'>
                {provider.services_frequency.weekly && provider.weekly_schedule !== undefined && provider.weekly_schedule != '' ? (<Card.Text><span><strong className="subtitle">Weekly Schedule:</strong></span><br></br>{provider.weekly_schedule}</Card.Text>) : ''}
                {provider.services_frequency.monthly && provider.monthly_schedule !== undefined && provider.monthly_schedule != '' ? (<Card.Text><span><strong className="subtitle">Monthly Schedule:</strong></span><br></br>{provider.monthly_schedule}</Card.Text>) : ''}
                {provider.services_frequency.ad_hoc && provider.adhoc_schedule !==undefined && provider.adhoc_schedule != '' ? (<Card.Text><span><strong className="subtitle">Ad-hoc Schedule:</strong></span><br></br>{provider.adhoc_schedule}</Card.Text>) : ''}
                {provider.services_frequency.specific_dates && provider.specific_dates !== undefined ? (<Card.Text><span><strong className="subtitle">Specific Dates:</strong></span><br></br>Closed on {provider.specific_dates.date.substring(5,7) + '/' + provider.specific_dates.date.substring(8,10)}</Card.Text>) : ''}
              </Card.Text>) : null
              }
              </div>
              {provider.additional_schedule_info !== undefined &&  provider.additional_schedule_info !== '' ? 
              (<Card.Text>
                <div className='add-sched-info'><span><strong className="subtitle">Additional Schedule Info:</strong></span><br></br>{provider.additional_schedule_info}</div>
              </Card.Text>) : null}
              </div>
              </Card.Body>
            </Card>
            
            <div class='mobile-indiv-nav'>
              {provider? (<span><Button className={(`indiv-nav-buttons ${hours ? 'active' : ''}`)} variant="link" onClick={(e)=>clickHours(e)}>Hours</Button></span>):null}
              {provider? (<span><Button className={(`indiv-nav-buttons ${services ? 'active' : ''}`)} variant="link" onClick={(e)=>clickServices(e)}>Services</Button></span>) : null}
              {provider.eligibility_criteria == undefined ||
                provider.eligibility_criteria == '' ? null : (<span><Button  className={(`indiv-nav-buttons ${info ? 'active' : ''}`)}  variant="link" onClick={(e)=>clickInfo(e)}>Eligibility</Button></span>)}
              {!provider ? null :(<span><Button className={(`indiv-nav-buttons ${appt ? 'active' : ''}`)}  variant="link" onClick={(e)=>clickAppt(e)}>Appointment</Button></span>)}
              </div>


            <div className='mobile-indiv'>
            {!provider || (provider.hours == '' ||
                provider.hours == undefined)? null : (
            <Card className="providerCard-container indiv-con hours-con" style={{display:!hours ? 'none' : ''}}>
            <Card.Title className='text-left p-3 description-title'>Hours</Card.Title>
              <Card.Body>
              <Card.Text >
                {provider.hours !== '' &&
                provider.hours !== undefined
                  ? renderHours()
                  : ''}
              </Card.Text>
              {provider.services_frequency !== undefined && (provider.services_frequency.weekly|| provider.services_frequency.monthly || provider.services_frequency.ad_hoc || provider.services_frequency.specific_dates ) ?
              (<Card.Text className='hours-right'>
                {provider.services_frequency.weekly && provider.weekly_schedule !== undefined && provider.weekly_schedule != '' ? (<Card.Text><span><strong className="subtitle">Weekly Schedule:</strong></span><br></br>{provider.weekly_schedule}</Card.Text>) : ''}
                {provider.services_frequency.monthly && provider.monthly_schedule !== undefined && provider.monthly_schedule != '' ? (<Card.Text><span><strong className="subtitle">Monthly Schedule:</strong></span><br></br>{provider.monthly_schedule}</Card.Text>) : ''}
                {provider.services_frequency.ad_hoc && provider.adhoc_schedule !==undefined && provider.adhoc_schedule != '' ? (<Card.Text><span><strong className="subtitle">Ad-hoc Schedule:</strong></span><br></br>{provider.adhoc_schedule}</Card.Text>) : ''}
                {provider.services_frequency.specific_dates && provider.specific_dates !== undefined ? (<Card.Text><span><strong className="subtitle">Specific Dates:</strong></span><br></br>Closed on {provider.specific_dates.date.substring(5,7) + '/' + provider.specific_dates.date.substring(8,10)}</Card.Text>) : ''}
              </Card.Text>) : null
              }
              {provider.additional_schedule_info !== undefined &&  provider.additional_schedule_info !== '' ? 
              (<Card.Text>
                <div className='add-sched-info'><span><strong className="subtitle">Additional Schedule Info:</strong></span><br></br>{provider.additional_schedule_info}</div>
              </Card.Text>) : null}
              
              </Card.Body>
              </Card>
            )}

{!provider || (provider.services_offered == '' ||
                provider.services_offered  == undefined) ? null : (
            <Card className="providerCard-container indiv-con" style={{display:!services ? 'none' : ''}}>
            <Card.Title className='text-left p-3 description-title'>Services</Card.Title>
              <Card.Body>
              <Card.Text >
              {provider.services_offered.types !== undefined
                  ?( provider.services_offered.types.information || provider.services_offered.types.money || provider.services_offered.types.goods || provider.services_offered.types.professional_services) ? (<Card.Text><span><strong className="subtitle appt">Type: </strong>{provider.services_offered.types.information ? (<span>Information (i.e. referrals, educational materials)</span>) : ''}{provider.services_offered.types.information && provider.services_offered.types.money ? (<span>, Money (i.e. rent payment assistance, transportation vouchers)</span>) : provider.services_offered.types.money ? (<span>Money (i.e. rent payment assistance, transportation vouchers)</span>) :''}{(provider.services_offered.types.information || provider.services_offered.types.money) && provider.services_offered.types.goods ? (<span>, Goods (i.e. food, medication)</span>) : provider.services_offered.types.goods ? (<span>Goods (i.e. food, medication)</span>) : ''}{(provider.services_offered.types.information || provider.services_offered.types.money || provider.services_offered.types.goods) && provider.services_offered.types.professional_services ? (<span>, Professional Services (i.e. medical appointments, legal counseling)</span>) : provider.services_offered.types.professional_services ? (<span>Professional Services (i.e. medical appointments, legal counseling)</span>) : ''}</span></Card.Text>)
                : '' : ''}
              {provider.services_offered.service_cost !== undefined && (provider.services_offered.service_cost.free ||  provider.services_offered.service_cost.discounted)
                  ? (<Card.Text><span><strong className="subtitle appt">Cost: </strong>{provider.services_offered.service_cost.free ? (<span>Free</span>) : provider.services_offered.service_cost.discounted ? (<span>Discounted</span>) : ''}</span></Card.Text>)
                : ''}
                {provider.services_offered.description !== '' &&
                provider.services_offered.description !== undefined
                ? (<Card.Text><span><strong className="subtitle appt">Description: </strong></span><br></br><div>{(provider.services_offered.description.includes('●') || provider.services_offered.description.includes('•') || provider.services_offered.description.includes('*')? provider.services_offered.description.split(/['●'||'•'||'*']/).map((line)=> {return(line !== "" && line !== "\n" ? (<span>{`• ${line.trim()}`}<br></br></span>) : null)}) : provider.services_offered.description)}</div></Card.Text>)
                  : 'Services not listed'}
              </Card.Text>
              </Card.Body>
              </Card>
            )}
              
              {!appt || (!provider || (provider.appointment == undefined && provider.application == undefined)) ? appt? <Card className="providerCard-container indiv-con">
                <Card.Title className='text-left p-3 description-title' >Applications & Appointments</Card.Title><Card.Body><Card.Text>No application or appointment information listed.</Card.Text></Card.Body></Card> : null : (
              <Card className="providerCard-container indiv-con" style={{display:!appt ? 'none' : ''}}>
              <Card.Title className='text-left p-3 description-title'>Applications & Appointments</Card.Title>
                <Card.Body>
                {/*provider.appointment.walk_ins !== undefined && provider.appointment.walk_ins !== ''
                  ? provider.appointment.walk_ins === 'Y' || provider.appointment.walk_ins === 'y'
                    ? <Card.Text>'Walk ins welcomed.'</Card.Text>
                    : ''
              : ''*/}
              {provider.application != undefined && (provider.application.is_required || provider.application.application_details != undefined) ?
              <Card.Text>
              {provider.application == undefined || (!provider.application.is_required &&  (provider.application.application_details == '' || provider.application.application_details == undefined)) ? '' : (!provider.application.is_required && provider.application.application_details != '' ) ? (<span><strong className="subtitle appt" >Application: </strong><br></br></span>) : (provider.application.is_required && provider.application.application_details == '' ) ? (<span><strong className="subtitle appt" >Application {<span style={{color:'red'}}>(required)</span>}</strong><br></br></span>) : (provider.application.is_required && provider.application.application_details != '' ) ? (<span><strong className="subtitle appt" >Application {<span style={{color:'red'}}>(required)</span>}:</strong><br></br></span>) : ''}
                {provider.application.application_details !== undefined
                      && provider.application.application_details !== ''
                        ? provider.application.application_details
                        : ''}
              </Card.Text>: null}
              {provider.appointment != undefined ?
              <React.Fragment>
              <Card.Text>
              {provider.appointment == undefined || (!provider.appointment.is_required &&  !provider.appointment.walk_ins  &&  !provider.appointment.appointment_available && provider.appointment.appointment_details == '') ? '' : (!provider.appointment.is_required && (provider.application.application_details != '' || provider.appointment.walk_ins  || provider.appointment.appointment_available )) ? (<span><strong className="subtitle appt" >Appointment: </strong></span>) : (provider.application.is_required && provider.application.application_details == '' && !provider.appointment.walk_ins  &&  !provider.appointment.appointment_available ) ? (<span><strong className="subtitle appt" >Appointment{<span style={{color:'red'}}>(required)</span>}</strong></span>) : (provider.application.is_required && (provider.application.application_details != '' || provider.appointment.walk_ins  ||  provider.appointment.appointment_available )) ? (<span><strong className="subtitle appt" >Appointment {<span style={{color:'red'}}>(required)</span>}:</strong></span>) : (<span><strong className="subtitle appt" >Appointment:</strong></span>)}
                {provider.appointment.walk_ins ? <span><br></br>• Available for walk-ins</span>: ''}
                {provider.appointment.appointment_available ? <span><br></br>• Available for appointments. {provider.appointment.appointment_scheduling !== undefined && (provider.appointment.appointment_scheduling.apply_phone || provider.appointment.appointment_scheduling.apply_online || provider.appointment.appointment_scheduling.apply_in_person) ? (<span>Schedule an appointment {provider.appointment.appointment_scheduling.apply_phone ? 'by phone': ''}{provider.appointment.appointment_scheduling.apply_phone && provider.appointment.appointment_scheduling.apply_online ? ' or online': provider.appointment.appointment_scheduling.apply_online ? 'online':  ''}{(provider.appointment.appointment_scheduling.apply_phone || provider.appointment.appointment_scheduling.apply_online) && provider.appointment.appointment_scheduling.apply_in_person ? ' or in person': provider.appointment.appointment_scheduling.apply_in_person ? 'in person': ''}</span>) : '' }</span>: ''}
                { (provider.appointment.appointment_details !== undefined
                      ? provider.appointment.appointment_details !== ''
                        ? (<div>{provider.appointment.appointment_details}
                          </div>)
                        : ''
                      : '')}
                      </Card.Text>
                      <Card.Text>
                  
                 { (provider.appointment.phone !== undefined
                      ? provider.appointment.phone !== ''
                        ? (<div><span><strong className="subtitle appt" >Phone: </strong></span> <a href={(`tel:${provider.appointment.phone}`)} target='_blank' className="call-link"> {provider.appointment.phone}</a></div>)
                        : ''
                      : '')}
                  { (provider.appointment.email !== undefined
                      ? provider.appointment.email!== ''
                        ? (<div><span><strong className="subtitle appt" >Email: </strong></span> <a href = {(`mailto: ${provider.appointment.email}`)}>{provider.appointment.email}</a></div>)
                        : ''
                      : '')}
                  { (provider.appointment.url !== undefined
                      ? provider.appointment.url !== ''
                        ? (<div><span><strong className="subtitle appt" >URL: </strong></span> <a href={provider.appointment.url} target='_blank'>{provider.appointment.url}</a></div>)
                        : ''
                      : '')}
              </Card.Text> </React.Fragment>: null}
              
              
              </Card.Body>
              </Card>
              )}

{!info || (provider.eligibility_criteria == undefined || !(provider.eligibility_criteria.min_age !== null ||
                provider.eligibility_criteria.max_age !== null  || provider.eligibility_criteria.gender !== undefined  || provider.eligibility_criteria.min_household_income !== null ||
                provider.eligibility_criteria.max_household_income !== null || provider.eligibility_criteria.veteran || provider.eligibility_criteria.disability || provider.eligibility_criteria.ethnicity !== undefined || provider.eligibility_criteria.gainesville_resident  || provider.eligibility_criteria.alachua_resident 
                ||  provider.eligibility_criteria.housing_status !== undefined  || provider.eligibility_criteria.employment_status !== undefined  || provider.eligibility_criteria.education_level !== undefined))? info? <Card className="providerCard-container indiv-con">
                <Card.Title className='text-left p-3 description-title' >Eligibility Criteria</Card.Title><Card.Body><Card.Text>No eligibility criteria listed.</Card.Text></Card.Body></Card> : null : (
              <Card className="providerCard-container indiv-con" style={{display:!info ? 'none' : ''}}>
              <Card.Title className='text-left p-3 description-title' >Eligibility Criteria</Card.Title>
                
             
             { provider.eligibility_criteria.min_age !== null ||
                provider.eligibility_criteria.max_age !== null  || provider.eligibility_criteria.gender !== undefined  || provider.eligibility_criteria.min_household_income !== null ||
                provider.eligibility_criteria.max_household_income !== null || provider.eligibility_criteria.veteran || provider.eligibility_criteria.disability || provider.eligibility_criteria.ethnicity !== undefined || provider.eligibility_criteria.gainesville_resident  || provider.eligibility_criteria.alachua_resident 
                ||  provider.eligibility_criteria.housing_status !== undefined  || provider.eligibility_criteria.employment_status !== undefined  || provider.eligibility_criteria.education_level !== undefined ?
                <Card.Body  className='elig-body'>
             <Card.Text className='elig-col-con'>
                <div className='elig-col'>
              {provider.eligibility_criteria.min_age !== null ||
                provider.eligibility_criteria.max_age !== null
                  ? (<Card.Text><div><strong className="subtitle appt">Age: </strong>{provider.eligibility_criteria.min_age !== null ? <span>{parseInt(provider.eligibility_criteria.min_age)}</span> : ''}{provider.eligibility_criteria.min_age !== null && provider.eligibility_criteria.max_age !== null ? <span> - {parseInt(provider.eligibility_criteria.max_age)}</span> : provider.eligibility_criteria.max_age !== null ? <span>No Minimum Age - {parseInt(provider.eligibility_criteria.max_age)}</span> : ' - No Maximum Age'}</div></Card.Text>)
                  : ''}

              {provider.eligibility_criteria.gender !== undefined 
                  ? (<Card.Text><div><strong className="subtitle appt">Gender: </strong>{provider.eligibility_criteria.gender.female ? <span>Female</span> : ''}{provider.eligibility_criteria.gender.female && provider.eligibility_criteria.gender.male ? <span>, Male</span> : provider.eligibility_criteria.gender.male ? <span>Male</span> : ''}{(provider.eligibility_criteria.gender.female || provider.eligibility_criteria.gender.male) && provider.eligibility_criteria.gender.non_binary ? <span>, Non Binary</span> : provider.eligibility_criteria.gender.non_binary ? <span>Non Binary</span> : ''}</div></Card.Text>)
                  : ''}
              {provider.eligibility_criteria.min_household_income !== null ||
                provider.eligibility_criteria.max_household_income !== null
                  ? (<Card.Text><div><strong className="subtitle appt">Household Income: </strong>{provider.eligibility_criteria.min_household_income !== null? <span>${parseInt(provider.eligibility_criteria.min_household_income)}</span> : ''}{provider.eligibility_criteria.min_household_income !== null && provider.eligibility_criteria.max_household_income !== null ? <span> - {parseInt(provider.eligibility_criteria.max_household_income)}</span> : provider.eligibility_criteria.max_household_income !== null ? <span>No Minimum Income - ${parseInt(provider.eligibility_criteria.max_household_income)}</span> : ' - No Maximum Income'}</div></Card.Text>)
                  : ''}
                   {provider.eligibility_criteria.veteran 
                  ? (<Card.Text><div><strong className="subtitle appt">Veteran: </strong>{provider.eligibility_criteria.veteran ? 'Yes' : ''}</div></Card.Text>)
                  : ''}
              {provider.eligibility_criteria.disability
                  ? (<Card.Text><div><strong className="subtitle appt">Disability: </strong>{provider.eligibility_criteria.disability ? 'Yes' : ''}</div></Card.Text>)
                  : ''}
             
              {provider.eligibility_criteria.ethnicity !== undefined 
                  ? (<Card.Text><div><strong className="subtitle appt">Ethnicity: </strong>{provider.eligibility_criteria.ethnicity.native_american ? <span><br></br>• Native American</span> : ''}{provider.eligibility_criteria.ethnicity.white ? <span><br></br>• White</span> : ''}{provider.eligibility_criteria.ethnicity.black ? <span><br></br>• Black</span> : ''}{provider.eligibility_criteria.ethnicity.latinx ? <span><br></br>• Latinx</span> : ''}{provider.eligibility_criteria.ethnicity.middle_eastern ? <span><br></br>• Middle Eastern</span> : ''}{provider.eligibility_criteria.ethnicity.south_asian ? <span><br></br>• South Asian</span> : ''}{provider.eligibility_criteria.ethnicity.east_asian ? <span><br></br>• East Asian</span> : ''}{provider.eligibility_criteria.ethnicity.pacific_islander ? <span><br></br>• Pacific Islander</span> : ''}</div></Card.Text>)
                  : ''}
                   {provider.eligibility_criteria.gainesville_resident  || provider.eligibility_criteria.alachua_resident 
                  ? (<Card.Text><div><strong className="subtitle appt">Residency: </strong>{provider.eligibility_criteria.gainesville_resident ? <span><br></br>• Gainesville</span> : ''}{provider.eligibility_criteria.alachua_resident ? <span><br></br>• Alachua County</span>: ''}</div></Card.Text>)
                  : ''}
                  </div>
                  {provider.eligibility_criteria.housing_status !== undefined || provider.eligibility_criteria.employment_status !== undefined ?
                  <div  className='elig-col'>
                 
                   {provider.eligibility_criteria.housing_status !== undefined 
                  ? (<Card.Text><div><strong className="subtitle appt">Housing Status: </strong>{provider.eligibility_criteria.housing_status.homeless ? <span><br></br>• Homeless</span> : ''}{provider.eligibility_criteria.housing_status.in_shelter ? <span><br></br>• In Shelter</span> : ''}{provider.eligibility_criteria.housing_status.rent ? <span><br></br>• Renter</span> : ''}{provider.eligibility_criteria.housing_status.own ? <span><br></br>• Owner</span> : ''}{provider.eligibility_criteria.housing_status.other ? <span><br></br>• Other</span> : ''}</div></Card.Text>)
                  : ''}
             
              {provider.eligibility_criteria.employment_status !== undefined 
                  ? (<Card.Text><div><strong className="subtitle appt">Employment Status: </strong>{provider.eligibility_criteria.employment_status.full_time ? <span><br></br>• Full Time</span> : ''}{provider.eligibility_criteria.employment_status.part_time ? <span><br></br>• Part Time</span> : ''}{provider.eligibility_criteria.employment_status.unemployed ? <span><br></br>• Unemployed</span> : ''}{provider.eligibility_criteria.employment_status.student ? <span><br></br>• Student</span> : ''}{provider.eligibility_criteria.employment_status.volunteer ? <span><br></br>• Volunteer</span> : ''}{provider.eligibility_criteria.employment_status.retired ? <span><br></br>• Retired</span> : ''}{provider.eligibility_criteria.employment_status.homemaker ? <span><br></br>• Homemaker</span> : ''}{provider.eligibility_criteria.employment_status.self_employed ? <span><br></br>• Self Employed</span> : ''}{provider.eligibility_criteria.employment_status.unable_to_work ? <span><br></br>• Unable to Work</span> : ''}</div></Card.Text>)
                  : ''}
                  </div>: null}
                  
             {provider.eligibility_criteria.education_level !== undefined 
                  ? (<div  className='elig-col'><Card.Text><div><strong className="subtitle appt">Education Level: </strong>{provider.eligibility_criteria.education_level.no_schooling ? <span><br></br>• No Schooling</span> : ''}{provider.eligibility_criteria.education_level.kindergarten ? <span><br></br>• Kindergarten</span> : ''}{provider.eligibility_criteria.education_level.grade_1_11 ? <span><br></br>• Grade 1-11</span> : ''}{provider.eligibility_criteria.education_level.grade_12 ? <span><br></br>• Grade 12</span> : ''}{provider.eligibility_criteria.education_level.high_school_diploma ? <span><br></br>• High School Diploma</span> : ''}{provider.eligibility_criteria.education_level.ged ? <span><br></br>• GED</span> : ''}{provider.eligibility_criteria.education_level.some_college ? <span><br></br>• Some College</span> : ''}{provider.eligibility_criteria.education_level.vocational_certificate ? <span><br></br>• Vocational Certificate</span> : ''}{provider.eligibility_criteria.education_level.associate_degree ? <span><br></br>• Associate Degree</span> : ''}{provider.eligibility_criteria.education_level.bachelor_degree ? <span><br></br>• Bachelor Degree</span> : ''}{provider.eligibility_criteria.education_level.master_degree ? <span><br></br>• Master Degree</span> : ''}{provider.eligibility_criteria.education_level.doctorate_degree ? <span><br></br>• Doctorate Degree</span> : ''}</div></Card.Text></div>)
                  : ''}
                  
                
              </Card.Text></Card.Body>: null}
            
            <Card.Body>
              <Card.Text className='eligibility-card'>
              {provider.eligibility_criteria.eligibility_details !== undefined &&
                provider.eligibility_criteria.eligibility_details !== ''
                  ? (<React.Fragment><span><strong className="subtitle appt">Further Eligibility Details: </strong></span><br></br><div>{(provider.eligibility_criteria.eligibility_details.includes('●') || provider.eligibility_criteria.eligibility_details.includes('•') || provider.eligibility_criteria.eligibility_details.includes('*')? provider.eligibility_criteria.eligibility_details.split(/['●'||'•'||'*']/).map((line)=> {return(line !== "" && line !== "\n" ? (<span>{`• ${line.trim()}`}<br></br></span>) : null)}) : provider.eligibility_criteria.eligibility_details)}</div></React.Fragment>)
                  : ''}
              </Card.Text>
            </Card.Body>
          </Card>
              )}  
            </div>
           
                {/*DESKTOP*/}


           <div className='desktop-indiv'>
            {!provider || (provider.services_offered == '' ||
                provider.services_offered == undefined) ? null : (
            <Card className="providerCard-container indiv-con">
            <Card.Title className='text-left p-3 description-title'>Services</Card.Title>
              <Card.Body>
              <Card.Text >
              {provider.services_offered.types !== undefined
                  ?( provider.services_offered.types.information || provider.services_offered.types.money || provider.services_offered.types.goods || provider.services_offered.types.professional_services) ? (<Card.Text><span><strong className="subtitle appt">Type: </strong>{provider.services_offered.types.information ? (<span>Information (i.e. referrals, educational materials)</span>) : ''}{provider.services_offered.types.information && provider.services_offered.types.money ? (<span>, Money (i.e. rent payment assistance, transportation vouchers)</span>) : provider.services_offered.types.money ? (<span>Money (i.e. rent payment assistance, transportation vouchers)</span>) :''}{(provider.services_offered.types.information || provider.services_offered.types.money) && provider.services_offered.types.goods ? (<span>, Goods (i.e. food, medication)</span>) : provider.services_offered.types.goods ? (<span>Goods (i.e. food, medication)</span>) : ''}{(provider.services_offered.types.information || provider.services_offered.types.money || provider.services_offered.types.goods) && provider.services_offered.types.professional_services ? (<span>, Professional Services (i.e. medical appointments, legal counseling)</span>) : provider.services_offered.types.professional_services ? (<span>Professional Services (i.e. medical appointments, legal counseling)</span>) : ''}</span></Card.Text>)
                : '' : ''}
              {provider.services_offered.service_cost !== undefined && (provider.services_offered.service_cost.free ||  provider.services_offered.service_cost.discounted)
                  ? (<Card.Text><span><strong className="subtitle appt">Cost: </strong>{provider.services_offered.service_cost.free ? (<span>Free</span>) : provider.services_offered.service_cost.discounted ? (<span>Discounted</span>) : ''}</span></Card.Text>)
                : ''}
                {provider.services_offered.description !== '' &&
                provider.services_offered.description !== undefined
                ? (<Card.Text><span><strong className="subtitle appt">Description: </strong></span><br></br><div>{(provider.services_offered.description.includes('●') || provider.services_offered.description.includes('•') || provider.services_offered.description.includes('*')? provider.services_offered.description.split(/['●'||'•'||'*']/).map((line)=> {return(line !== "" && line !== "\n" ? (<span>{`• ${line.trim()}`}<br></br></span>) : null)}) : provider.services_offered.description)}</div></Card.Text>)
                  : 'Services not listed'}
              </Card.Text>
              
              </Card.Body>
              </Card>
            )}

            {provider.eligibility_criteria == undefined || !(provider.eligibility_criteria.min_age !== null ||
                provider.eligibility_criteria.max_age !== null  || provider.eligibility_criteria.gender !== undefined  || provider.eligibility_criteria.min_household_income !== null ||
                provider.eligibility_criteria.max_household_income !== null || provider.eligibility_criteria.veteran || provider.eligibility_criteria.disability || provider.eligibility_criteria.ethnicity !== undefined || provider.eligibility_criteria.gainesville_resident  || provider.eligibility_criteria.alachua_resident 
                ||  provider.eligibility_criteria.housing_status !== undefined  || provider.eligibility_criteria.employment_status !== undefined  || provider.eligibility_criteria.education_level !== undefined)? null : (
              <Card className="providerCard-container indiv-con">
              <Card.Title className='text-left p-3 description-title' >Eligibility Criteria</Card.Title>
                
             
             { provider.eligibility_criteria.min_age !== null ||
                provider.eligibility_criteria.max_age !== null  || provider.eligibility_criteria.gender !== undefined  || provider.eligibility_criteria.min_household_income !== null ||
                provider.eligibility_criteria.max_household_income !== null || provider.eligibility_criteria.veteran || provider.eligibility_criteria.disability || provider.eligibility_criteria.ethnicity !== undefined || provider.eligibility_criteria.gainesville_resident  || provider.eligibility_criteria.alachua_resident 
                ||  provider.eligibility_criteria.housing_status !== undefined  || provider.eligibility_criteria.employment_status !== undefined  || provider.eligibility_criteria.education_level !== undefined ?
                <Card.Body>
             <Card.Text className='elig-col-con'>
                <div className='elig-col'>
              {provider.eligibility_criteria.min_age !== null ||
                provider.eligibility_criteria.max_age !== null
                  ? (<Card.Text><div><strong className="subtitle appt">Age: </strong>{provider.eligibility_criteria.min_age !== null ? <span>{parseInt(provider.eligibility_criteria.min_age)}</span> : ''}{provider.eligibility_criteria.min_age !== null && provider.eligibility_criteria.max_age !== null ? <span> - {parseInt(provider.eligibility_criteria.max_age)}</span> : provider.eligibility_criteria.max_age !== null ? <span>No Minimum Age - {parseInt(provider.eligibility_criteria.max_age)}</span> : ' - No Maximum Age'}</div></Card.Text>)
                  : ''}

              {provider.eligibility_criteria.gender !== undefined 
                  ? (<Card.Text><div><strong className="subtitle appt">Gender: </strong>{provider.eligibility_criteria.gender.female ? <span>Female</span> : ''}{provider.eligibility_criteria.gender.female && provider.eligibility_criteria.gender.male ? <span>, Male</span> : provider.eligibility_criteria.gender.male ? <span>Male</span> : ''}{(provider.eligibility_criteria.gender.female || provider.eligibility_criteria.gender.male) && provider.eligibility_criteria.gender.non_binary ? <span>, Non Binary</span> : provider.eligibility_criteria.gender.non_binary ? <span>Non Binary</span> : ''}</div></Card.Text>)
                  : ''}
              {provider.eligibility_criteria.min_household_income !== null ||
                provider.eligibility_criteria.max_household_income !== null
                  ? (<Card.Text><div><strong className="subtitle appt">Household Income: </strong>{provider.eligibility_criteria.min_household_income !== null? <span>${parseInt(provider.eligibility_criteria.min_household_income)}</span> : ''}{provider.eligibility_criteria.min_household_income !== null && provider.eligibility_criteria.max_household_income !== null ? <span> - {parseInt(provider.eligibility_criteria.max_household_income)}</span> : provider.eligibility_criteria.max_household_income !== null ? <span>No Minimum Income - ${parseInt(provider.eligibility_criteria.max_household_income)}</span> : ' - No Maximum Income'}</div></Card.Text>)
                  : ''}
                   {provider.eligibility_criteria.veteran 
                  ? (<Card.Text><div><strong className="subtitle appt">Veteran: </strong>{provider.eligibility_criteria.veteran ? 'Yes' : ''}</div></Card.Text>)
                  : ''}
              {provider.eligibility_criteria.disability
                  ? (<Card.Text><div><strong className="subtitle appt">Disability: </strong>{provider.eligibility_criteria.disability ? 'Yes' : ''}</div></Card.Text>)
                  : ''}
             
              {provider.eligibility_criteria.ethnicity !== undefined 
                  ? (<Card.Text><div><strong className="subtitle appt">Ethnicity: </strong>{provider.eligibility_criteria.ethnicity.native_american ? <span><br></br>• Native American</span> : ''}{provider.eligibility_criteria.ethnicity.white ? <span><br></br>• White</span> : ''}{provider.eligibility_criteria.ethnicity.black ? <span><br></br>• Black</span> : ''}{provider.eligibility_criteria.ethnicity.latinx ? <span><br></br>• Latinx</span> : ''}{provider.eligibility_criteria.ethnicity.middle_eastern ? <span><br></br>• Middle Eastern</span> : ''}{provider.eligibility_criteria.ethnicity.south_asian ? <span><br></br>• South Asian</span> : ''}{provider.eligibility_criteria.ethnicity.east_asian ? <span><br></br>• East Asian</span> : ''}{provider.eligibility_criteria.ethnicity.pacific_islander ? <span><br></br>• Pacific Islander</span> : ''}</div></Card.Text>)
                  : ''}
                   {provider.eligibility_criteria.gainesville_resident  || provider.eligibility_criteria.alachua_resident 
                  ? (<Card.Text><div><strong className="subtitle appt">Residency: </strong>{provider.eligibility_criteria.gainesville_resident ? <span><br></br>• Gainesville</span> : ''}{provider.eligibility_criteria.alachua_resident ? <span><br></br>• Alachua County</span>: ''}</div></Card.Text>)
                  : ''}
                  </div>
                  <div  className='elig-col'>
                 
                   {provider.eligibility_criteria.housing_status !== undefined 
                  ? (<Card.Text><div><strong className="subtitle appt">Housing Status: </strong>{provider.eligibility_criteria.housing_status.homeless ? <span><br></br>• Homeless</span> : ''}{provider.eligibility_criteria.housing_status.in_shelter ? <span><br></br>• In Shelter</span> : ''}{provider.eligibility_criteria.housing_status.rent ? <span><br></br>• Renter</span> : ''}{provider.eligibility_criteria.housing_status.own ? <span><br></br>• Owner</span> : ''}{provider.eligibility_criteria.housing_status.other ? <span><br></br>• Other</span> : ''}</div></Card.Text>)
                  : ''}
             
              {provider.eligibility_criteria.employment_status !== undefined 
                  ? (<Card.Text><div><strong className="subtitle appt">Employment Status: </strong>{provider.eligibility_criteria.employment_status.full_time ? <span><br></br>• Full Time</span> : ''}{provider.eligibility_criteria.employment_status.part_time ? <span><br></br>• Part Time</span> : ''}{provider.eligibility_criteria.employment_status.unemployed ? <span><br></br>• Unemployed</span> : ''}{provider.eligibility_criteria.employment_status.student ? <span><br></br>• Student</span> : ''}{provider.eligibility_criteria.employment_status.volunteer ? <span><br></br>• Volunteer</span> : ''}{provider.eligibility_criteria.employment_status.retired ? <span><br></br>• Retired</span> : ''}{provider.eligibility_criteria.employment_status.homemaker ? <span><br></br>• Homemaker</span> : ''}{provider.eligibility_criteria.employment_status.self_employed ? <span><br></br>• Self Employed</span> : ''}{provider.eligibility_criteria.employment_status.unable_to_work ? <span><br></br>• Unable to Work</span> : ''}</div></Card.Text>)
                  : ''}
                  </div>
                  <div  className='elig-col'>
             {provider.eligibility_criteria.education_level !== undefined 
                  ? (<Card.Text><div><strong className="subtitle appt">Education Level: </strong>{provider.eligibility_criteria.education_level.no_schooling ? <span><br></br>• No Schooling</span> : ''}{provider.eligibility_criteria.education_level.kindergarten ? <span><br></br>• Kindergarten</span> : ''}{provider.eligibility_criteria.education_level.grade_1_11 ? <span><br></br>• Grade 1-11</span> : ''}{provider.eligibility_criteria.education_level.grade_12 ? <span><br></br>• Grade 12</span> : ''}{provider.eligibility_criteria.education_level.high_school_diploma ? <span><br></br>• High School Diploma</span> : ''}{provider.eligibility_criteria.education_level.ged ? <span><br></br>• GED</span> : ''}{provider.eligibility_criteria.education_level.some_college ? <span><br></br>• Some College</span> : ''}{provider.eligibility_criteria.education_level.vocational_certificate ? <span><br></br>• Vocational Certificate</span> : ''}{provider.eligibility_criteria.education_level.associate_degree ? <span><br></br>• Associate Degree</span> : ''}{provider.eligibility_criteria.education_level.bachelor_degree ? <span><br></br>• Bachelor Degree</span> : ''}{provider.eligibility_criteria.education_level.master_degree ? <span><br></br>• Master Degree</span> : ''}{provider.eligibility_criteria.education_level.doctorate_degree ? <span><br></br>• Doctorate Degree</span> : ''}</div></Card.Text>)
                  : ''}
                  </div>
                
              </Card.Text></Card.Body>: null}
            
            <Card.Body>
              <Card.Text className='eligibility-card'>
              {provider.eligibility_criteria.eligibility_details !== undefined &&
                provider.eligibility_criteria.eligibility_details !== ''
                  ? (<React.Fragment><span><strong className="subtitle appt">Further Eligibility Details: </strong></span><br></br><div>{(provider.eligibility_criteria.eligibility_details.includes('●') || provider.eligibility_criteria.eligibility_details.includes('•') || provider.eligibility_criteria.eligibility_details.includes('*')? provider.eligibility_criteria.eligibility_details.split(/['●'||'•'||'*']/).map((line)=> {return(line !== "" && line !== "\n" ? (<span>{`• ${line.trim()}`}<br></br></span>) : null)}) : provider.eligibility_criteria.eligibility_details)}</div></React.Fragment>)
                  : ''}
              </Card.Text>
            </Card.Body>
          </Card>
              )}        
              
              {!provider || (provider.appointment == undefined && provider.application == undefined) ? null : (
              <Card className="providerCard-container indiv-con">
              <Card.Title className='text-left p-3 description-title'>Applications & Appointments</Card.Title>
                <Card.Body>
                {/*provider.appointment.walk_ins !== undefined && provider.appointment.walk_ins !== ''
                  ? provider.appointment.walk_ins === 'Y' || provider.appointment.walk_ins === 'y'
                    ? <Card.Text>'Walk ins welcomed.'</Card.Text>
                    : ''
              : ''*/}
              {provider.application != undefined && (provider.application.is_required || provider.application.application_details != undefined) ?
              <Card.Text>
              {provider.application == undefined || (!provider.application.is_required &&  (provider.application.application_details == '' || provider.application.application_details == undefined)) ? '' : (!provider.application.is_required && provider.application.application_details != '' ) ? (<span><strong className="subtitle appt" >Application: </strong><br></br></span>) : (provider.application.is_required && provider.application.application_details == '' ) ? (<span><strong className="subtitle appt" >Application {<span style={{color:'red'}}>(required)</span>}</strong><br></br></span>) : (provider.application.is_required && provider.application.application_details != '' ) ? (<span><strong className="subtitle appt" >Application {<span style={{color:'red'}}>(required)</span>}:</strong><br></br></span>) : ''}
                {provider.application.application_details !== undefined
                      && provider.application.application_details !== ''
                        ? provider.application.application_details
                        : ''}
              </Card.Text>: null}
              {provider.appointment != undefined ?
              <React.Fragment>
              <Card.Text>
              {provider.appointment == undefined || (!provider.appointment.is_required &&  !provider.appointment.walk_ins  &&  !provider.appointment.appointment_available && provider.appointment.appointment_details == '') ? '' : (!provider.appointment.is_required && (provider.application.application_details != '' || provider.appointment.walk_ins  || provider.appointment.appointment_available )) ? (<span><strong className="subtitle appt" >Appointment: </strong></span>) : (provider.application.is_required && provider.application.application_details == '' && !provider.appointment.walk_ins  &&  !provider.appointment.appointment_available ) ? (<span><strong className="subtitle appt" >Appointment{<span style={{color:'red'}}>(required)</span>}</strong></span>) : (provider.application.is_required && (provider.application.application_details != '' || provider.appointment.walk_ins  ||  provider.appointment.appointment_available )) ? (<span><strong className="subtitle appt" >Appointment {<span style={{color:'red'}}>(required)</span>}:</strong></span>) : (<span><strong className="subtitle appt" >Appointment:</strong></span>)}
                {provider.appointment.walk_ins ? <span><br></br>• Available for walk-ins</span>: ''}
                {provider.appointment.appointment_available ? <span><br></br>• Available for appointments. {provider.appointment.appointment_scheduling !== undefined && (provider.appointment.appointment_scheduling.apply_phone || provider.appointment.appointment_scheduling.apply_online || provider.appointment.appointment_scheduling.apply_in_person) ? (<span>Schedule an appointment {provider.appointment.appointment_scheduling.apply_phone ? 'by phone': ''}{provider.appointment.appointment_scheduling.apply_phone && provider.appointment.appointment_scheduling.apply_online ? ' or online': provider.appointment.appointment_scheduling.apply_online ? 'online':  ''}{(provider.appointment.appointment_scheduling.apply_phone || provider.appointment.appointment_scheduling.apply_online) && provider.appointment.appointment_scheduling.apply_in_person ? ' or in person': provider.appointment.appointment_scheduling.apply_in_person ? 'in person': ''}</span>) : '' }</span>: ''}
                { (provider.appointment.appointment_details !== undefined
                      ? provider.appointment.appointment_details !== ''
                        ? (<div>{provider.appointment.appointment_details}
                          </div>)
                        : ''
                      : '')}
                      </Card.Text>
                      <Card.Text>
                  
                 { (provider.appointment.phone !== undefined
                      ? provider.appointment.phone !== ''
                        ? (<div><span><strong className="subtitle appt" >Phone: </strong></span> <a href={(`tel:${provider.appointment.phone}`)} target='_blank' className="call-link"> {provider.appointment.phone}</a></div>)
                        : ''
                      : '')}
                  { (provider.appointment.email !== undefined
                      ? provider.appointment.email!== ''
                        ? (<div><span><strong className="subtitle appt" >Email: </strong></span> <a href = {(`mailto: ${provider.appointment.email}`)}>{provider.appointment.email}</a></div>)
                        : ''
                      : '')}
                  { (provider.appointment.url !== undefined
                      ? provider.appointment.url !== ''
                        ? (<div><span><strong className="subtitle appt" >URL: </strong></span> <a href={provider.appointment.url} target='_blank'>{provider.appointment.url}</a></div>)
                        : ''
                      : '')}
              </Card.Text> </React.Fragment>: null}
              
              
              </Card.Body>
              </Card>
              )}

              
              </div>
              <p className="updated">
              {'Last updated '}
              {provider.updated_at.substring(5,7) + '/' + provider.updated_at.substring(8,10)+ '/' + provider.updated_at.substring(0,4)}
              {'\n'}
              </p>  
        </Container>
      )}
      </div>
      </div>
    </React.Fragment>
  );
};

IndivProvider.propTypes = {
  id: PropTypes.instanceOf(String).isRequired,
};

export default IndivProvider;
