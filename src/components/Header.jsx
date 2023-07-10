import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logoutUser } = useAuth();
  return (
    <div className="flex items-center py-8 justify-between px-4">
      <Link to="/">
        <strong className="text-4xl text-white">@</strong>
      </Link>

      {user ? (
        <div className="flex items-center justify-center gap-4">
          <Link to={`/profile/${user.profile.username}`}>
            <img
              className="h-6 w-6 object-cover rounded-full"
              src={user.profile.profile_pic}
            />
          </Link>

          <p>Hello {user.name}!</p>
          <button
            onClick={logoutUser}
            className="bg-white text-black text-xs py-1 px-2 border text-sm border-black rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-white text-black py-2 px-4 border text-sm border-black rounded"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default Header;
