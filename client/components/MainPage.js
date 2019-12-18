import React from 'reactn';
import { Container, Row, Col } from 'react-bootstrap';
import RedirectButton from './RedirectButton';
import paths from '../RouterPaths';

// Main page component with two buttons for search by category and by name

class MainPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container
          style={{
            margins: 'auto auto',
            maxWidth: '60em',
          }}
        >
          <Row className='justify-content-md-center' style={{ margin: 'auto' }}>
            <Col
              md='auto'
              style={{ textAlign: 'center', paddingBottom: '1em' }}
            >
              <RedirectButton path={paths.topLevelCategoriesPath}>
                Find a resource by category.
              </RedirectButton>
            </Col>
            <Col md='auto' style={{ textAlign: 'center' }}>
              <RedirectButton path={paths.searchPath}>
                Search for a resource by name.
              </RedirectButton>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default MainPage;
