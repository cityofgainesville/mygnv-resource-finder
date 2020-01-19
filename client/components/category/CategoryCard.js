import React, { useState } from 'reactn';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './CategoryCard.scss';

// Renders tile for top level category
// uses fontawesome light for the icon

const CategoryCard = (props) => {
  const [className, setClassName] = useState('cat-card-border');

  const handleClick = () => {
    setClassName('cat-card-border-active');
    props.history.push(props.path);
  };

  // Change color on hover
  const startHover = () => {
    setClassName('cat-card-border-active');
  };
  const endHover = () => {
    setClassName('cat-card-border');
  };

  // Renders the tile button for a top level category
  return (
    <Button
      onClick={handleClick}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      className={`${className} cat-card-button`}
      variant='outline-*'
    >
      <i
        className={`cat-card-i fal fa-${props.iconName} fa-${props.iconSize}x`}
      ></i>
      <div className='cat-card-div '>{props.categoryName}</div>
    </Button>
  );
};

CategoryCard.propTypes = {
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired,
  categoryName: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(CategoryCard);
