import React, { useState, useEffect } from 'reactn';
import { Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import axios from 'axios';

// Category edit modal form, uses custom multiselect form element
// Used for category admin portal

const CategoryEdit = (props) => {
  const getCategoryToEditFromProps = () => {
    return props.id
      ? props.categories.filter((category) => {
          return category._id === props.id;
        })[0]
      : null;
  };

  const generateProviderOptions = () => {
    return props.providers.map((provider) => {
      return { value: provider._id, label: provider.name };
    });
  };

  const generateCategoryOptions = () => {
    return props.categories.map((category) => {
      return { value: category._id, label: category.name };
    });
  };

  const generateSubcategoryOptions = () => {
    return props.categories
      .filter((category) => {
        return category.is_subcategory;
      })
      .map((category) => {
        return { value: category._id, label: category.name };
      });
  };

  const [categoryToEdit, setCategoryToEdit] = useState(
    getCategoryToEditFromProps()
  );
  const [providerOptions, setProviderOptions] = useState(
    generateProviderOptions()
  );
  const [categoryOptions, setCategoryOptions] = useState(
    generateCategoryOptions()
  );
  const [subcategoryOptions, setSubcategoryOptions] = useState(
    generateSubcategoryOptions()
  );
  const boolOptions = [
    { value: false, label: 'False' },
    { value: true, label: 'True' },
  ];

  const [success, setSuccess] = useState(false);
  const [hadError, setHadError] = useState(false);
  const [modalIsDisplayed, setModalIsDisplayed] = useState(false);
  const [showProviders, setShowProviders] = useState(boolOptions[0]);

  const [name, setName] = useState('');
  const [providers, setProviders] = useState([]);
  const [children, setChildren] = useState([]);
  const [iconName, setIconName] = useState('');
  const [isSubcategory, setIsSubcategory] = useState(boolOptions[0]);

  /**
   * Reset success/fail flags
   */
  const resetFlags = () => {
    setHadError(false);
    setSuccess(false);
  };

  const clearState = () => {
    setName('');
    setProviders([]);
    setChildren([]);
    setIconName('');
    setIsSubcategory(boolOptions[0]);
  };

  const populateExistingCategory = () => {
    setName(categoryToEdit.name);
    const providerIds = new Set(categoryToEdit.providers);
    console.log(providerIds);
    console.log(
      providerOptions.filter((option) => {
        return providerIds.has(option.value);
      })
    );
    setProviders(
      providerOptions.filter((option) => {
        return providerIds.has(option.value);
      })
    );
    const categoryIds = new Set(categoryToEdit.children);
    setChildren(
      categoryOptions.filter((option) => {
        return categoryIds.has(option.value);
      })
    );
    setIconName(
      categoryToEdit.icon_name === 'null' ? '' : categoryToEdit.icon_name
    );
    setIsSubcategory(
      categoryToEdit.is_subcategory ? boolOptions[1] : boolOptions[0]
    );
  };

  useEffect(() => {
    setCategoryToEdit(getCategoryToEditFromProps());
    setProviderOptions(generateProviderOptions());
    setCategoryOptions(generateCategoryOptions());
    setSubcategoryOptions(generateSubcategoryOptions());
  }, [props]);

  useEffect(() => {
    if (props.id && categoryToEdit) {
      populateExistingCategory();
    }
  }, [categoryToEdit, providerOptions, categoryOptions, subcategoryOptions]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleProvidersChange = (value) => {
    setProviders(value);
  };

  const handleChildrenChange = (value) => {
    setChildren(value);
  };

  const handleIconNameChange = (event) => {
    setIconName(event.target.value);
  };

  const handleIsSubcategoryChange = (value) => {
    setIsSubcategory(value);
  };

  const handleShowProvidersChange = (value) => {
    setShowProviders(value);
  };

  const openModal = () => {
    setModalIsDisplayed(true);
  };

  const closeModal = () => {
    setModalIsDisplayed(false);
    resetFlags();
    if (!props.id) clearState();
  };

  const doSubmit = async (event) => {
    event.preventDefault();

    const processMaybeArray = (maybeArray) => {
      if (maybeArray === null) return [];
      return Array.isArray(maybeArray)
        ? maybeArray.map((e) => e.value)
        : [maybeArray.value];
    };

    const postContent = {
      name: name,
      providers: processMaybeArray(providers), // this is NOT stored in plaintext, passport-local-mongoose hashes and salts it, and only then stores it
      children: processMaybeArray(children),
      icon_name: iconName !== '' ? iconName : 'null',
      is_subcategory: processMaybeArray(isSubcategory)[0],
    };

    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    const postURL =
      props.id !== undefined && props.id !== ''
        ? `/api/categories/update/${props.id}`
        : `/api/categories/create`;

    try {
      const res = await axios.post(postURL, postContent);
      if (res.data.success) {
        setHadError(false);
        setSuccess(true);
        await sleep(500);
        closeModal();
        props.refreshDataCallback();
      } else setHadError(true);
    } catch (err) {
      console.log(err);
      setHadError(true);
    }
  };

  const renderIconName = () => {
    return (
      <Row>
        <Col>
          <Form.Group controlId='formIconName'>
            <Form.Label>Icon Name</Form.Label>
            <Form.Control
              value={iconName}
              onChange={handleIconNameChange}
              placeholder='FontAwesome Icon Name'
            />
          </Form.Group>
        </Col>
        <Col sm='auto'>
          <Form.Label>Icon Preview</Form.Label>
          <i
            className={`fal fa-${iconName} fa-${3}x`}
            style={{
              margin: 'auto',
              display: 'block',
            }}
          ></i>
        </Col>
      </Row>
    );
  };

  const renderProviders = () => {
    const showProvidersForm = (
      <Form.Group>
        <Form.Label>Show Providers (False For Readability)</Form.Label>
        <Select
          isSearchable
          isClearable={false}
          value={showProviders}
          onChange={handleShowProvidersChange}
          options={boolOptions}
        />
      </Form.Group>
    );

    const providersEdit = (
      <Form.Group>
        <Form.Label>Providers</Form.Label>
        <Select
          isMulti
          isSearchable
          isClearable={false}
          value={providers}
          onChange={handleProvidersChange}
          options={providerOptions}
        />
      </Form.Group>
    );

    return (
      <>
        {!isSubcategory.value ? showProvidersForm : null}
        {showProviders.value || isSubcategory.value ? providersEdit : null}
      </>
    );
  };

  const renderChildren = () => {
    if (!isSubcategory.value) {
      return (
        <Form.Group>
          <Form.Label>Children</Form.Label>
          <Select
            isMulti
            isSearchable
            isClearable={false}
            value={children}
            onChange={handleChildrenChange}
            options={subcategoryOptions}
          />
        </Form.Group>
      );
    } else return null;
  };

  const renderStatus = () => {
    if (success && !hadError) {
      return (
        <Alert
          variant='success'
          style={{
            marginTop: '1em',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Successfully saved category.
        </Alert>
      );
    } else if (hadError) {
      return (
        <Alert
          variant='danger'
          style={{
            marginTop: '1em',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          An error has occurred. Please try again.
        </Alert>
      );
    } else return null;
  };

  const renderSubmitButton = () => {
    if (success)
      return (
        <Button onClick={doSubmit} variant='success' type='submit'>
          Success
        </Button>
      );
    else if (hadError) {
      return (
        <Button onClick={doSubmit} variant='warning' type='submit'>
          Try Again
        </Button>
      );
    } else
      return (
        <Button onClick={doSubmit} variant='primary' type='submit'>
          Submit
        </Button>
      );
  };

  return (
    <React.Fragment>
      <Button variant='primary' onClick={openModal} style={props.style}>
        {props.buttonName}
      </Button>
      <Modal show={modalIsDisplayed} onHide={closeModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>
            {props.id !== undefined && props.id !== ''
              ? `Edit ${name}`
              : 'Add Category'}

            {props.id !== undefined && props.id !== '' ? (
              <>
                <br />
                <h6 className='text-muted'>ID: {categoryToEdit._id}</h6>
              </>
            ) : null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderStatus()}
          <Form>
            <Form.Group controlId='formName'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={handleNameChange}
                placeholder='Name'
              />
            </Form.Group>

            {renderIconName()}

            <Form.Group>
              <Form.Label>Is Subcategory</Form.Label>
              <Select
                isSearchable
                isClearable={false}
                value={isSubcategory}
                onChange={handleIsSubcategoryChange}
                options={boolOptions}
              />
            </Form.Group>
            {renderChildren()}

            {renderProviders()}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeModal}>
            Close
          </Button>
          {renderSubmitButton()}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

CategoryEdit.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  buttonName: PropTypes.string.isRequired,
  refreshDataCallback: PropTypes.func.isRequired,
  providers: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
};

export default CategoryEdit;
