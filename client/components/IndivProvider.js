import React from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Card, Container } from 'react-bootstrap';

// This component renders the individual provider view,
// with more detail
// Checks fields for validity to prevent crashes if undefined

class IndivProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      provider: null,
    };
  }

  // Get provider from backend based on id passed in
  componentDidMount() {
    axios
      .get(`/api/provider/${this.props.id}`)
      .then((res) => {
        this.setState({ provider: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addBreakToEnd = (string) => {
    return (
      <React.Fragment>
        {string}
        <br />
      </React.Fragment>
    );
  };

  render() {
    const br = <br></br>;
    console.log('Reached IndivProvider');
    console.log(this.props.id);

    console.log(this.state.provider);
    const currProv = this.state.provider;
    return (
      <>
        {this.state.provider == null ? (
          'Loading!'
        ) : (
          <Container>
            <Card
              body
              inverse
              style={{ backgroundColor: '#cacae0', borderColor: '#333' }}
              outline
              color='#000'
            >
              <Card.Title className='text-center p-3'>
                {currProv.name}
              </Card.Title>
              <Card.Body>
                <Card.Subtitle className='text-muted'>
                  {currProv.services_provided !== '' &&
                  currProv.services_provided !== undefined
                    ? currProv.services_provided
                    : 'Services not provided'}
                </Card.Subtitle>
                <br></br>
                <Card.Text>
                  {currProv.eligibility_criteria !== ''
                    ? '\n\n' + currProv.eligibility_criteria
                    : ''}
                  {currProv.service_area !== '' ? currProv.serve_area : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.addresses !== undefined &&
                  currProv.addresses.length > 0
                    ? this.addBreakToEnd('Location:')
                    : ''}
                  {currProv.addresses[0] !== undefined
                    ? currProv.addresses[0].line_1
                    : ''}
                  {currProv.addresses[0] !== undefined &&
                  currProv.addresses[0].line_2 !== undefined &&
                  currProv.addresses[0].line_2 !== ''
                    ? ', ' + currProv.addresses[0].line_2
                    : ''}
                  {currProv.addresses[0] !== undefined &&
                  currProv.addresses[0].city !== undefined &&
                  currProv.addresses[0].city !== ''
                    ? ', ' + currProv.addresses[0].city
                    : ''}
                  {currProv.addresses[0] !== undefined &&
                  currProv.addresses[0].state !== undefined &&
                  currProv.addresses[0].state !== ''
                    ? ', ' + currProv.addresses[0].state
                    : ''}
                  {currProv.addresses[0] !== undefined &&
                  currProv.addresses[0].zipcode !== undefined &&
                  currProv.addresses[0].zipcode !== ''
                    ? ', ' + currProv.addresses[0].zipcode
                    : ''}
                </Card.Text>
                <Card.Text>
                  Contact Information{': '}
                  {currProv.phone_numbers && currProv.phone_numbers.length > 0
                    ? currProv.phone_numbers[0].number
                    : null}
                  {currProv.phone_numbers &&
                  currProv.phone_numbers.length > 0 &&
                  currProv.phone_numbers[0].contact !== undefined &&
                  currProv.phone_numbers[0].contact !== ''
                    ? ', ' + currProv.phone_numbers[0].contact
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.email[0] !== undefined && currProv.email[0] !== ''
                    ? 'Email: ' + currProv.email[0]
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.bus_routes[0] !== undefined &&
                  currProv.bus_routes[0] !== ''
                    ? 'Bus Route(s): ' + currProv.bus_routes[0]
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.website[0] !== undefined &&
                  currProv.website[0] !== ''
                    ? 'Website: ' + currProv.website[0]
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.hours !== undefined
                    ? this.addBreakToEnd('Hours:')
                    : ''}
                  {currProv.hours.monday !== undefined &&
                  currProv.hours.monday !== ''
                    ? this.addBreakToEnd('Monday: ' + currProv.hours.monday)
                    : ''}
                  {currProv.hours.tuesday !== undefined &&
                  currProv.hours.tuesday !== ''
                    ? this.addBreakToEnd('Tuesday: ' + currProv.hours.tuesday)
                    : ''}
                  {currProv.hours.wednesday !== undefined &&
                  currProv.hours.wednesday !== ''
                    ? this.addBreakToEnd(
                      'Wednesday: ' + currProv.hours.wednesday,
                    )
                    : ''}
                  {currProv.hours.thursday !== undefined &&
                  currProv.hours.thursday !== ''
                    ? this.addBreakToEnd('Thursday: ' + currProv.hours.thursday)
                    : ''}
                  {currProv.hours.friday !== undefined &&
                  currProv.hours.friday !== ''
                    ? this.addBreakToEnd('Friday: ' + currProv.hours.friday)
                    : ''}
                  {currProv.hours.saturday !== undefined &&
                  currProv.hours.saturday !== ''
                    ? this.addBreakToEnd('Saturday: ' + currProv.hours.saturday)
                    : ''}
                  {currProv.hours.sunday !== undefined &&
                  currProv.hours.sunday !== ''
                    ? 'Sunday: ' + currProv.hours.sunday
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.walk_ins !== undefined && currProv.walk_ins !== ''
                    ? currProv.walk_ins === 'Y' || currProv.walk_ins === 'y'
                      ? 'Walk ins welcomed.'
                      : ''
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.appointment !== undefined
                    ? (currProv.appointment.is_required !== undefined
                      ? currProv.appointment.is_required
                        ? 'Appointment is required.'
                        : 'Appointment is not required.'
                      : '') +
                      '\n' +
                      (currProv.appointment.phone !== undefined
                        ? currProv.appointment.phone !== ''
                          ? 'Call here: ' + currProv.appointment.phone
                          : ''
                        : '') +
                      '\n' +
                      (currProv.appointment.website !== undefined
                        ? currProv.appointment.website !== ''
                          ? 'Click here: ' + currProv.appointment.website
                          : ''
                        : '') +
                      '\n' +
                      (currProv.appointment.email !== undefined
                        ? currProv.appointment.email !== ''
                          ? 'Email here: ' + currProv.appointment.email
                          : ''
                        : '') +
                      '\n' +
                      (currProv.appointment.other_info !== undefined
                        ? currProv.appointment.other_info !== ''
                          ? 'Additional information: ' +
                            currProv.appointment.other_info
                          : ''
                        : '')
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.application !== undefined
                    ? (currProv.application.is_required !== undefined
                      ? currProv.application.is_required
                        ? 'Application is required.'
                        : ''
                      : '') +
                      '\n' +
                      (currProv.application.apply_online !== undefined
                        ? currProv.application.apply_online
                          ? 'You must apply online.'
                          : ''
                        : '') +
                      '\n' +
                      (currProv.application.apply_in_person !== undefined
                        ? currProv.application.apply_in_person
                          ? 'You must apply in person.'
                          : ''
                        : '') +
                      '\n' +
                      (currProv.application.phone !== undefined
                        ? currProv.application.phone !== ''
                          ? 'Call here to apply: ' + currProv.application.phone
                          : ''
                        : '') +
                      '\n' +
                      (currProv.application.website !== undefined
                        ? currProv.application.website !== ''
                          ? 'Apply here: ' + currProv.applcation.website
                          : ''
                        : '') +
                      '\n' +
                      (currProv.application.email !== undefined
                        ? currProv.application.email !== ''
                          ? 'Email here to apply: ' + currProv.application.email
                          : ''
                        : '') +
                      '\n' +
                      (currProv.application.other_info !== undefined
                        ? currProv.application.other_info !== ''
                          ? 'Additional Information: ' +
                            currProv.application.other_info
                          : ''
                        : '')
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.cost_info !== undefined && currProv.cost_info !== ''
                    ? 'Cost Information: ' + currProv.cost_info
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.translation_available !== undefined &&
                  currProv.translation_available !== ''
                    ? 'Translation available: ' + currProv.translation_available
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.united_way_approval !== undefined
                    ? currProv.united_way_approval
                      ? 'United Way approved.'
                      : ''
                    : ''}
                </Card.Text>
                <Card.Text>
                  {currProv.additional_information !== undefined &&
                  currProv.additional_information !== ''
                    ? 'Additional information: ' +
                      currProv.additional_information
                    : ''}
                </Card.Text>
              </Card.Body>
            </Card>
          </Container>
        )}
      </>
    );
  }
}

IndivProvider.propTypes = {
  id: PropTypes.instanceOf(String).isRequired,
};

export default IndivProvider;
