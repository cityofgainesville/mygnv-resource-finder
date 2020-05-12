import React, { useState } from 'reactn';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './CategoryCard.scss';

// Renders tile for top level category
// uses fontawesome light for the icon

const CategoryCard = (props) => {
  const [className, setClassName] = useState('cat-card-border');
  const [icolor, setColor] = useState('#074b69');

  const handleClick = () => {
    setClassName('cat-card-border-active');
    props.history.push(props.path);
    window.location.reload(false);
  };

  // Change color on hover
  const startHover = () => {
    setClassName('cat-card-border-active');
    setColor('white');
  };
  const endHover = () => {
    setClassName('cat-card-border');
    setColor('#074b69');
  };

  // Renders the tile button for a top level category
  return (
    <div className="catCard-con">
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
    </Button>
    <div className='cat-card-div '>{props.categoryName}</div>
    </div>
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
