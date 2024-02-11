import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const EditButton = ({ id }: any) => {
  return (
    <Link to={`/update-profile/${id}`} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-dark-4 ">
      <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
      <p className="small-medium text-light-2">Edit Profile</p>
    </Link>
  );
};

export default EditButton;
