import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';

import SubcategoryProviderList from './SubcategoryProviderList';
import SubcategoryChildren from './SubcategoryChildren';
import TopLevelCategory from './TopLevelCategory';

const CategoryView = (props) => {
  const [categories, setCategories] = useState(null);
  const [category, setCategory] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const shouldRenderProviders = (category) => {
    return category.isSubcategory == 'true' || category.children.length === 0;
  };

  // Runs when props.id changes (including on initial mount)
  useEffect(() => {
    setCategories(null);
    setCategory(null);
    setLoadingComplete(false);
    getData();
  }, [props.id]);

  // Get category from backend based on id passed in (or get top level categories)
  const getData = () => {
    if (!props.id) {
      axios
        .get('/api/category/topLevelCategory')
        .then((res) => {
          setCategories(Object.values(res.data));
          setLoadingComplete(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(`/api/category/${props.id}`)
        .then((res) => {
          const queryParam = shouldRenderProviders(res.data)
            ? 'providers'
            : 'children';
          console.log(queryParam);
          axios
            .get(`/api/category/${props.id}`, {
              params: { [queryParam]: true },
            })
            .then((res) => {
              setCategory(res.data);
              setLoadingComplete(true);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const render = () => {
    if (!loadingComplete) return null;

    if (!props.id && categories) {
      return <TopLevelCategory categories={categories} />;
    } else if (category) {
      if (shouldRenderProviders(category)) {
        return <SubcategoryProviderList providers={category.providers} />;
      } else {
        return <SubcategoryChildren category={category} />;
      }
    } else {
      return null;
    }
  };

  return render();
};

CategoryView.propTypes = {
  id: PropTypes.instanceOf(String),
};

export default CategoryView;
