import React from 'reactn';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import paths from '../../RouterPaths';

import SubCategoryCard from './SubcategoryCard';

const SubcategoryChildren = (props) => {
  const containerStyle = {
    maxWidth: '30em',
    margin: 'auto auto',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const rowStyle = {
    margin: 'auto',
    justifyContent: 'center',
  };

  const colStyle = { padding: '0 0 0.5em 0' };

  const categoryRowList = [];
  let categoryCol = <React.Fragment></React.Fragment>;
  props.category.children.forEach((category, i) => {
    if (i % 1 == 0 && i != 0) {
      categoryRowList.push(categoryCol);
      categoryCol = <React.Fragment></React.Fragment>;
    }
    categoryCol = (
      <React.Fragment>
        {categoryCol}
        <Col style={colStyle}>
          <SubCategoryCard
            categoryName={category.name}
            path={`${paths.categoryPath}/${category._id}`}
          />
        </Col>
      </React.Fragment>
    );
    if (i == props.category.children.length - 1) {
      categoryRowList.push(categoryCol);
    }
  });
  let categoryGrid = <React.Fragment></React.Fragment>;
  categoryRowList.forEach((row, i) => {
    categoryGrid = (
      <React.Fragment>
        {categoryGrid}
        <Row style={rowStyle}>{row}</Row>
      </React.Fragment>
    );
  });
  return (
    <React.Fragment>
      <Container style={containerStyle}>{categoryGrid}</Container>
    </React.Fragment>
  );
};

SubcategoryChildren.propTypes = {
  category: PropTypes.instanceOf(Object),
};

export default SubcategoryChildren;
