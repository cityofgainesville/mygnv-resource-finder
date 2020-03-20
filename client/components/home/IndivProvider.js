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

  const renderHours = () => {
    return (
      <Card.Text>
        <i class="fas fa-clock"></i>
        {provider.hours !== undefined ? addBreakToEnd('Hours:') : ''}
        {provider.hours.monday !== undefined && provider.hours.monday !== ''
          ? addBreakToEnd('Monday: ' + provider.hours.monday)
          : ''}
        <br></br>
        {provider.hours.tuesday !== undefined && provider.hours.tuesday !== ''
          ? addBreakToEnd('Tuesday: ' + provider.hours.tuesday)
          : ''}
        <br></br>
        {provider.hours.wednesday !== undefined &&
        provider.hours.wednesday !== ''
          ? addBreakToEnd('Wednesday: ' + provider.hours.wednesday)
          : ''}
          <br></br>
        {provider.hours.thursday !== undefined && provider.hours.thursday !== ''
          ? addBreakToEnd('Thursday: ' + provider.hours.thursday)
          : ''}
          <br></br>
        {provider.hours.friday !== undefined && provider.hours.friday !== ''
          ? addBreakToEnd('Friday: ' + provider.hours.friday)
          : ''}
          <br></br>
        {provider.hours.saturday !== undefined && provider.hours.saturday !== ''
          ? addBreakToEnd('Saturday: ' + provider.hours.saturday)
          : ''}
          <br></br>
        {provider.hours.sunday !== undefined && provider.hours.sunday !== ''
          ? 'Sunday: ' + provider.hours.sunday
          : ''}
      </Card.Text>
    );
  };

  const br = <br></br>;

  return (
    <React.Fragment>
      
      <div>
      <div
        style={myStyle}
      >
          <Form className= 'white-0-bg' style={formStyle}>
            <Form.Group controlId='formFilterText'>
              
              <Container style={{margin:'0 0'}}>
			  <Form.Label>
				  
              </Form.Label>
              </Container>
            </Form.Group>
          </Form>
      {!provider ? null : (
        <Container className='body'>
          <Card
            color='#000'
            className="providerCard-container"
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
              {provider.name} 
           
              <Card.Text class='translation'>
                {provider.translation_available !== undefined &&
                provider.translation_available !== ''
                  ? provider.translation_available
                  : ''}
              </Card.Text>
              </Card.Title>
            <Card.Body>
           
            
              <Col id='left'>
            <Card.Text>
                {provider.addresses !== undefined &&
                provider.addresses.length > 0
                  ? (<i class="fas fa-map-marker-alt"></i>)
                  : ''}
                
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
                  
              </Card.Text>
              <Card.Text>
                {provider.bus_routes[0] !== undefined &&
                provider.bus_routes[0] !== ''
                  ? 'Bus Route(s): ' + provider.bus_routes[0]
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.phone_numbers && provider.phone_numbers.length > 0
                  ?(<div><i class="fas fa-phone"></i><span>{provider.phone_numbers[0].number}</span></div>)
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
                  ? (<div><i class="fas fa-envelope"></i> <span>{provider.email[0]}</span></div>)
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.website[0] !== undefined && provider.website[0] !== ''
                  ? ( <div>
                  <Button href={provider.website[0]} target='_blank' variant='info' className="provider-buttons">Go to Website</Button>
                  <Button variant='info' className="provider-buttons">Maps</Button></div>) : ''}
              </Card.Text>
              </Col>
              <Col id='right'>
              {provider.hours ? renderHours() : null}
              <br></br>
              </Col>
            </Card.Body>
            </Card>
           
           
            {!provider ? null : (
            <Card className="providerCard-container">
            <Card.Title className='text-left p-3 description-title'>Services</Card.Title>
              <Card.Body>
              <Card.Text >
                {provider.services_provided !== '' &&
                provider.services_provided !== undefined
                  ? provider.services_provided
                  : 'Services not provided'}
              </Card.Text>
              
              </Card.Body>
              </Card>
            )}
              
              {!provider ? null : (
              <Card className="providerCard-container">
              <Card.Title className='text-left p-3 description-title'>Appointment</Card.Title>
                <Card.Body>
                <Card.Text>
                {provider.eligibility_criteria !== ''
                  ? (<p><strong>Eligibility/Requirements</strong><br></br>{provider.eligibility_criteria}</p>)
                  : ''}
                {provider.service_area !== '' ? provider.serve_area : ''}
              </Card.Text>
              <Card.Text>
                {provider.cost_info !== undefined && provider.cost_info !== ''
                  ? (<p><strong>Cost</strong><br></br>{provider.cost_info}</p>)
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
                {provider.appointment !== undefined ? (<p><strong>Appointment Information</strong><br></br></p>): ''}
                {provider.appointment !== undefined
                  ? (provider.appointment.is_required !== undefined
                      ? provider.appointment.is_required
                        ? 'Appointment is required.'
                        : 'Appointment is not required.'
                      : '') +
                    '\n' +
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
              {provider.application !== undefined ? (<p><strong>Application Information</strong><br></br></p>): ''}
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
              <Card className="providerCard-container">
              <Card.Title className='text-left p-3 description-title' >Additional Information</Card.Title>
                <Card.Body>
             
              <Card.Text>
                {provider.additional_information !== undefined &&
                provider.additional_information !== ''
                  ? 'Additional information: ' + provider.additional_information
                  : ''}
              </Card.Text>
            </Card.Body>
          </Card>
              )}
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
