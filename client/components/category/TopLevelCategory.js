import React from 'reactn';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import paths from '../../RouterPaths';
import './TopLevelCategory.scss';

import CategoryCard from './CategoryCard';

const TopLevelCategory = (props) => {
  const iconSize = 3;

  const categoryRowList = [];
  let categoryCol = <React.Fragment></React.Fragment>;
  // Have the grid be max 3col wide
  props.categories.forEach((category, i) => {
    if (i % 3 == 0 && i != 0) {
      categoryRowList.push(categoryCol);
      categoryCol = <React.Fragment></React.Fragment>;
    }
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
    if (i == props.categories.length - 1) {
      categoryRowList.push(categoryCol);
    }
  });
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
      <Container className='toplevel-container'>{categoryGrid}</Container>
    </React.Fragment>
  );
};

TopLevelCategory.propTypes = {
  categories: PropTypes.instanceOf(Array),
};

export default TopLevelCategory;
