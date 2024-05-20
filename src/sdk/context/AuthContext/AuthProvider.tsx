// import { BaseUrl } from "@/constant";
import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
  useReducer,
  useEffect,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IUser } from "../../../shared/interfaces/interface";
import { BASE_URL } from "../../../utils/constant/constant";

interface IProps {
  username: string;
  email: string;
  password: string;
}

// interface IUser {
//   id: number;
//   username: string;
//   email: string;
//   cart: Cart[];
//   discountPrice: number;
//   cartActualPrice: number;
//   cartTotalPrice: number;
// }

// interface Cart {
//   quantity: number;
//   id: number;
//   attributes: IAttributes;
// }

interface ISignInProps {
  identifier: string;
  password: string;
}

interface IForgotPassword {
  email: string;
}

interface IResetPassword {
  code: string;
  password: string;
  passwordConfirmation: string;
}

interface AuthState {
  signIn: (payload: ISignInProps) => Promise<any>;
  fetchLoggedInUser: (token: string) => Promise<any>;
  signOut: () => void;
  forgotPassword: (payload: IForgotPassword) => Promise<any>;
  resetPassword: (payload: IResetPassword) => Promise<any>;
  authFetch: (...arg: any) => Promise<any>;
  register: (payload: IProps) => Promise<any>;
  authToken: null | string;
  loading: Boolean;
  user: IUser | null;
}

const initialState: AuthState = {
  signIn: (payload: ISignInProps) => Promise.resolve(null),
  fetchLoggedInUser: (token: string) => Promise.resolve(null),
  signOut: () => {},
  forgotPassword: (payload: IForgotPassword) => Promise.resolve(null),
  resetPassword: (payload: IResetPassword) => Promise.resolve(null),
  authFetch: (...arg: any) => Promise.resolve(null),
  register: (payload: IProps) => Promise.resolve(null),
  authToken: "loading",
  loading: false,
  user: null,
};

const AuthContext = createContext<AuthState>(initialState);

const reducer = (
  state: AuthState,
  action: Partial<AuthState> | ((prevState: AuthState) => AuthState)
) => {
  return {
    ...state,
    ...action,
  };
};

const AuthContextProvider = ({ children }: any) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [authState, setAuthState] = useReducer(reducer, initialState);

  const [loading, setIsLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  const protectedRoutes = ["/cart", "/orders", "/buyproduct", "/payment"];
  // const routes = [
  //   "/cart",
  //   "/orders",
  //   "/productlist",
  //   "/product",
  //   "/buyproduct",
  //   "/payment",
  // ];

  useEffect(() => {
    try {
      if (token) {
        // fetchLoggedInUser();
      } else {
        setAuthState({
          ...authState,
          authToken: null,
          user: null,
        });
      }
    } catch (e) {
      setAuthState({
        ...authState,
        authToken: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (authState.authToken === "loading") {
      return;
    }
    switch (authState.authToken) {
      case null:
        if (protectedRoutes.includes(location.pathname)) {
          navigate("/");
        }
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, authState.authToken]);

  const signIn = useCallback(async (payload: ISignInProps) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data?.error) {
        setIsLoading(false);
        throw data?.error?.message;
      } else {
        setIsLoading(false);
        setAuthState({
          ...authState,
          authToken: data.jwt,
          user: data.user,
        });
        localStorage.setItem("authToken", data?.jwt);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      // eslint-disable-next-line no-throw-literal
      throw "Some Error Occurred";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(async (payload: IProps) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data?.error) {
        setIsLoading(false);
        throw data?.error?.message;
      } else {
        setIsLoading(false);
        setAuthState({
          ...authState,
          authToken: data.jwt,
          user: data.user,
        });
        localStorage.setItem("authToken", data?.jwt);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      // eslint-disable-next-line no-throw-literal
      throw "Some Error Occurred";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLoggedInUser = useCallback(
    async (token: string) => {
      // setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await response.json();
        if (res?.id) {
          setAuthState({
            ...authState,
            authToken: token,
            user: res,
          });
          return res?.id;
        } else if (res.data === null) {
          setAuthState({
            ...authState,
            authToken: null,
            user: null,
          });
          localStorage.removeItem("authToken");
          return "";
        }
      } catch (error) {
        // eslint-disable-next-line no-throw-literal
        throw "Some Error Occurred";
      } finally {
        //   setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setAuthState, token]
  );

  const forgotPassword = useCallback(
    async (payload: IForgotPassword) => {
      setIsLoading(true);

      const response = await fetch(
        `${BASE_URL}/users?filters[$and][0][email][$eq]=${payload?.email}`
      );

      const data = await response.json();
      if (data.length > 0) {
        const apiResponse = await fetch(`${BASE_URL}/api/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (apiResponse.status === 200) {
          setIsLoading(false);
          return `Reset password otp send to ${payload?.email}`;
        } else if (apiResponse.status === 400 || apiResponse.status === 500) {
          setIsLoading(false);
          throw Error("error occured");
        }
      } else {
        setIsLoading(false);
        throw Error("Email is not registered");
      }
    },
    [setIsLoading]
  );

  const resetPassword = useCallback(
    async (payload: IResetPassword) => {
      setIsLoading(true);
      const apiResponse = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (apiResponse.status === 200) {
        setIsLoading(false);
        return `Password changed succesfully , you can login using new password`;
      } else if (apiResponse.status === 400 || apiResponse.status === 500) {
        const res = await apiResponse.json();
        setIsLoading(false);
        throw res?.error?.message;
      }
    },
    [setIsLoading]
  );

  const signOut = useCallback(() => {
    // setLoading(true);
    localStorage.removeItem("authToken");
    setAuthState({
      ...authState,
      authToken: null,
      user: null,
    });
    // setLoading(false);
  }, [authState]);

  const value = useMemo(
    () => ({
      ...authState,
      signIn,
      signOut,
      register,
      loading,
      forgotPassword,
      fetchLoggedInUser,
      resetPassword,
    }),
    [
      authState,
      signIn,
      signOut,
      register,
      loading,
      forgotPassword,
      fetchLoggedInUser,
      resetPassword,
    ]
  );

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};
export { AuthContext, AuthContextProvider };

export const useAuth = () => useContext(AuthContext);
