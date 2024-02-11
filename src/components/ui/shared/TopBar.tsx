import { Link,  useNavigate } from "react-router-dom";
import { Button } from "../button";

import { useSignoutAccount } from "@/lib/react-query/querie";
import { useEffect } from "react";
import { useUserContext } from "@/_auth/AuthContext";

const TopBar = () => {
    const naviagte=useNavigate();
    const {mutate :SignOut, isSuccess} =useSignoutAccount();
 const {user} =useUserContext();
    useEffect(() => {
        if (isSuccess) {
          naviagte(0);
        }
    },[isSuccess])
  return (
    <section className="topbar">
    <div className="flex-between py-4 px-5">
      <Link to="/" className="flex gap-3 items-center">
        <img
          src="/assets/images/LensLegacy.png"
          alt="logo"
          width={130}
          height={325}
        />
      </Link>

      <div className="flex gap-4">
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={() => SignOut()}>
          <img src="/assets/icons/logout.svg" alt="logout" />
        </Button>
        <Link to={`/profile/${user.id}`} className="flex-center gap-3">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-8 w-8 rounded-full object-cover "
          />
        </Link>
      </div>
    </div>
  </section>
  );
};

export default TopBar;
