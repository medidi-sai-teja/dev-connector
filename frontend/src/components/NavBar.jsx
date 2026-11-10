import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      // Navigate first to exit protected routes, then clear user state
      navigate("/home", { replace: true });
      setTimeout(() => {
        dispatch(removeUser());
      }, 100);
    }
  };

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-xl bg-gradient-to-r from-gray-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent font-bold flex items-center gap-2"
        >
          <img
            src="/devConnector Logo.png"
            alt="DevConnector Logo"
            className="h-8 w-18"
          />
          DevConnector
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="form-control">👋 Welcome, {user.name}</div>
          <div className="dropdown dropdown-end mx-5 flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="user photo" src={user.profilePictureURL} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>

              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <Link to="/feed">Feed</Link>
              </li>
              {/* <li>
                <Link to="/premium">Premium</Link>
              </li> */}
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
      {!user &&
        (location.pathname === "/home" || location.pathname === "/") && (
          <div className="flex-none gap-2">
            <Link to="/login" className="btn btn-outline btn-sm border-primary text-primary px-4 flex items-center gap-2 transform transition duration-300 ease-in-out hover:scale-105 hover:brightness-110">
              Login
            </Link>
          </div>
        )}
    </div>
  );
};
export default NavBar;
