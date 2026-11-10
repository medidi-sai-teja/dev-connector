import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
// import Premium from "./components/Premium";
// import Chat from "./components/Chat";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";

function AppRoutes() {
  const user = useSelector((store) => store.user);

  return (
    <Routes>
      <Route path="/" element={<Body />}>
        <Route
          index
          element={
            user ? <Navigate to="/feed" replace /> : <Navigate to="/home" replace />
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/requests" element={<Requests />} />
          {/* <Route path="/premium" element={<Premium />} />
          <Route path="/chat/:targetUserId" element={<Chat />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
