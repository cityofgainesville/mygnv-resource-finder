import React from 'reactn';
import { Alert } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';

// Title component, displays blue bar with icon and text

class Homepage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container>
          <Alert
            variant='primary'
            style={{
              marginTop: '1em',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            className='blue-cool-70v-bg white-0'
          >
            <Row className='justify-content-center' style={{ margin: 'auto' }}>
              <Col xs={2}>
                <i className='fas fa-hand-holding-heart fa-3x' />
              </Col>
              <Col xs={10} style={{ paddingLeft: '3em', textAlign: 'left' }}>
                <div>
                  Life can get tough sometimes. We get it. We’re here to help.
                  Find free resources here.
                </div>
              </Col>
            </Row>
          </Alert>
        </Container>
      </React.Fragment>
    );
  }
}

export default Homepage;
