import React, { useState, useEffect } from "react";
import moment from "moment-jalaali";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { ContentCalendar } from "../../components/contentCalender/ContentCalender";
import styles from "./Dashboard.module.css";
import profileImg from "../../assets/image/ProfilePicDefault.jpg";
import {jwtDecode} from "jwt-decode";
import { OldContent } from "../../components/OldContent/OldContent";
import { CollectionPage } from "../../components/Page/CollectionPage";

const Dashboard = () => {
  const [persianTime, setPersianTime] = useState("");
  // const [pageNames, setPageNames] = useState([]);
  const [selectedPage, setSelectedPage] = useState("oldTotalContent");
  const [username, setUsername] = useState("");

  // useEffect(() => {
  //   const fetchPageNames = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:8000/api/content/name-page/");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch page names");
  //       }
  //       const data = await response.json();
  //       setPageNames(data); // Assuming data is an array of objects with name and imageUrl
  //     } catch (error) {
  //       console.error("Error fetching page names:", error);
  //     }
  //   };

  //   fetchPageNames();

  //   const intervalId = setInterval(updateTime, 1000); // Update time every second

  //   return () => clearInterval(intervalId); // Cleanup interval on component unmount
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Log the token for debugging

    if (token && token.split('.').length === 3) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // Log the decoded token for debugging

        // If the token is a simple string like "admin", set username directly
        if (typeof decoded === "string") {
          setUsername(decoded);
        } else {
          setUsername(decoded.username || "کاربر");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setUsername("کاربر");
      }
    } else {
      // Handle case where token is not a JWT but a simple string
      setUsername(token || "کاربر");
    }
  }, []);

  const updateTime = () => {
    const currentTime = new Date();
    const timeAndDate = moment(currentTime).format("jYYYY/jMM/jDD HH:mm:ss");
    const formattedTime = digitsEnToFa(timeAndDate);
    setPersianTime(formattedTime);
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "oldTotalContent":
        return <OldContent />;
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
      <aside className="w-72 h-full bg-slate-50 rounded-2xl p-4 shadow-2xl">
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
                selectedPage === "oldTotalContent" ? "bg-blue-400 text-white" : "hover:bg-slate-200"
              }`}
              style={{ padding: "5px", borderRadius: "6px" }}
              onClick={() => setSelectedPage("oldTotalContent")}
            >
              <p>محتوا قدیمی</p>
            </div>
            <div
              className={`mt-3 w-full flex justify-start items-center gap-2 cursor-pointer ${
                selectedPage === "newTotalContent" ? "bg-blue-400 text-white" : "hover:bg-slate-200"
              }`}
              style={{ padding: "5px", borderRadius: "6px" }}
              onClick={() => setSelectedPage("newTotalContent")}
            >
              <p>محتوا جدید</p>
            </div>
          </div>

          <div className="w-full h-14 flex justify-start items-center gap-3">
            <img
              className="w-14 h-full rounded-full"
              src={profileImg}
              alt=""
              style={{ width: "54px", height: "54px" }}
            />
            <div>
              <p>{username}</p>
            </div>
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
