import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import { Container, ListGroup, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import './SubcategoryChildren.scss';
import axios from 'axios';

import paths from '../../../RouterPaths';
import Homepage from '../Title';

const SubcategoryChildren = (props) => {
  const [visible, setVisible] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [categories, setCategories] = useState(null);
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

    useEffect(() => {
      setCategories(null);
      //setCategory(null);
      setLoadingComplete(false);
      getData();
    }, [props.id]);
  
  const getData = () => {
    console.log(props.category.children);
    props.category.children.forEach((child, i) => {
      console.log(child);
    axios
            .get(`/api/categories/${child}`)
            .then((res) => {
              setCategories(res.data);
              console.log(res.data);
              //console.log(res.data.children);
              //if(!res.data.is_subcategory){
                //setParent(res.data.name);
              //console.log(res.data.name);
             // }
              setLoadingComplete(true);
            })
            .catch((err) => {
              console.log(err);
            });
          });
        }

  const doRedirect = (providerId) => {
    props.history.push(`${paths.categoryPath}/${providerId}`);
  };

  const categoryList = () => {
    /*if (!loadingComplete) return null;
    console.log("dshj");*/
    categories.sort((a, b) => (a.name > b.name) ? 1 : -1).map((category) => {
    return (
      <ListGroup.Item
        key={category.id}
        className=' subcat'
        action
        onClick={() => doRedirect(category.id)}
      >
        <span>{category.name}</span>
        <i class="fal fa-angle-right cat-icon"></i>
        
      </ListGroup.Item>
    );
  });
}


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
