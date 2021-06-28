import { AUTH_SIGN_UP, AUTH_SIGN_IN, AUTH_SIGN_OUT, AUTH_ERROR } from "./types";

const DEFAULT_STATE = {
  isAuthenticated: false,
  //   name: "",
    role: "",
  //   access_token: "",
  errorMessage: "",
  //   nokiaid: "",
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case AUTH_SIGN_UP:
      return {
        ...state,
        // access_token: action.payload,
        // name: action.payload_name,
        // email: action.payload_email,
        role: action.payload_role,
        // nokiaid: action.payload_nokiaid,
        isAuthenticated: true,
        errorMessage: "",
      };
    case AUTH_SIGN_IN:
      return {
        ...state,
        access_token: action.payload,
        username: action.payload_username,
        role: action.payload_role,
        streams_permissions: action.payload_streams_permissions,
        isAuthenticated: true,
        errorMessage: "",
      };
    case AUTH_SIGN_OUT:
      return {
        ...state,
        access_token: action.payload,
        username: action.payload_username,
        // email: action.payload_email,
        role: action.payload_role,
        // nokiaid: action.payload_nokiaid,
        isAuthenticated: false,
        errorMessage: "",
      };
    case AUTH_ERROR:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};
