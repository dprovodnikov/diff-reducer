import updateByPath from '@madappgang/update-by-path';

const split = delimeter => string => string.split(delimeter);
const includes = string => array => array.includes(string);

const createReducer = (initialState, reactions) => (state = initialState, action) => {
  if (!action) {
    return state;
  }

  const reaction = reactions[
    Object.keys(reactions)
      .map(split(','))
      .find(includes(action.type))
  ];

  if (!reaction) {
    return state;
  }

  return updateByPath(state, reaction(action, state));
};

export default createReducer;
