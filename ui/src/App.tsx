import "./App.css"

import { useState } from "react"
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import EventPage from "./pages/EventPage";
import SignUpPage from "./pages/SignUpPage";
import EventsPage from "./pages/EventsPage";
import NavigationBar from "./components/NavigationBar";
import { CurrentUserContext } from "./contexts/UserContext"
import { Route, Routes, HashRouter, Navigate } from "react-router-dom"
import { UserInfo } from "./types/datatypes";


function App() {

  const [userData, setUserData] = useState<UserInfo | null>(
    JSON.parse(sessionStorage.getItem("userData") || "{}")
  );

  interface ProtectedRouteProps {
    Element: React.FC;
    userData: UserInfo | null;
    isAdmin?: boolean;
    postLogin?: boolean;
  }

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({Element, userData, isAdmin, postLogin }) => {
    if (postLogin !== undefined && postLogin === true) {
      if (userData !== null) {
        return <Navigate to="/" replace />;
      }
      return <Element/>;
    } else {
      const isAdminUser = isAdmin || false;
      if (userData === null || (isAdminUser && userData.role !== "admin")) {
        return <Navigate to="/signUp" replace />;
      }
      return <Element/>;
    }
  };

  return (
    <>
    <CurrentUserContext.Provider value={{userData, setUserData}}>
    <HashRouter>
      <NavigationBar/>
      <Routes>
          <Route path="/admin" 
            element={
              <ProtectedRoute Element={AdminPage} userData={userData} isAdmin={true}/> }/>
          <Route path="/signUp" element={<ProtectedRoute Element={SignUpPage} userData={userData} postLogin={true}/>}/>
          <Route path="/" Component={EventsPage}/>
          <Route path="/:eventId" Component={EventPage}/>
          <Route path="/users/:userId" element={
            <ProtectedRoute Element={UserPage} userData={userData}/>
          }/>
      </Routes>

    </HashRouter>
    </CurrentUserContext.Provider>
    </>
  )
}

export default App
