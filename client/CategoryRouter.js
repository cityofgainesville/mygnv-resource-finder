import React from 'reactn';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import paths from './RouterPaths';

import Categories from './components/Categories';
import SubCategories from './components/SubCategories';
import ProviderList from './components/ProviderList';

// Adds routes for categories and subcategories and providerlist
// If category is_lowest_level is true then will render providerList
// Else will render subcategory list
// If is top level categories path then will render top level
// categories instead

class CategoryRouter extends React.Component {
  render() {
    const subCategories = this.props.categories.map((subCategory) => {
      if (subCategory.is_lowest_level) {
        return (
          <Route
            key={subCategory._id}
            path={subCategory.path}
            render={() => <ProviderList category={subCategory} />}
          />
        );
      } else {
        const subCategoryList = this.props.categories.filter(
          (insideSubCategory) => {
            return (
              insideSubCategory.subcategory_of.length > 0 &&
              insideSubCategory.subcategory_of.filter((parent) => {
                return parent._id == subCategory._id;
              }).length
            );
          },
        );
        return (
          <Route
            exact
            key={subCategory._id}
            path={subCategory.path}
            render={() => <SubCategories categoryList={subCategoryList} />}
          />
        );
      }
    });

    return (
      <React.Fragment>
        <Route
          exact
          path={paths.topLevelCategoriesPath}
          render={() => (
            <Categories
              categoryList={this.props.categories.filter((subCategory) => {
                return subCategory.subcategory_of.length === 0;
              })}
            />
          )}
        />
        {subCategories}
      </React.Fragment>
    );
  }
}

CategoryRouter.propTypes = {
  categories: PropTypes.instanceOf(Array).isRequired,
};

export default CategoryRouter;
