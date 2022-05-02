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

  function logout() {
    csrf()
      .then(() => {
        axiosLaravelAPI()
          .post("/logout")
          .then((res) => {
            if (res.status === 200) {
              setUser(null);
            } else {
              setUser(null);
            }
          });
      })
      .catch((error) => {
        setUser(null);
        throw error;
      });
  }

  function whoami() {
    axiosLaravelAPI()
      .get("/user/whoami")
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data);
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  function check() {
    axiosLaravelAPI()
      .get("/check")
      .then((res) => {
        if (res.status === 204) {
          whoami();
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        setUser(null);
      });
  }

  function changeOwnPassword(data: any) {
    axiosLaravelAPI()
      .post("/user/change_password", data)
      .then((res) => {
        return true;
      })
      .catch((error) => {
        throw error;
      });
  }

  const store = [
    user,
    {
      login,
      logout,
      whoami,
      check,
      changeOwnPassword,
    },
  ];

  return (
    <AuthContext.Provider value={store}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
