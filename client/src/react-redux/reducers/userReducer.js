const initialState = {
  user: null,
  ready: false,
};

const userReducer = (state = initialState, action) => {
  console.log("state in user reducer: ", state);
  switch (action.type) {
    case "CHECK_USER":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
