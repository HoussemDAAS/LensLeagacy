import { getCurrentUser } from "@/lib/appwrite/api";
import { IContextType, IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Iniatal_user = {
  id: "",
  name: "",
  username: "",
  email: "",
  password: "",
  bio: "",
  imageUrl: "",
};

const Iniatal_State = {
  user: Iniatal_user,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAutherUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(Iniatal_State);
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(Iniatal_user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const checkAutherUser = async () => {
    try {
      const currentAccount = await getCurrentUser();
     if(currentAccount){
      setUser({
        id: currentAccount.$id,
        name: currentAccount.name,
        username: currentAccount.username,
        email: currentAccount.email,
        imageUrl: currentAccount.imageUrl,
        bio: currentAccount.bio
    })
      setIsAuthenticated(true);
      return true;
     }
     return false
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
  const pathname = window.location.pathname;
  const isVerificationPage = pathname.includes("/verifemail");

  // If not on the verification page, check authentication
  if (!isVerificationPage) {
    if (
      localStorage.getItem("cookieFallback") === null ||
      localStorage.getItem("cookieFallback") === "[]"
    ) {
      navigate("/sign-in");
    } else {
      checkAutherUser();
    }
  }
}, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    checkAutherUser,
  };
  return (
    <div>
      <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);