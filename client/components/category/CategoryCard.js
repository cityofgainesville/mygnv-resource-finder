import React from 'reactn';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './CategoryCard.scss';

// Renders tile for top level category
// uses fontawesome light for the icon

class CategoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { className: 'cat-card-border' };
  }

  handleClick = () => {
    this.setState({ className: 'cat-card-border-active' });
    this.props.history.push(this.props.path);
  };

  // Change color on hover

  startHover = () => {
    this.setState({ className: 'cat-card-border-active' });
  };

  endHover = () => {
    this.setState({ className: 'cat-card-border' });
  };

  // Renders the tile button for a top level category

  render() {
    return (
      <Button
        onClick={this.handleClick}
        onMouseEnter={this.startHover}
        onMouseLeave={this.endHover}
        className={this.state.className}
        variant='outline-*'
        style={{
          minWidth: '7em',
          minHeight: '8em',
          marginBottom: '1em',
          padding: '0 0',
        }}
      >
        <i
          className={`fal fa-${this.props.iconName} fa-${this.props.iconSize}x`}
          style={{ display: 'block', paddingTop: '0.2em' }}
        ></i>
        <div style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
          {this.props.categoryName}
        </div>
      </Button>
    );
  }
}

CategoryCard.propTypes = {
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired,
  categoryName: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(CategoryCard);
