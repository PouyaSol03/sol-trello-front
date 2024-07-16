import { useState, useEffect, useMemo } from "react";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import axios from "axios";

const ContentPage = ({ pageName }) => {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await axios.get(
          `https://apisoltrello.liara.run/api/content/page-content/`,
          {
            params: { name: pageName },
          }
        );
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContentData();
  }, [pageName]);

  return (
    <section className="w-full h-auto overflow-y-auto px-5">
      <div className="w-full h-full flex justify-center items-center mt-3">
        <div className="w-full h-auto flex justify-start items-center gap-4 bg-transparent rounded-full p-2">
          <div
            className="flex justify-center items-center rounded-lg"
            style={{
              background: "#161c40",
              width: "30px",
              height: "30px",
              color: "#fff",
            }}
          >
            <p className="text-xs">روز</p>
          </div>
          <div
            className="flex justify-center items-center rounded-full"
            style={{
              background: "#161c40",
              width: "300px",
              height: "40px",
              color: "#fff",
            }}
          >
            <p>محتوای اول</p>
          </div>
          <div
            className="flex justify-center items-center rounded-full"
            style={{
              background: "#161c40",
              width: "300px",
              height: "40px",
              color: "#fff",
            }}
          >
            <p>محتوای دوم</p>
          </div>
          <div
            className="flex justify-center items-center rounded-full"
            style={{
              background: "#161c40",
              width: "300px",
              height: "40px",
              color: "#fff",
            }}
          >
            <p>محتوای سوم</p>
          </div>
          <div
            className="flex justify-center items-center rounded-full"
            style={{
              background: "#161c40",
              width: "250px",
              height: "40px",
              color: "#fff",
            }}
          >
            <p>محتوای چهارم</p>
          </div>
          <div
            className="flex justify-center items-center rounded-full"
            style={{
              background: "#161c40",
              width: "250px",
              height: "40px",
              color: "#fff",
            }}
          >
            <p>محتوای پنجم</p>
          </div>
        </div>
      </div>
      <div className="w-full h-auto flex flex-col justify-center items-center gap-1">
        {content.map((item, index) => {
          return (
            <div
              key={index}
              className={`w-full h-auto flex justify-start items-center gap-4 rounded-full p-2 `}
            >
              <div
                className="flex justify-center items-center rounded-lg"
                style={{
                  background: "#161c40",
                  width: "30px",
                  height: "30px",
                  color: "#fff",
                }}
              >
                <p className="text-sm">{digitsEnToFa(item.day)}</p>
              </div>
              <div
                className="flex justify-center items-center rounded-full"
                style={{
                  background: item.bg_color_first,
                  width: "300px",
                  minHeight: "36px",
                  height: "auto",
                  color: "#fff",
                }}
              >
                <p className="text-sm">{digitsEnToFa(item.title_first_content)}</p>
              </div>
              <div
                className="flex justify-center items-center rounded-full"
                style={{
                  background: item.bg_color_seconde,
                  width: "300px",
                  minHeight: "36px",
                  height: "auto",
                  color: "#fff",
                }}
              >
                <p className="text-sm">{digitsEnToFa(item.title_seconde_content)}</p>
              </div>
              <div
                className="flex justify-center items-center rounded-full"
                style={{
                  background: item.bg_color_thired,
                  width: "300px",
                  minHeight: "36px",
                  height: "auto",
                  color: "#fff",
                }}
              >
                <p className="text-sm">{digitsEnToFa(item.title_three_content)}</p>
              </div>
              <div
                className="flex justify-center items-center rounded-full"
                style={{
                  background: item.bg_color_four,
                  width: "250px",
                  minHeight: "36px",
                  height: "auto",
                  color: "#fff",
                }}
              >
                <p className="text-sm">{digitsEnToFa(item.title_four_content)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export { ContentPage };
