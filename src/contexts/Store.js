import { createContext } from "react";

export const initialState = {
  userData: {
    firstName: '',
    lastName: '',
    email: '',
    postCount: 0,
    registered: false
  }
}

export const Context = createContext()