import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { Motion } from "framer-motion";

const Taskmanage = () => {
  const [username, setUsername] = useState("");
  const [isStaff, setIsStaff] = useState('');


  useEffect(() => {
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        if (authData && authData.username) {
          setUsername(authData.username);
        } else {
          setUsername("کاربر");
        }
      } catch (error) {
        console.error("Error parsing authData:", error);
        setUsername("کاربر");
      }
    } else {
      setUsername("کاربر");
    }
  }, []);
  useEffect(() => {
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      const authData = JSON.parse(authDataString);
      console.log(authData.is_staff)
      setIsStaff(authData && authData.access && authData.access.split(".").length === 3 && authData.is_staff);
    }
  }, []);

  return (
    <>
      <section className="h-screen bg-slate-100 p-4 flex flex-col justifu-center items-center">
        <header className="container h-auto p-3 flex justify-between items-center shadow-lg rounded-lg">
          <div className="flex justify-center items-center gap-4">
            <h2 className="text-xl">مدیریت تسک ها</h2>
            <Link className="hover:text-slate-600" to="/dashboard">
              داشبورد
            </Link>
          </div>
          <div className="flex justify-center items-center gap-2">
            <p>نام کاربری:</p>
            <p>{username}</p>
          </div>
        </header>

        {isStaff && (
          <div 
          className="fixed bg-red-600 w-20 h-20 rounded-full bottom-10 right-32 flex justify-center items-center hover:scale-110
          cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40"
              width="38"
              viewBox="0 0 448 512"
            >
              <path
                fill="#ffffff"
                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
              />
            </svg>
          </div>
        )}
      </section>
    </>
  );
};

export { Taskmanage };
