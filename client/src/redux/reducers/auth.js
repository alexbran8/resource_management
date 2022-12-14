import { UPDATE_PROFILE, AUTH_SIGN_IN, AUTH_SIGN_OUT, AUTH_ERROR } from "./types";

const DEFAULT_STATE = {
  isAuthenticated: false,
  //   name: "",
    // role: "",
  //   access_token: "",
  errorMessage: "",
  //   nokiaid: "",
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case UPDATE_PROFILE:
      console.log('x', action.payload.role)
      return {
        ...state,
        access_token: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
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
        access_token: undefined,
        username: undefined,
        email: undefined,
        role: undefined,
        nokiaid: undefined,
        isAuthenticated: false,
        errorMessage: "",
      };
    case AUTH_ERROR:
      return { ...state, 
        isAuthenticated: false,
        user:undefined,
        access_token: undefined,
        useName:undefined,
        name: undefined,
        email:undefined,
        role: undefined,
        errorMessage: action.payload };
    default:
      return state;
  }
};
