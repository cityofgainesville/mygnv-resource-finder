import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Card, Form, Button, Row, Col} from 'react-bootstrap';
import Homepage from './Title';
import '../../index.scss';
import './IndivProvider.scss';
// This component renders the individual provider view,
// with more detail
// Checks fields for validity to prevent crashes if undefined

const IndivProvider = (props) => {
  const [provider, setProvider] = useState(null);
  const [visible, setVisible] = useState(false);
  const [hours, setHours] = useState(true);
  const [services, setServices] = useState(false);
  const [appt, setAppt] = useState(false);
  const [info, setInfo] = useState(false);

  // Get provider from backend based on id passed in
  useEffect(() => {
    axios
      .get(`/api/providers/${props.id}`)
      .then((res) => {
        setProvider(res.data);
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

  const renderHours = () => {
    return (
      <Card.Text>
        <i class="fas fa-clock hours-mobile" style={{marginRight: ".5rem"}}></i>
        {provider.hours !== undefined ? (<strong className="subtitle hours-mobile">Hours:<br></br></strong>) : ''}
        {provider.hours.monday !== undefined && provider.hours.monday !== ''
          ?( <div>Monday: {provider.hours.monday}<br></br><br></br></div>)
          : ''}
        
        {provider.hours.tuesday !== undefined && provider.hours.tuesday !== ''
          ? ( <div>Tuesday: {provider.hours.tuesday}<br></br><br></br></div>)
          : ''}
       
        {provider.hours.wednesday !== undefined &&
        provider.hours.wednesday !== ''
          ? ( <div>Wednesday: {provider.hours.wednesday}<br></br><br></br></div>)
          : ''}
          
        {provider.hours.thursday !== undefined && provider.hours.thursday !== ''
          ? ( <div>Thursday: {provider.hours.thursday}<br></br><br></br></div>)
          : ''}
          
        {provider.hours.friday !== undefined && provider.hours.friday !== ''
          ? ( <div>Friday: {provider.hours.friday}<br></br><br></br></div>)
          : ''}
          
        {provider.hours.saturday !== undefined && provider.hours.saturday !== ''
          ? ( <div>Saturday: {provider.hours.saturday}<br></br><br></br></div>)
          : ''}
          
        {provider.hours.sunday !== undefined && provider.hours.sunday !== ''
          ? 'Sunday: ' + provider.hours.sunday
          : ''}
      </Card.Text>
    );
  };

  const br = <br></br>;

  return (
    <React.Fragment>
      

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
            <Card.Title className='text-center p-3'>
            <Card.Text className='united-way'>
                {provider.united_way_approval !== undefined
                  ? provider.united_way_approval
                    ? 'United Way Approved'
                    : ''
                  : ''}
              </Card.Text>
              <h5 className='indivp-name'>{provider.name}</h5>
           
             
              </Card.Title>
            <Card.Body className="first-card">
           
            
              <div id='left'>
            <Card.Text>
                {provider.addresses !== undefined &&
                provider.addresses.length > 0
                  ? (<div><i class="fas fa-map-marker-alt" style={{marginRight: ".5rem"}}></i><span><strong className="subtitle">Location(s):</strong><br></br></span></div>)
                  : null}
                
                {provider.addresses[0] !== undefined
                  ? provider.addresses[0].line_1
                  : ''}
                {provider.addresses[0] !== undefined &&
                provider.addresses[0].line_2 !== undefined &&
                provider.addresses[0].line_2 !== ''
                  ? ', ' + provider.addresses[0].line_2
                  : ''}
                {provider.addresses[0] !== undefined &&
                provider.addresses[0].city !== undefined &&
                provider.addresses[0].city !== ''
                  ? ', ' + provider.addresses[0].city
                  : ''}
                {provider.addresses[0] !== undefined &&
                provider.addresses[0].state !== undefined &&
                provider.addresses[0].state !== ''
                  ? ', ' + provider.addresses[0].state
                  : ''}
                {provider.addresses[0] !== undefined &&
                provider.addresses[0].zipcode !== undefined &&
                provider.addresses[0].zipcode !== ''
                  ? ', ' + provider.addresses[0].zipcode
                  : ''}
                  <Card.Text className='bus'>
                {provider.bus_routes[0] !== undefined &&
                provider.bus_routes[0] !== ''
                  ? 'Bus Route(s): ' + provider.bus_routes[0]
                  : ''}
              </Card.Text>
              </Card.Text>
              
              <Card.Text>
                {provider.phone_numbers && provider.phone_numbers.length > 0
                  ?(<div><i class="fas fa-phone" style={{marginRight: ".5rem"}}></i><span><strong className="subtitle">Phone Number(s):</strong><br></br>{provider.phone_numbers[0].number}</span></div>)
                  : null}
                {provider.phone_numbers &&
                provider.phone_numbers.length > 0 &&
                provider.phone_numbers[0].contact !== undefined &&
                provider.phone_numbers[0].contact !== ''
                  ? ', ' + provider.phone_numbers[0].contact
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.email[0] !== undefined && provider.email[0] !== ''
                  ? (<div><i class="fas fa-envelope" style={{marginRight: ".5rem"}}></i> <span><strong className="subtitle">Email(s):</strong><br></br>{provider.email[0]}</span></div>)
                  : ''}
              </Card.Text>
              <Card.Text class='translation'>
                {provider.translation_available !== undefined &&
                provider.translation_available !== ''
                  ? (<div><i class="far fa-globe-americas" style={{marginRight: ".5rem"}}></i><span><strong className="subtitle">Language Translation Offered:</strong> <br></br>{provider.translation_available}</span></div>)
                  : ''}
              </Card.Text>
              <Card.Text className='provider-buttons-con'>
             { provider.phone_numbers && provider.phone_numbers.length > 0
                  ?(<span><Button href={(`tel:${provider.phone_numbers[0].number}`)} target='_blank' variant='info' className="provider-buttons call">Call</Button></span>):null}
                {provider.website[0] !== undefined && provider.website[0] !== ''
                  ? ( <span>
                  
                  <Button href={provider.website[0]} target='_blank' variant='info' className="provider-buttons website">Go to Website</Button></span>) : ''}
                  {provider.addresses !== undefined &&
                provider.addresses.length > 0
                  ? (<span><Button href={(`https://www.google.com/maps/place/${provider.addresses[0].line_1}+${provider.addresses[0].city !== undefined && provider.addresses[0].city !== '' ? provider.addresses[0].city : 'Gainesville'}+FL+${provider.addresses[0].zipcode}/`)} target='_blank' variant='info' className="provider-buttons maps">Maps</Button></span>):null}
                  
              </Card.Text>
              </div>
              <div id='right'>
              {provider.hours ? renderHours() : null}
              <br></br>
              </div>
            </Card.Body>
            </Card>
            
            <div class='mobile-indiv-nav'>
              {provider? (<span><Button className={(`indiv-nav-buttons ${hours ? 'active' : ''}`)} variant="link" onClick={(e)=>clickHours(e)}>Hours</Button></span>):null}
              {provider? (<span><Button className={(`indiv-nav-buttons ${services ? 'active' : ''}`)} variant="link" onClick={(e)=>clickServices(e)}>Services</Button></span>) : null}
              {!provider ? null :(<span><Button className={(`indiv-nav-buttons ${appt ? 'active' : ''}`)}  variant="link" onClick={(e)=>clickAppt(e)}>Appointment</Button></span>)}
              {provider.additional_information == undefined ||
                provider.additional_information == '' ? null : (<span><Button  className={(`indiv-nav-buttons ${info ? 'active' : ''}`)}  variant="link" onClick={(e)=>clickInfo(e)}>More Info</Button></span>)}
              </div>


            <div className='mobile-indiv'>
            {!provider ? null : (
            <Card className="providerCard-container indiv-con hours-con" style={{display:!hours ? 'none' : ''}}>
            <Card.Title className='text-left p-3 description-title'>Hours</Card.Title>
              <Card.Body>
              <Card.Text >
                {provider.hours !== '' &&
                provider.hours !== undefined
                  ? renderHours()
                  : ''}
              </Card.Text>
              
              </Card.Body>
              </Card>
            )}

{!provider ? null : (
            <Card className="providerCard-container indiv-con" style={{display:!services ? 'none' : ''}}>
            <Card.Title className='text-left p-3 description-title'>Services</Card.Title>
              <Card.Body>
              <Card.Text >
                {provider.services_provided !== '' &&
                provider.services_provided !== undefined
                  ? provider.services_provided
                  : 'Services not listed'}
              </Card.Text>
              
              </Card.Body>
              </Card>
            )}
              
              {!provider && !appt ? null : (
              <Card className="providerCard-container indiv-con" style={{display:!appt ? 'none' : ''}}>
              <Card.Title className='text-left p-3 description-title'>Appointment</Card.Title>
                <Card.Body>
                <Card.Text>
                {provider.eligibility_criteria !== ''
                  ? (<span><strong className="subtitle appt">Eligibility / Requirements</strong><br></br>{provider.eligibility_criteria}</span>)
                  : ''}
                {provider.service_area !== '' ? provider.serve_area : ''}
              </Card.Text>
              <Card.Text>
                {provider.cost_info !== undefined && provider.cost_info !== ''
                  ? (<span><strong className="subtitle appt">Cost</strong><br></br>{provider.cost_info}</span>)
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.walk_ins !== undefined && provider.walk_ins !== ''
                  ? provider.walk_ins === 'Y' || provider.walk_ins === 'y'
                    ? 'Walk ins welcomed.'
                    : ''
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.appointment !== undefined ? (<span><strong className="subtitle appt">Appointment Information</strong><br></br></span>): ''}
                {provider.appointment !== undefined
                  ? (provider.appointment.is_required !== undefined
                      ? provider.appointment.is_required
                        ? 'Appointment is required.'
                        : 'Appointment is not required.'
                      : '') + '\n'
                    +
                    (provider.appointment.phone !== undefined
                      ? provider.appointment.phone !== ''
                        ? 'Call here: ' + provider.appointment.phone
                        : ''
                      : '') +
                    '\n' +
                    (provider.appointment.website !== undefined
                      ? provider.appointment.website !== ''
                        ? 'Click here: ' + provider.appointment.website
                        : ''
                      : '') +
                    '\n' +
                    (provider.appointment.email !== undefined
                      ? provider.appointment.email !== ''
                        ? 'Email here: ' + provider.appointment.email
                        : ''
                      : '') +
                    '\n' +
                    (provider.appointment.other_info !== undefined
                      ? provider.appointment.other_info !== ''
                        ? 'Additional information: ' +
                          provider.appointment.other_info
                        : ''
                      : '')
                  : ''}
              </Card.Text>
              <Card.Text>
              {provider.application !== undefined || provider.application !== "" ? (<span><strong className="subtitle appt" >Application Information</strong><br></br></span>): ''}
                {provider.application !== undefined
                  ? (provider.application.is_required !== undefined
                      ? provider.application.is_required
                        ? 'Application is required.'
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.apply_online !== undefined
                      ? provider.application.apply_online
                        ? 'You must apply online.'
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.apply_in_person !== undefined
                      ? provider.application.apply_in_person
                        ? 'You must apply in person.'
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.phone !== undefined
                      ? provider.application.phone !== ''
                        ? 'Call here to apply: ' + provider.application.phone
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.website !== undefined
                      ? provider.application.website !== ''
                        ? 'Apply here: ' + provider.applcation.website
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.email !== undefined
                      ? provider.application.email !== ''
                        ? 'Email here to apply: ' + provider.application.email
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.other_info !== undefined
                      ? provider.application.other_info !== ''
                        ? 'Additional Information: ' +
                          provider.application.other_info
                        : ''
                      : '')
                  : ''}
              </Card.Text>
              
              </Card.Body>
              </Card>
              )}

              {(provider.additional_information == undefined ||
                provider.additional_information == '') && !info ? null : (
              <Card className="providerCard-container indiv-con" style={{display:!info ? 'none' : ''}}>
              <Card.Title className='text-left p-3 description-title' >Additional Information</Card.Title>
                <Card.Body>
             
              <Card.Text>
                {provider.additional_information !== undefined &&
                provider.additional_information !== ''
                  ? provider.additional_information
                  : ''}
              </Card.Text>
            </Card.Body>
          </Card>
              )}
            </div>
           



           <div className='desktop-indiv'>
            {!provider ? null : (
            <Card className="providerCard-container indiv-con">
            <Card.Title className='text-left p-3 description-title'>Services</Card.Title>
              <Card.Body>
              <Card.Text >
                {provider.services_provided !== '' &&
                provider.services_provided !== undefined
                  ? provider.services_provided
                  : 'Services not listed'}
              </Card.Text>
              
              </Card.Body>
              </Card>
            )}
              
              {!provider ? null : (
              <Card className="providerCard-container indiv-con">
              <Card.Title className='text-left p-3 description-title'>Appointment</Card.Title>
                <Card.Body>
                <Card.Text>
                {provider.eligibility_criteria !== ''
                  ? (<span><strong className="subtitle appt">Eligibility / Requirements</strong><br></br>{provider.eligibility_criteria}</span>)
                  : ''}
                {provider.service_area !== '' ? provider.serve_area : ''}
              </Card.Text>
              <Card.Text>
                {provider.cost_info !== undefined && provider.cost_info !== ''
                  ? (<span><strong className="subtitle appt">Cost</strong><br></br>{provider.cost_info}</span>)
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.walk_ins !== undefined && provider.walk_ins !== ''
                  ? provider.walk_ins === 'Y' || provider.walk_ins === 'y'
                    ? 'Walk ins welcomed.'
                    : ''
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.appointment !== undefined ? (<span><strong className="subtitle appt">Appointment Information</strong><br></br></span>): ''}
                {provider.appointment !== undefined
                  ? (provider.appointment.is_required !== undefined
                      ? provider.appointment.is_required
                        ? 'Appointment is required.'
                        : 'Appointment is not required.'
                      : '') + '\n'
                    +
                    (provider.appointment.phone !== undefined
                      ? provider.appointment.phone !== ''
                        ? 'Call here: ' + provider.appointment.phone
                        : ''
                      : '') +
                    '\n' +
                    (provider.appointment.website !== undefined
                      ? provider.appointment.website !== ''
                        ? 'Click here: ' + provider.appointment.website
                        : ''
                      : '') +
                    '\n' +
                    (provider.appointment.email !== undefined
                      ? provider.appointment.email !== ''
                        ? 'Email here: ' + provider.appointment.email
                        : ''
                      : '') +
                    '\n' +
                    (provider.appointment.other_info !== undefined
                      ? provider.appointment.other_info !== ''
                        ? 'Additional information: ' +
                          provider.appointment.other_info
                        : ''
                      : '')
                  : ''}
              </Card.Text>
              <Card.Text>
              {provider.application !== undefined || provider.application !== "" ? (<span><strong className="subtitle appt" >Application Information</strong><br></br></span>): ''}
                {provider.application !== undefined
                  ? (provider.application.is_required !== undefined
                      ? provider.application.is_required
                        ? 'Application is required.'
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.apply_online !== undefined
                      ? provider.application.apply_online
                        ? 'You must apply online.'
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.apply_in_person !== undefined
                      ? provider.application.apply_in_person
                        ? 'You must apply in person.'
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.phone !== undefined
                      ? provider.application.phone !== ''
                        ? 'Call here to apply: ' + provider.application.phone
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.website !== undefined
                      ? provider.application.website !== ''
                        ? 'Apply here: ' + provider.applcation.website
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.email !== undefined
                      ? provider.application.email !== ''
                        ? 'Email here to apply: ' + provider.application.email
                        : ''
                      : '') +
                    '\n' +
                    (provider.application.other_info !== undefined
                      ? provider.application.other_info !== ''
                        ? 'Additional Information: ' +
                          provider.application.other_info
                        : ''
                      : '')
                  : ''}
              </Card.Text>
              
              </Card.Body>
              </Card>
              )}

              {provider.additional_information == undefined ||
                provider.additional_information == '' ? null : (
              <Card className="providerCard-container indiv-con">
              <Card.Title className='text-left p-3 description-title' >Additional Information</Card.Title>
                <Card.Body>
             
              <Card.Text>
                {provider.additional_information !== undefined &&
                provider.additional_information !== ''
                  ? provider.additional_information
                  : ''}
              </Card.Text>
            </Card.Body>
          </Card>
              )}
              </div>
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
