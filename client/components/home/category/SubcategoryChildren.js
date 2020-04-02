import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import { Container, ListGroup, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import './SubcategoryChildren.scss';

import paths from '../../../RouterPaths';
import Homepage from '../Title';

const SubcategoryChildren = (props) => {
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

  const doRedirect = (providerId) => {
    props.history.push(`${paths.categoryPath}/${providerId}`);
  };

  const categoryList = props.category.children.sort((a, b) => (a.name > b.name) ? 1 : -1).map((category) => {
    return (
      <ListGroup.Item
        key={category._id}
        className=' subcat'
        action
        onClick={() => doRedirect(category._id)}
      >
        <span>{category.name}</span>
        <i class="fal fa-angle-right cat-icon"></i>
        
      </ListGroup.Item>
    );
  });


  return (
    <React.Fragment>
      
      <div >
      
      <div
        className='search-con subcat-container scroll'
      >
          <Form className= 'white-0-bg search-form'>
            <Form.Group className='search-form-group' controlId='formFilterText'>
              <Container style={{margin:'0 0'}}>
			  <Form.Label className='form-label-n'>
        {props.category.name}
              </Form.Label>
              </Container>
            </Form.Group>
          </Form>
      <Container className={'subcat-children-container-width body'}>
        {categoryList}
      </Container>
      </div>
      </div>
    </React.Fragment>
  );
};

SubcategoryChildren.propTypes = {
  category: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(SubcategoryChildren);
