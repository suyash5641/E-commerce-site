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
import { IAttributes } from "../../../shared/interfaces/interface";

const BaseUrl = "";

interface IProps {
  username: string;
  email: string;
  password: string;
}

interface IUser {
  id: number;
  username: string;
  email: string;
  cart: Cart[];
}

interface Cart {
  quantitity: number;
  id: number;
  attributes: IAttributes;
}

interface ISignInProps {
  identifier: string;
  password: string;
}

interface AuthState {
  signIn: (payload: ISignInProps) => Promise<any>;
  fetchLoggedInUser: (token: string) => Promise<any>;
  signOut: () => void;
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
  }, []);

  useEffect(() => {
    if (authState.authToken === "loading") {
      return;
    }
    switch (authState.authToken) {
      case null:
        if ((location.pathname === "/cart")) {
          navigate("/");
        }
        break;
      default:
        // if (
        //     location.pathname === "/signin" ||
        //     location.pathname === "/signup" || location.pathname === "/"
        // ) {
        //     navigate("/dashboard");
        // }
        // const searchParams = new URLSearchParams(window.location.search);
        // if (searchParams.has("login")) {
        //   searchParams.delete("login");
        // } else if (searchParams.has("signup")) {
        //   searchParams.delete("signup");
        // }
        // navigate({ search: `?${searchParams.toString()}` });
        break;
    }
  }, [location, authState.authToken]);

  const signIn = useCallback(async (payload: ISignInProps) => {
    setIsLoading(true);
    const response = await fetch(`http://localhost:1337/api/auth/local`, {
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
  }, []);

  const register = useCallback(async (payload: IProps) => {
    setIsLoading(true);
    const response = await fetch(
      `http://localhost:1337/api/auth/local/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

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
  }, []);

  const fetchLoggedInUser = useCallback(
    async (token: string) => {
      // setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:1337/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await response.json();
        if (res?.id) {
          setAuthState({
            ...authState,
            authToken: token,
            user: res,
          });
          console.log("settt");
          return true;
        } else if (res.data === null) {
          setAuthState({
            ...authState,
            authToken: null,
            user: null,
          });
          localStorage.removeItem("authToken");
          return false;
        }
      } catch (error) {
        console.error(error);
      } finally {
        //   setIsLoading(false);
      }
    },
    [setAuthState, token]
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
      fetchLoggedInUser,
    }),
    [authState, signIn, signOut, register, loading, fetchLoggedInUser]
  );

  // console.log(authState?.user,"tes-buggg")
  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};
export { AuthContext, AuthContextProvider };

export const useAuth = () => useContext(AuthContext);
