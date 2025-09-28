import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContent } from "./AppContext";



export const AppContextProvider = (props) => {

  // Axios forces the browser to send cookies (and other credentials) along with the request.
  axios.defaults.withCredentials = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const[isLoggedin, setIsLoggedin] = useState(false)
    const[userData, setUserData] = useState(null)    


    // get user authenticated state
    const getAuthState = async () =>{
      try{
        //  api point to get if there is auth state for the user 
         const {data} = await axios.get(backendUrl + '/api/auth/is-auth', 
          {withCredentials: true}
         )
         if(data.success){
          
          setIsLoggedin(true);
          getUserData();
         }
      }catch(error){
        toast.error(error.message)
      } 
    }

    // whenever the page get loaded
    useEffect(() => {
      getAuthState();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[] )
  

    // get user data `
      const getUserData = async() => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData || {}) : toast.error( data.message)

            console.log("userData:",data.userData);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
      };

    const value = {
       
      backendUrl, 
      isLoggedin, setIsLoggedin,
      userData, setUserData,
      getUserData, 
    }
  

    return(
        <AppContent.Provider value= {value}>
            {props.children}
        </AppContent.Provider>
    );
  };

// AppContextProvider.jsx
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { AppContent } from "./AppContext";

// export const AppContextProvider = (props) => {
//   axios.defaults.withCredentials = true;

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [isLoggedin, setIsLoggedin] = useState(false);
//   const [userData, setUserData] = useState(null); // null initially

//   const getAuthState = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
//       if (data.success) {
//         setIsLoggedin(true);
//         getUserData();
//       }
//     } catch (error) {
//       console.error("Auth state error:", error);
//       toast.error(error.message);
//     }
//   };

//   const getUserData = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/user/data`);
//       if (data.success && data.userData) {
//         setUserData(data.userData);
//       } else {
//         toast.error(data.message || "Failed to load user data");
//       }
//     } catch (error) {
//       console.error("Get user data error:", error);
//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   useEffect(() => {
//     getAuthState();
//   }, 
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   []);

//   const value = {
//     backendUrl,
//     isLoggedin,
//     setIsLoggedin,
//     userData,
//     setUserData,
//     getUserData,
//   };

//   return (
//     <AppContent.Provider value={value}>
//       {props.children}
//     </AppContent.Provider>
//   );
// };
