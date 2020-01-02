import React from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';

// import Categories from './Categories';
// import SubCategories from './SubCategories';
import SubcategoryProviderList from './SubcategoryProviderList';

import SubcategoryChildren from './SubcategoryChildren';

import TopLevelCategory from './TopLevelCategory';

class CategoryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      category: null,
      loadingComplete: false,
    };
  }

  shouldRenderProviders = (category) => {
    return category.isSubcategory == 'true' || category.children.length === 0;
  };

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.onCategoryChange();
    }
  }

  onCategoryChange = () => {
    this.setState({
      loadingComplete: false,
      categories: null,
      category: null,
    });
    this.componentDidMount();
  };

  // Get provider from backend based on id passed in
  componentDidMount() {
    if (!this.props.id) {
      axios
        .get('/api/category/topLevelCategory')
        .then((res) => {
          this.setState({
            categories: Object.values(res.data),
            loadingComplete: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(`/api/category/${this.props.id}`)
        .then((res) => {
          const queryParam = this.shouldRenderProviders(res.data)
            ? 'providers'
            : 'children';
          console.log(queryParam);
          axios
            .get(`/api/category/${this.props.id}`, {
              params: { [queryParam]: true },
            })
            .then((res) => {
              this.setState({ category: res.data, loadingComplete: true });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    if (!this.state.loadingComplete) return null;

    if (!this.props.id && this.state.categories) {
      return <TopLevelCategory categories={this.state.categories} />;
    } else if (this.state.category) {
      if (this.shouldRenderProviders(this.state.category)) {
        return (
          <SubcategoryProviderList providers={this.state.category.providers} />
        );
      } else {
        return <SubcategoryChildren category={this.state.category} />;
      }
    } else {
      return null;
    }
  }
}

CategoryView.propTypes = {
  id: PropTypes.instanceOf(String),
};

export default CategoryView;
