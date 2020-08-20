const getAddedRemoved = (newValues, oldValues) => {
  const newValuesSet = new Set(newValues);
  const oldValuesSet = new Set(oldValues);
  const addedValues = [];
  const removedValues = [];
  newValues.forEach((value) => {
    if (!oldValuesSet.has(value)) {
      addedValues.push(value);
    }
  });
  oldValues.forEach((value) => {
    if (!newValuesSet.has(value)) {
      removedValues.push(value);
    }
  });
  return { addedValues, removedValues };
};

module.exports = { getAddedRemoved };
