import  {useContext} from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import {AppContent} from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

  const navigate = useNavigate();
  const {userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent)

  console.log("Navbar userData:", userData);


// log out
  const logout = async ()=> {
    try {
      axios.defaults.withCredentials = true ;
      const { data } = await axios.post(backendUrl + "/api/auth/logout")

      data.success && setIsLoggedin(false)
      data.success && setUserData(null)
      navigate('/')
    }
     catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }


// sending verification OTP 
const sendVerificationOtp = async () => {
  try {
    axios.defaults.withCredentials = true;
    if(!userData?._id){
      toast.error("user ID is missing .. please log in again.")
    }
    

    const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp",
    //include userId 
    {},
    {withCredentials: true}
    )

    if(data.success){
      navigate('/email-verify')
      toast.success(data.message)
    }
    else{
      toast.error(data.message)
    }
  } 
  catch (error) {
    
    toast.error(error.message); 
  }
};

  return (
    <div className =" w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">

        <img src={assets.logo} alt="" className='w-28 sm:w-32' />

      {/* if user data is available then it displays  */}
        {userData ? (
          <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group '>
          {userData?.name?.[0]?.toUpperCase()}
          
          {/*  */}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
          <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>

            {/*  */}
            { !userData?.isAccountVerified  
            /* userData && userData.isAccountVerified === false */
             && (
              <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>
              Verify email
              </li> )}

            <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10' >Logout</li>
          </ul>
          </div>
        </div>)
        : //else
        (<button  onClick= {() => navigate('/login')}className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-blue-400 transition-all '>Login
          <img src={assets.arrow_icon} alt="" />
        </button>
        )}
    </div>
  )
}

export default Navbar

// Navbar.jsx
// import React, { useContext } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import { AppContent } from "../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { userData, backendUrl } = useContext(AppContent);

//   const sendVerificationOtp = async () => {
//     if (!userData?._id) return; // safeguard
//     try {
//       const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
//         userId: userData._id,
//       });
//       if (data.success) {
//         navigate("/email-verify");
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error("Send verification OTP error:", error);
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
//       <img src={assets.logo} alt="" className="w-28 sm:w-32" />

//       {userData ? (
//         <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
//           {userData?.name?.[0]?.toUpperCase() || "U"}

//           <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
//             <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
//               {!userData?.isAccountVerified && (
//                 <li
//                   onClick={sendVerificationOtp}
//                   className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
//                 >
//                   Verify email
//                 </li>
//               )}
//               <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">
//                 Logout
//               </li>
//             </ul>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => navigate("/login")}
//           className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-blue-400 transition-all"
//         >
//           Login
//           <img src={assets.arrow_icon} alt="" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default Navbar;
