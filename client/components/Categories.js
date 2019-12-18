import React from 'reactn';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import CategoryCard from './CategoryCard';

// Creates the top level category view as a 3col grid,
// with each top level category being an instance of category card

class Categories extends React.Component {
  render() {
    console.log(this.props.categoryList);
    const iconSize = 3;

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

    const colStyle = { padding: '0 0' };

    const categoryRowList = [];
    let categoryCol = <React.Fragment></React.Fragment>;
    // Have the grid be max 3col wide
    this.props.categoryList.forEach((category, i) => {
      if (i % 3 == 0 && i != 0) {
        categoryRowList.push(categoryCol);
        categoryCol = <React.Fragment></React.Fragment>;
      }
      categoryCol = (
        <React.Fragment>
          {categoryCol}
          <Col style={colStyle}>
            <CategoryCard
              iconName={category.icon_name}
              iconSize={iconSize}
              categoryName={category.name}
              path={category.path}
            />
          </Col>
        </React.Fragment>
      );
      if (i == this.props.categoryList.length - 1) {
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
  }
}

Categories.propTypes = {
  categoryList: PropTypes.instanceOf(Array).isRequired,
};

export default Categories;
