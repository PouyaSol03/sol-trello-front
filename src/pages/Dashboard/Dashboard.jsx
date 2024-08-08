import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContentCalendar } from "../../components/contentCalender/ContentCalender";
import styles from "./Dashboard.module.css";
import profileImg from "../../assets/image/ProfilePicDefault.jpg";
import { OldContent } from "../../components/OldContent/OldContent";
// import { Taskmanage } from "../task/Taskmanage";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState("newTotalContent");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

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
    console.log("Username state updated:", username); // Log the username for debugging
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("authData");
    navigate("/", { replace: true });
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "newTotalContent":
        return <ContentCalendar />;
      default:
        return <OldContent />;
    }
  };

  return (
    <section
      className={`w-screen h-screen font-sans p-4 bg-sky-800 text-slate-500 flex justify-center items-center gap-x-4 ${styles.dashboard}`}
      style={{ fontFamily: "iransans" }}
    >
      <aside className="w-72 h-full bg-slate-50 rounded-2xl p-4 shadow-2xl flex flex-col justify-between">
        <div className="relative w-full h-full flex flex-col justify-start items-center gap-2">
          <div className="w-full">
            <h2 className="w-full text-black font-bold text-center" style={{ fontSize: "20px" }}>
              داشبورد
            </h2>
            <hr className="w-full mt-2" />
          </div>
          <div className="w-full h-full flex flex-col justify-start items-center gap-1">
            <div
              className={`mt-3 w-full flex justify-start items-center gap-2 cursor-pointer ${
                selectedPage === "newTotalContent" ? "bg-blue-400 text-white" : "hover:bg-slate-200"
              }`}
              style={{ padding: "5px", borderRadius: "6px" }}
              onClick={() => setSelectedPage("newTotalContent")}
            >
              <p>محتوا جدید</p>
            </div>
            <Link
              className={`mt-3 w-full flex justify-start items-center gap-2 cursor-pointer hover:bg-slate-200`}
              style={{ padding: "5px", borderRadius: "6px" }}
              // onClick={() => setSelectedPage("taskmanagement")}
              to='/task-management'
            >
              <p>مدیریت تسک ها</p>
            </Link>
          </div>
        </div>
        <div className="w-full h-14 flex justify-around items-center gap-2">
          <div className="w-1/3">
          <img
            className="rounded-full"
            src={profileImg}
            alt=""
            style={{ width: "54px", height: "54px" }}
          />
          </div>
          <div className="w-full flex justify-between items-center">
            <p>{username}</p>
            <button 
            onClick={handleLogout}
            className="">خروج</button>
          </div>
        </div>
      </aside>
      <main className="w-full h-full bg-slate-50 rounded-2xl p-1 shadow-2xl">
        <div className="h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </section>
  );
};

export { Dashboard };
