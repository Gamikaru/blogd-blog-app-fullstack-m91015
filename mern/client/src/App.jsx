import { Outlet, Navigate, useLocation} from "react-router-dom";
import Navbar from "./components/Navbar";
// import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";

const App = () => {
	// const [cookie, setCookie, removeCookie] = useCookies();
	// const location = useLocation();
	// const [hasToken, setHasToken] = useState(false);
  // useEffect(() => {
  //   const token = cookie.PassBloggs;
  //   if (token) {
  //     setHasToken(true);
  //   } else {
  //     setHasToken(false);
  //   }
  // }, [location.pathname]);

  // if (!hasToken && location.pathname!== "/") {
  //   return <Navigate to="/" replace />;
  // }
	return (
		<div className="w-full p-6">
			<Navbar />
			<Outlet />
		</div>
	);

};
export default App;
