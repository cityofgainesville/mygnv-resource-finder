import React from 'reactn';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import paths from '../../../RouterPaths';
import './TopLevelCategory.scss';

import CategoryCard from './CategoryCard';

const TopLevelCategory = (props) => {
  const iconSize = 3;
  const numIcons = 4;

  const categoryRowList = [];
  let categoryCol = <React.Fragment></React.Fragment>;
  /*props.categories.forEach((category, i) => {
    if (i % numIcons == 0 && i != 0) {
      categoryRowList.push(categoryCol);
      categoryCol = <React.Fragment></React.Fragment>;
    }
    if(category.name == "COVID-19"){
    categoryCol = (
      <React.Fragment>
        {categoryCol}
        <Col className='toplevel-col'>
          <CategoryCard
            iconName={category.icon_name}
            iconSize={iconSize}
            categoryName={category.name}
            path={`${paths.categoryPath}/${category._id}`}
          />
        </Col>
      </React.Fragment>
    );
    }
    if (i == props.categories.length - 1) {
      categoryRowList.push(categoryCol);
    }
  });*/
  // Have the grid be max 3col wide
  props.categories.sort((a, b) => (a.name > b.name ) ? 1 : -1).forEach((category, i) => {
    if (i % numIcons == 0 && i != 0) {
      categoryRowList.push(categoryCol);
      categoryCol = <React.Fragment></React.Fragment>;
    }
    if(category.name != "Other" && category.name != "COVID-19"){
      console.log(category.icon_name);
      console.log(category.name);
    categoryCol = (
      <React.Fragment>
        {categoryCol}
        <Col className='toplevel-col'>
          <CategoryCard
            id={category.id}
            iconName={category.icon_name}
            iconSize={iconSize}
            categoryName={category.name}
            path={`${paths.categoryPath}/${category.id}`}
          />
        </Col>
      </React.Fragment>
    );
    }
    if (i == props.categories.length - 1) {
      categoryRowList.push(categoryCol);
    }
  });
  /*props.categories.forEach((category, i) => {
    if (i % numIcons == 0 && i != 0) {
      categoryRowList.push(categoryCol);
      categoryCol = <React.Fragment></React.Fragment>;
    }
    if(category.name == "Other" ){
    categoryCol = (
      <React.Fragment>
        {categoryCol}
        <Col className='toplevel-col'>
          <CategoryCard
            iconName={category.icon_name}
            iconSize={iconSize}
            categoryName={category.name}
            path={`${paths.categoryPath}/${category._id}`}
          />
        </Col>
      </React.Fragment>
    );
    }
    if (i == props.categories.length - 1) {
      categoryRowList.push(categoryCol);
    }
  });*/
  let categoryGrid = <React.Fragment></React.Fragment>;
  categoryRowList.forEach((row) => {
    categoryGrid = (
      <React.Fragment>
        {categoryGrid}
        <Row className='toplevel-row'>{row}</Row>
      </React.Fragment>
    );
  });
  return (
    <React.Fragment>
      <Container className='toplevel-container' style={{paddingLeft: '0', paddingRight: '0'}}>{categoryGrid}</Container>
    </React.Fragment>
  );
};

TopLevelCategory.propTypes = {
  categories: PropTypes.instanceOf(Array),
};

export default TopLevelCategory;
