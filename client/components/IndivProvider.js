import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Card, Container } from 'react-bootstrap';

// This component renders the individual provider view,
// with more detail
// Checks fields for validity to prevent crashes if undefined

const IndivProvider = (props) => {
  const [provider, setProvider] = useState(null);

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

  const br = <br></br>;
  return (
    <>
      {!provider ? null : (
        <Container>
          <Card
            body
            inverse
            style={{ backgroundColor: '#cacae0', borderColor: '#333' }}
            outline
            color='#000'
          >
            <Card.Title className='text-center p-3'>{provider.name}</Card.Title>
            <Card.Body>
              <Card.Subtitle className='text-muted'>
                {provider.services_provided !== '' &&
                provider.services_provided !== undefined
                  ? provider.services_provided
                  : 'Services not provided'}
              </Card.Subtitle>
              <br></br>
              <Card.Text>
                {provider.eligibility_criteria !== ''
                  ? '\n\n' + provider.eligibility_criteria
                  : ''}
                {provider.service_area !== '' ? provider.serve_area : ''}
              </Card.Text>
              <Card.Text>
                {provider.addresses !== undefined &&
                provider.addresses.length > 0
                  ? addBreakToEnd('Location:')
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
                Contact Information{': '}
                {provider.phone_numbers && provider.phone_numbers.length > 0
                  ? provider.phone_numbers[0].number
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
                  ? 'Email: ' + provider.email[0]
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.bus_routes[0] !== undefined &&
                provider.bus_routes[0] !== ''
                  ? 'Bus Route(s): ' + provider.bus_routes[0]
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.website[0] !== undefined && provider.website[0] !== ''
                  ? 'Website: ' + provider.website[0]
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.hours !== undefined ? addBreakToEnd('Hours:') : ''}
                {provider.hours.monday !== undefined &&
                provider.hours.monday !== ''
                  ? addBreakToEnd('Monday: ' + provider.hours.monday)
                  : ''}
                {provider.hours.tuesday !== undefined &&
                provider.hours.tuesday !== ''
                  ? addBreakToEnd('Tuesday: ' + provider.hours.tuesday)
                  : ''}
                {provider.hours.wednesday !== undefined &&
                provider.hours.wednesday !== ''
                  ? addBreakToEnd('Wednesday: ' + provider.hours.wednesday)
                  : ''}
                {provider.hours.thursday !== undefined &&
                provider.hours.thursday !== ''
                  ? addBreakToEnd('Thursday: ' + provider.hours.thursday)
                  : ''}
                {provider.hours.friday !== undefined &&
                provider.hours.friday !== ''
                  ? addBreakToEnd('Friday: ' + provider.hours.friday)
                  : ''}
                {provider.hours.saturday !== undefined &&
                provider.hours.saturday !== ''
                  ? addBreakToEnd('Saturday: ' + provider.hours.saturday)
                  : ''}
                {provider.hours.sunday !== undefined &&
                provider.hours.sunday !== ''
                  ? 'Sunday: ' + provider.hours.sunday
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
              <Card.Text>
                {provider.cost_info !== undefined && provider.cost_info !== ''
                  ? 'Cost Information: ' + provider.cost_info
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.translation_available !== undefined &&
                provider.translation_available !== ''
                  ? 'Translation available: ' + provider.translation_available
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.united_way_approval !== undefined
                  ? provider.united_way_approval
                    ? 'United Way approved.'
                    : ''
                  : ''}
              </Card.Text>
              <Card.Text>
                {provider.additional_information !== undefined &&
                provider.additional_information !== ''
                  ? 'Additional information: ' + provider.additional_information
                  : ''}
              </Card.Text>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
};

IndivProvider.propTypes = {
  id: PropTypes.instanceOf(String).isRequired,
};

export default IndivProvider;
