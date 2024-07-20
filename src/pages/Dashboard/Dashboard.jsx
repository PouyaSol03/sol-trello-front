import React, { useState, useEffect } from "react";
import moment from "moment-jalaali";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { ContentCalendar } from "../../components/contentCalender/ContentCalender";
import styles from "./Dashboard.module.css";
import profileImg from "../../assets/image/ProfilePicDefault.jpg";
import {jwtDecode} from "jwt-decode";

const Dashboard = () => {
  const [persianTime, setPersianTime] = useState("");
  const [pageNames, setPageNames] = useState([]);
  const [selectedPage, setSelectedPage] = useState("contentCalender");
  const [username, setUsername] = useState("کاربر");

  useEffect(() => {
    const fetchPageNames = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/content/name-page/");
        if (!response.ok) {
          throw new Error("Failed to fetch page names");
        }
        const data = await response.json();
        setPageNames(data); // Assuming data is an array of objects with name and imageUrl
      } catch (error) {
        console.error("Error fetching page names:", error);
      }
    };

    fetchPageNames();

    const intervalId = setInterval(updateTime, 1000); // Update time every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token.split('.').length === 3) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "کاربر");
      } catch (error) {
        console.error("Invalid token:", error);
        setUsername("کاربر");
      }
    }
  }, []);

  const updateTime = () => {
    const currentTime = new Date();
    const timeAndDate = moment(currentTime).format("jYYYY/jMM/jDD HH:mm:ss");
    const formattedTime = digitsEnToFa(timeAndDate);
    setPersianTime(formattedTime);
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
              className="mt-3 w-full flex justify-start items-center gap-2 hover:bg-slate-200 cursor-pointer"
              style={{ padding: "5px", borderRadius: "6px" }}
              onClick={() => setSelectedPage("contentCalender")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14" fill="none">
                <g clipPath="url(#clip0_1222_37349)">
                  <path d="M0.5 1H5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0.5 4H5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0.5 7H5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0.5 13H13.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0.5 10H13.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    d="M8 7H13C13.2761 7 13.5 6.77614 13.5 6.5V1.5C13.5 1.22386 13.2761 1 13 1H8C7.72386 1 7.5 1.22386 7.5 1.5V6.5C7.5 6.77614 7.72386 7 8 7Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1222_37349">
                    <rect width="14" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p>برنامه محتوایی کل</p>
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
        {/* <div className="w-full h-16 flex justify-start items-center px-4">
          <div className="w-1/4 dropdown">
            <div className="w-40 flex items-center justify-center bg-slate-400 rounded-lg">
              <select className="w-full h-10 rounded-lg outline-none ">
                {pageNames.map((page) => (
                  <option key={page.name} value={page.name}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div> */}
        <div className="h-full overflow-y-auto">
          <ContentCalendar />
        </div>
      </main>
    </section>
  );
};

export { Dashboard };
