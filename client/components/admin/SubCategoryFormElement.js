import React from 'reactn';
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

// Custom multiselect form element
// used to change category -> parent category links

class SubCategoryFormElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      currentSubCategoryOf: [],
    };
  }

  componentDidMount() {
    this.setState({ currentSubCategoryOf: [...this.props.subCategoryOf] });

    axios
      .get('/api/category')
      .then((res) => {
        this.setState({
          categories: Object.values(res.data),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSubCategoryOfChange = (individualSubCategoryOf) => {
    const set = new Set(this.state.currentSubCategoryOf);
    if (set.has(individualSubCategoryOf)) {
      set.delete(individualSubCategoryOf);
    } else set.add(individualSubCategoryOf);
    this.setState({ currentSubCategoryOf: [...set] });
    this.props.handleSubCategoryOfChange(
      [...set].map((category) => {
        return category._id;
      }),
    );
  };

  render() {
    const set = new Set(this.state.currentSubCategoryOf);
    console.log(set);
    // A child can't have it's itself as a parent
    // A child can only have top level categories as
    const reasonableParentCategories = this.state.categories
      .filter((category) => {
        return (
          category._id !== this.props.id && category.subcategory_of.length === 0
        );
      })
      .map((category) => {
        return (
          <ListGroup.Item
            className={
              this.state.currentSubCategoryOf.filter((innerCategory) => {
                return innerCategory._id === category._id;
              }).length > 0
                ? 'bg-primary'
                : ''
            }
            key={category._id}
            onClick={() => {
              this.handleSubCategoryOfChange(category);
            }}
          >
            {category.name}
          </ListGroup.Item>
        );
      });
    console.log(reasonableParentCategories);
    return (
      <ListGroup style={{ overflowY: 'scroll', maxHeight: '15em' }}>
        {reasonableParentCategories}
      </ListGroup>
    );
  }
}

SubCategoryFormElement.propTypes = {
  subCategoryOf: PropTypes.instanceOf(Array).isRequired,
  id: PropTypes.string,
  handleSubCategoryOfChange: PropTypes.func.isRequired,
};

export default SubCategoryFormElement;
