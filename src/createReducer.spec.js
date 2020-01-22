import createReducer from './createReducer';

describe('createReducer()', () => {
  it('should be callable', () => {
    expect(createReducer).toBeInstanceOf(Function);
  });

  it('should return a function', () => {
    expect(createReducer({}, {})).toBeInstanceOf(Function);
  });

  it('returns initial state for initial action', () => {
    const initialState = {
      foo: 'bar',
    };
    const reducer = createReducer(initialState, {});

    expect(reducer(undefined, null)).toBe(initialState);
  });

  it('should pass state as a second param to reaction', () => {
    const actionType = 'SET_FOO';
    const reaction = jest.fn().mockReturnValue({});
    const initialState = {
      foo: 'bar',
    };
    const reducer = createReducer(initialState, {
      [actionType]: reaction,
    });

    reducer(undefined, { type: actionType });

    expect(reaction.mock.calls[0][1]).toBe(initialState);
  });

  it('returns initial state for initial action', () => {
    const initialState = {
      foo: 'bar',
    };
    const reducer = createReducer(initialState, {});

    expect(reducer(undefined, null)).toBe(initialState);
  });

  it('calls the right handler for action from config', () => {
    const actionType = 'SET_FOO';
    const initialState = {
      foo: 'bar',
    };
    const handleSetFoo = jest.fn().mockReturnValue({});
    const reducer = createReducer(initialState, {
      [actionType]: handleSetFoo,
    });

    reducer(initialState, { type: actionType });
    expect(handleSetFoo).toBeCalled();
  });

  it('calls the right handler for action from config', () => {
    const actionType = 'SET_FOO';
    const initialState = {
      foo: 'bar',
    };

    const handleSetFoo = jest.fn(() => ({}));

    const reducer = createReducer(initialState, {
      [actionType]: handleSetFoo,
    });

    reducer(undefined, { type: actionType });
    expect(handleSetFoo).toBeCalled();
  });

  it('returns state generated buy case handler from config', () => {
    const initialState = {
      foo: 'bar',
      bar: 'baz',
    };
    const handleSetFoo = ({ meta, payload }) => ({
      [meta.key]: payload,
    });
    const action = {
      type: 'SET_FOO',
      payload: 'Hello, world!',
      meta: { key: 'foo' },
    };
    const reducer = createReducer(initialState, {
      [action.type]: handleSetFoo,
    });
    const output = reducer(initialState, action);

    expect(output).toEqual({
      foo: 'Hello, world!',
      bar: 'baz',
    });
  });

  it('returns state intact if no handlers match the specified action', () => {
    const initialState = {
      foo: 'bar',
      bar: 'baz',
    };
    const firstAction = { type: 'SET_FOO' };
    const secondAction = { type: 'SET_BAR' };

    const reducer = createReducer(initialState, {
      [firstAction.type]: () => ({
        bar: value => value.concat('qux'),
      }),
    });

    const firstActionResult = reducer(undefined, firstAction);
    const secondActionResult = reducer(firstActionResult, secondAction);

    expect(secondActionResult).toEqual({
      foo: 'bar',
      bar: 'bazqux',
    });
  });

  it('allows to hang a handler for multiple actions at once', () => {
    const SET_FOO = 'SET:FOO';
    const SET_BAR = 'SET:BAR';
    const handler = jest.fn().mockReturnValue({});

    const reducer = createReducer({}, {
      [[
        SET_FOO,
        SET_BAR,
      ]]: handler,
    });

    reducer(undefined, { type: SET_BAR });
    reducer(undefined, { type: SET_FOO });

    expect(handler).toBeCalledTimes(2);
  });
});