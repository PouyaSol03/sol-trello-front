import { useState, useEffect } from "react";
import { ContentPage } from "../contentPage/ContentPage";

const Page = ({ pageName }) => {
  const [activeTab, setActiveTab] = useState("info"); // State to track active tab

  useEffect(() => {
    // Fetch data based on pageName and activeTab
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/content?name=${pageName}&tab=${activeTab}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }
        const data = await response.json();
        // Handle the data (e.g., set it to a state)
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchData();
  }, [pageName, activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className="flex flex-col justify-center items-center h-full p-3">
      <div className="w-full h-10 flex justify-center items-center gap-4">
        <button
          className={`w-28 h-full p-1 rounded-lg bg-slate-300 text-black ${
            activeTab === "info" ? "bg-slate-400" : ""
          }`}
          onClick={() => handleTabClick("info")}
        >
          اطلاعات
        </button>
        <button
          className={`w-28 h-full p-2 rounded-lg bg-slate-300 text-black ${
            activeTab === "content" ? "bg-slate-400" : ""
          }`}
          onClick={() => handleTabClick("content")}
        >
          برنامه محتوایی
        </button>
        <button
          className={`w-28 h-full p-2 rounded-lg bg-slate-300 text-black ${
            activeTab === "inventory" ? "bg-slate-400" : ""
          }`}
          onClick={() => handleTabClick("inventory")}
        >
          موجودی محتوا
        </button>
        <button
          className={`w-28 h-full p-1 rounded-lg bg-slate-300 text-black ${
            activeTab === "layout" ? "bg-slate-400" : ""
          }`}
          onClick={() => handleTabClick("layout")}
        >
          لی اوت
        </button>
      </div>
      <main className="w-full h-full">
        {/* Render content based on activeTab */}
        {activeTab === "info" && <InfoContent />}
        {activeTab === "content" && <ContentPage pageName={pageName}/>}
        {activeTab === "inventory" && <InventoryContent />}
        {activeTab === "layout" && <LayoutContent />}
      </main>
    </section>
  );
};

// Dummy components for illustration
const InfoContent = () => <h1>اطلاعات - Content</h1>;
const ContentCalendar = () => <h1>برنامه محتوایی - Content</h1>;
const InventoryContent = () => <h1>موجودی محتوا - Content</h1>;
const LayoutContent = () => <h1>لی اوت - Content</h1>;

export { Page };
