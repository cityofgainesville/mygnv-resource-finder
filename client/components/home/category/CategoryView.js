import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';

import SubcategoryProviderList from './SubcategoryProviderList';
import SubcategoryChildren from './SubcategoryChildren';
import TopLevelCategory from './TopLevelCategory';

const CategoryView = (props) => {
  const [categories, setCategories] = useState(null);
  const [parent, setParent] = useState('');
  const [category, setCategory] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const shouldRenderProviders = (category) => {
    return category.is_subcategory || category.children.length === 0;
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
        .get('/api/categories/listTopLevel')
        .then((res) => {
          setCategories(Object.values(res.data));
          setLoadingComplete(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(`/api/categories/${props.id}`)
        .then((res) => {
          const queryParam = shouldRenderProviders(res.data)
            ? 'providers'
            : 'children';
          console.log(queryParam);
          axios
            .get(`/api/categories/${props.id}`, {
              params: { [queryParam]: true },
            })
            .then((res) => {
              setCategory(res.data);
              if(!res.data.is_subcategory){
                setParent(res.data.name);
              //console.log(res.data.name);
              }
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
        return <SubcategoryProviderList providers={category.providers} subcategory={category} parentName={parent}/>;
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
  id: PropTypes.string,
};

export default CategoryView;
