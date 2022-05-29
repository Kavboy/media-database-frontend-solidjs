import { createContext, createSignal, useContext } from "solid-js";
import { User } from "src/utils/interfaces.js";
import { axiosLaravelAPI, csrf } from "../apis/AxiosLaravel.js";

const AuthContext = createContext();

export function AuthProvider(props) {
  const [user, setUser] = createSignal<User>(props.user || null);

  async function login(username: string, password: string) {
    try {
      await csrf();
      const res = await axiosLaravelAPI().post("/login", {
        username,
        password,
      });

      if (res.status === 200) {
        setUser(res.data);
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      await csrf();
      const res = await axiosLaravelAPI().post("/logout");

      if (res.status === 200) {
        setUser(null);
        location.replace("");
      } else {
        setUser(null);
        location.replace("");
      }
    } catch (error) {
      setUser(null);
      location.replace("");
      throw error;
    }
  }

  async function whoami() {
    try {
      if (!user()) {
        const res = await axiosLaravelAPI().get("/user/whoami");

        if (res.status === 200) {
          setUser(res.data);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async function check() {
    try {
      if (!user()) {
        const res = await axiosLaravelAPI().get("/check");

        if (res.status === 204) {
          whoami();
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      setUser(null);
    }
  }

  async function changeOwnPassword(data: any) {
    try {
      await csrf();
      const res = await axiosLaravelAPI().post("/user/change_password", data);

      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  const requireAuth = async (roles = [], redirectUrl = "/") => {
    await check();
    if (user() === null) {
      location.replace(redirectUrl);
    } else if (
      user() !== null &&
      roles.length !== 0 &&
      !roles?.includes(user()?.role)
    ) {
      location.replace(redirectUrl);
    }
    return true;
  };

  const store = [
    user,
    {
      login,
      logout,
      whoami,
      check,
      changeOwnPassword,
      requireAuth,
    },
  ];

  return (
    <AuthContext.Provider value={store}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
