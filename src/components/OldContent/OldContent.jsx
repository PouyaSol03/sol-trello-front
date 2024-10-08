import { useState, useEffect, useMemo } from "react";
// import { digitsEnToFa } from "@persian-tools/persian-tools";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { jwtDecode } from "jwt-decode";

const foodCollections = [
  {
    id: 1,
    name: "گرویتی",
    asDay: 1,
  },
  {
    id: 2,
    name: "سعیدی",
    asDay: 7,
  },
  {
    id: 3,
    name: "آرش",
    asDay: 15,
  },
  {
    id: 4,
    name: "فلاورز",
    asDay: 15,
  },
  {
    id: 5,
    name: "سوخاریس",
    asDay: 11,
  },
  {
    id: 6,
    name: "کوچینی",
    asDay: 8,
  },
  {
    id: 7,
    name: "کافه یو",
    asDay: 12,
  },
  {
    id: 8,
    name: "دییر",
    asDay: 1,
  },
  {
    id: 9,
    name: "چه جگری",
    asDay: 21,
  },
  {
    id: 10,
    name: "سالار",
    asDay: 22,
  },
];

const companyCollections = [
  {
    id: 1,
    name: "کوه‌سر",
    asDay: 13,
  },
  {
    id: 2,
    name: "سرای حمید",
    asDay: 2,
  },
  {
    id: 3,
    name: "نارمک",
    asDay: 13,
  },
  {
    id: 4,
    name: "شهرما",
    asDay: 4,
  },
  {
    id: 5,
    name: "بونیتو",
    asDay: 6,
  },
  {
    id: 6,
    name: "چای احمد",
    asDay: 17,
  },
  {
    id: 7,
    name: "راشسا",
    asDay: 20,
  },
];


const OldContent = () => {
  const [calenderData, setCalenderData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [user, setUser] = useState(false);
  // Get the current day of the month
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  // Reference day (e.g., the day the code was written)
  const referenceDate = new Date("2024-07-06"); // Replace with your reference date
  const referenceDay = referenceDate.getDate();
  // Calculate the difference in days
  const dayDifference = (currentDay - referenceDay + 26) % 26; // Ensure non-negative and wrap around 26 days


  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://apisoltrello.liara.run/api/content/fixed-content/"
      );
      const result = await res.json();
      result.sort((a, b) => a.day - b.day);

      setCalenderData(result);
    }
    fetchData();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isStaff = localStorage.getItem("is_staff");

    if (token && token.split(".").length === 3) {
        try {
            setUser(isStaff === "true"); // Ensure this is a boolean
        } catch (error) {
            console.error("Invalid token:", error);
            setUser(false);
        }
    } else {
        setUser(false);
    }
  }, []);
  const openModal = (modalId) => {
    document.getElementById(modalId).showModal();
  };
  const handleEdit = (id, field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
      },
    }));
    console.log(`Editing ${field} for entry ${id} with value: ${value}`);
  };
  const handleSave = async (id) => {
    const updatedEntry = editedData[id];
    if (updatedEntry) {
      try {
        const response = await fetch(
          `https://apisoltrello.liara.run/api/content/fixed-content/${id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEntry),
          }
        );

        if (response.ok) {
          setCalenderData((prev) =>
            prev.map((entry) =>
              entry.id === id ? { ...entry, ...updatedEntry } : entry
            )
          );
        } else {
          console.error("Failed to save data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  // Create a mapping of days to collection names
  const dayToCollectionNames = useMemo(() => {
    const mapping = { food: {}, company: {}, both: {} };

    const addToMapping = (collections, type) => {
      collections.forEach((collection) => {
        // Calculate the new day based on the day difference
        const adjustedDay = ((collection.asDay + dayDifference - 1) % 26) + 1; // Ensure 1-based day within 26 days
        if (!mapping[type][adjustedDay]) {
          mapping[type][adjustedDay] = [];
        }
        mapping[type][adjustedDay].push(collection.name);
      });
    };

    addToMapping(foodCollections, "food");
    addToMapping(companyCollections, "company");

    // Find overlaps
    Object.keys(mapping.food).forEach((day) => {
      if (mapping.company[day]) {
        mapping.both[day] = {
          food: mapping.food[day],
          company: mapping.company[day],
        };
        delete mapping.food[day];
        delete mapping.company[day];
      }
    });

    return mapping;
  }, [dayDifference]);

  // if (!calenderData.length) return <p>Loading...</p>;

  return (
    <>
      <section className="w-full h-auto overflow-y-auto overflow-x-auto px-5">
        <div className="w-full h-full flex justify-center items-center mt-4">
          <div className="w-auto h-auto flex justify-start items-center gap-3 bg-transparent py-2 overflow-x-auto px-1">
            <div
              className="flex justify-center items-center w-48"
              style={{
                background: "transparent",
                padding: "8px",
                // width: "200px",
                minHeight: "40px",
                height: "auto",
                borderRadius: "10px",
                color: "#fff",
                opacity: ".5",
              }}
            >
              <p className="w-auto text-xs"></p>
            </div>
            <div
              className="flex justify-center items-center rounded-lg w-12 h-10 hidden"
              style={{
                background: "#161c40",
                // width: "30px",
                // height: "30px",
                color: "#fff",
              }}
            >
              <p className="text-xs">روز</p>
            </div>
            <div
              className="flex justify-center items-center rounded-lg w-68 h-10"
              style={{
                background: "#161c40",
                // width: "300px",
                // height: "40px",
                color: "#fff",
              }}
            >
              <p>محتوای اول</p>
            </div>
            <div
              className="flex justify-center items-center rounded-lg w-68 h-10"
              style={{
                background: "#161c40",
                // width: "300px",
                // height: "40px",
                color: "#fff",
              }}
            >
              <p>محتوای دوم</p>
            </div>
            <div
              className="flex justify-center items-center rounded-lg w-68 h-10"
              style={{
                background: "#161c40",
                // width: "300px",
                // height: "40px",
                color: "#fff",
              }}
            >
              <p>محتوای سوم</p>
            </div>
            <div
              className="flex justify-center items-center rounded-lg w-68 h-10"
              style={{
                background: "#161c40",
                // width: "250px",
                // height: "40px",
                color: "#fff",
              }}
            >
              <p>محتوای چهارم</p>
            </div>
            <div
              className="flex justify-center items-center rounded-lg w-68 h-10"
              style={{
                background: "#161c40",
                // width: "250px",
                // height: "40px",
                color: "#fff",
              }}
            >
              <p>محتوای پنجم</p>
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-center mt-2 gap-1">
          {calenderData.map((entry) => {
            const isFoodDay = dayToCollectionNames.food[entry.day];
            const isCompanyDay = dayToCollectionNames.company[entry.day];
            const isBothDay = dayToCollectionNames.both[entry.day];

            return (
              <div
                key={entry.id}
                className={`w-full h-auto flex justify-start items-center gap-3 rounded-lg px-1 py-2 ${
                  isBothDay
                    ? "bg-green-300"
                    : isFoodDay
                    ? "shadow-[inset_0px_0px_20px_1px_#00000024]"
                    : isCompanyDay
                    ? "shadow-[inset_0px_0px_20px_1px_#00000024]"
                    : "hidden"
                }`}
              >
                <div className="flex justify-center items-center w-48 h-10 p-2 text-white rounded-lg"
                style={{
                  background: '#161c40',
                }}
                >
                  <p
                    className="w-auto text-white"
                    style={{
                      fontFamily: "iransans-black",
                      fontSize: "14px",
                    }}
                  >
                    {isBothDay
                      ? `${dayToCollectionNames.both[entry.day].food.join(
                          " و "
                        )} و ${dayToCollectionNames.both[
                          entry.day
                        ].company.join(" و ")}`
                      : isFoodDay
                      ? dayToCollectionNames.food[entry.day].join(" و ")
                      : isCompanyDay
                      ? dayToCollectionNames.company[entry.day].join(" و ")
                      : ""}
                  </p>
                </div>
                <div
                  className="flex justify-center items-center rounded-lg w-12 h-10 text-white hidden"
                  style={{
                    background: "#161c40",
                  }}
                >
                  <p className="text-sm">{entry.day}</p>
                </div>
                <div
                  className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
                  style={{
                    background: entry.first_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_first`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-white text-xs">
                    {entry.first_story}
                  </p>
                </div>
                {/* Modal for this entry */}
                <dialog id={`modal_${entry.id}_first`} className="modal">
                  <div className="w-1/3 h-auto flex flex-col justify-start items-start gap-2 px-2 py-3 bg-white rounded-lg">
                    <div className="w-full flex justify-between items-center px-2 py-1">
                      <p
                        className="text-md font-semibold text-neutral-800"
                        style={{ fontFamily: "iransans-bold" }}
                      >
                        ویرایش محتوا
                      </p>
                      <button
                        className="flex justify-center items-center w-8 h-8 rounded-full bg-neutral-200 shadow-lg"
                        onClick={() =>
                          document
                            .getElementById(`modal_${entry.id}_first`)
                            .close()
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        عنوان:
                      </p>
                      {user ? (
                        <EditText
                          name={entry.first_story}
                          defaultValue={entry.first_story}
                          onSave={({ value }) =>
                            handleEdit(entry.id, "first_story", value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-black">
                          {entry.first_story}
                        </p>
                      )}
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        توضیحات:
                      </p>
                      {user ? (
                        <EditTextarea
                          name={entry.first_explanation}
                          defaultValue={entry.first_explanation}
                          onSave={({ value }) =>
                            handleEdit(entry.id, "first_explanation", value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-black">
                          {entry.first_explanation}
                        </p>
                      )}
                    </div>
                    {user && (
                      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                        <p
                          className="text-md font-semibold text-neutral-600"
                          style={{ fontFamily: "iransans" }}
                        >
                          رنگ پس‌زمینه:
                        </p>
                        <EditText
                          name={entry.first_color}
                          defaultValue={entry.first_color}
                          onSave={({ value }) =>
                            handleEdit(entry.id, "first_color", value)
                          }
                        />
                      </div>
                    )}
                    {user && (
                      <div className="w-full flex justify-center items-center px-2 py-2 gap-3">
                        <button
                          className="flex justify-center items-center w-auto h-10 px-6 bg-rose-400 hover:bg-rose-500 rounded-md text-white text-sm"
                          style={{ fontFamily: "iransans" }}
                          onClick={() => {
                            handleSave(entry.id);
                            document
                              .getElementById(`modal_${entry.id}_first`)
                              .close();
                          }}
                        >
                          ذخیره
                        </button>
                      </div>
                    )}
                  </div>
                </dialog>
                <div
                  className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
                  style={{
                    background: entry.second_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_second`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-white text-xs">
                    <svg
                      className="absolute left-2 w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#ffffff"
                        d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                      />
                    </svg>
                    {entry.second_story}
                  </p>
                </div>
                <dialog id={`modal_${entry.id}_second`} className="modal">
                  <div className="w-1/3 h-auto flex flex-col justify-start items-start gap-2 px-2 py-3 bg-white rounded-lg">
                    <div className="w-full flex justify-between items-center px-2 py-1">
                      <p
                        className="text-md font-semibold text-neutral-800"
                        style={{ fontFamily: "iransans-bold" }}
                      >
                        ویرایش محتوا
                      </p>
                      <button
                        className="flex justify-center items-center w-8 h-8 rounded-full bg-neutral-200 shadow-lg"
                        onClick={() =>
                          document
                            .getElementById(`modal_${entry.id}_second`)
                            .close()
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        عنوان:
                      </p>
                      {user ? (
                        <EditText
                          name={entry.second_story}
                          defaultValue={entry.second_story}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `second_story`, value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-black">
                          {entry.second_story}
                        </p>
                      )}
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        توضیحات:
                      </p>
                      {user ? (
                        <EditTextarea
                          name={entry.second_explanation}
                          defaultValue={entry.second_explanation}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `second_explanation`, value)
                          }
                        />
                      ) : (
                        <>
                          <p className="text-sm text-black">
                            {entry.second_explanation}
                          </p>
                        </>
                      )}
                    </div>
                    {user && (
                      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                        <p
                          className="text-md font-semibold text-neutral-600"
                          style={{ fontFamily: "iransans" }}
                        >
                          رنگ پس‌زمینه:
                        </p>
                        <EditText
                          name={entry.second_color}
                          defaultValue={entry.second_color}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `second_color`, value)
                          }
                        />
                      </div>
                    )}
                    {user && (
                      <div className="w-full flex justify-center items-center px-2 py-2 gap-3">
                        <button
                          className="flex justify-center items-center w-auto h-10 px-6 bg-rose-400 hover:bg-rose-500 rounded-md text-white text-sm"
                          style={{ fontFamily: "iransans" }}
                          onClick={() => {
                            handleSave(entry.id);
                            document
                              .getElementById(`modal_${entry.id}_second`)
                              .close();
                          }}
                        >
                          ذخیره
                        </button>
                      </div>
                    )}
                  </div>
                </dialog>
                <div
                  className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
                  style={{
                    background: entry.third_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_third`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-white text-xs">
                    <svg
                      className="absolute left-2 w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#ffffff"
                        d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                      />
                    </svg>
                    {entry.third_story}
                  </p>
                </div>
                <dialog id={`modal_${entry.id}_third`} className="modal">
                  <div className="w-1/3 h-auto flex flex-col justify-start items-start gap-2 px-2 py-3 bg-white rounded-lg">
                    <div className="w-full flex justify-between items-center px-2 py-1">
                      <p
                        className="text-md font-semibold text-neutral-800"
                        style={{ fontFamily: "iransans-bold" }}
                      >
                        ویرایش محتوا
                      </p>
                      <button
                        className="flex justify-center items-center w-8 h-8 rounded-full bg-neutral-200 shadow-lg"
                        onClick={() =>
                          document
                            .getElementById(`modal_${entry.id}_third`)
                            .close()
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        عنوان:
                      </p>
                      {user ? (
                        <EditText
                          inputClassName="bg-transparent outline-none"
                          name={entry.third_story}
                          defaultValue={entry.third_story}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `third_story`, value)
                          }
                        />
                      ) : (
                        <>
                          <p className="text-sm text-black">
                            {entry.third_story}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        توضیحات:
                      </p>
                      {user ? (
                        <EditTextarea
                          inputClassName="bg-transparent outline-none"
                          name={entry.third_explanation}
                          defaultValue={entry.third_explanation}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `third_explanation`, value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-black">
                          {entry.third_explanation}
                        </p>
                      )}
                    </div>
                    {user && (
                      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                        <p
                          className="text-md font-semibold text-neutral-600"
                          style={{ fontFamily: "iransans" }}
                        >
                          رنگ پس‌زمینه:
                        </p>
                        <EditText
                          name={entry.third_color}
                          defaultValue={entry.third_color}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `third_color`, value)
                          }
                        />
                      </div>
                    )}
                    {user && (
                      <div className="w-full flex justify-center items-center px-2 py-2 gap-3">
                        <button
                          className="flex justify-center items-center w-auto h-10 px-6 bg-rose-400 hover:bg-rose-500 rounded-md text-white text-sm"
                          style={{ fontFamily: "iransans" }}
                          onClick={() => {
                            handleSave(entry.id);
                            document
                              .getElementById(`modal_${entry.id}_third`)
                              .close();
                          }}
                        >
                          ذخیره
                        </button>
                      </div>
                    )}
                  </div>
                </dialog>
                <div
                  className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
                  style={{
                    background: entry.fourth_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_fourth`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-white text-xs">
                    <svg
                      className="absolute left-2 w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#ffffff"
                        d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                      />
                    </svg>
                    {entry.fourth_story}
                  </p>
                </div>
                <dialog id={`modal_${entry.id}_fourth`} className="modal">
                  <div className="w-1/3 h-auto flex flex-col justify-start items-start gap-2 px-2 py-3 bg-white rounded-lg">
                    <div className="w-full flex justify-between items-center px-2 py-1">
                      <p
                        className="text-md font-semibold text-neutral-800"
                        style={{ fontFamily: "iransans-bold" }}
                      >
                        ویرایش محتوا
                      </p>
                      <button
                        className="flex justify-center items-center w-8 h-8 rounded-full bg-neutral-200 shadow-lg"
                        onClick={() =>
                          document
                            .getElementById(`modal_${entry.id}_fourth`)
                            .close()
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        عنوان:
                      </p>
                      {user ? (
                        <EditText
                          inputClassName="bg-transparent outline-none"
                          name={entry.fourth_story}
                          defaultValue={entry.fourth_story}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `fourth_story`, value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-black">
                          {entry.fourth_story}
                        </p>
                      )}
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        توضیحات:
                      </p>
                      {user ? (
                        <EditTextarea
                          inputClassName="bg-transparent outline-none"
                          name={entry.fourth_explanation}
                          defaultValue={entry.fourth_explanation}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `fourth_explanation`, value)
                          }
                        />
                      ) : (
                        <p className="text-xs text-black">
                          {entry.fourth_explanation}
                        </p>
                      )}
                    </div>
                    {user && (
                      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                        <p
                          className="text-md font-semibold text-neutral-600"
                          style={{ fontFamily: "iransans" }}
                        >
                          رنگ پس‌زمینه:
                        </p>
                        <EditText
                          name={entry.fourth_color}
                          defaultValue={entry.fourth_color}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `fourth_color`, value)
                          }
                        />
                      </div>
                    )}
                    {user && (
                      <div className="w-full flex justify-center items-center px-2 py-2 gap-3">
                        <button
                          className="flex justify-center items-center w-auto h-10 px-6 bg-rose-400 hover:bg-rose-500 rounded-md text-white text-sm"
                          style={{ fontFamily: "iransans" }}
                          onClick={() => {
                            handleSave(entry.id);
                            document
                              .getElementById(`modal_${entry.id}_fourth`)
                              .close();
                          }}
                        >
                          ذخیره
                        </button>
                      </div>
                    )}
                  </div>
                </dialog>
                <div
                  className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
                  style={{
                    background: entry.fourth_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_five`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-white text-xs">
                    <svg
                      className="absolute left-2 w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#ffffff"
                        d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                      />
                    </svg>
                    {entry.five_story}
                  </p>
                </div>
                <dialog id={`modal_${entry.id}_five`} className="modal">
                  <div className="w-1/3 h-auto flex flex-col justify-start items-start gap-2 px-2 py-3 bg-white rounded-lg">
                    <div className="w-full flex justify-between items-center px-2 py-1">
                      <p
                        className="text-md font-semibold text-neutral-800"
                        style={{ fontFamily: "iransans-bold" }}
                      >
                        ویرایش محتوا
                      </p>
                      <button
                        className="flex justify-center items-center w-8 h-8 rounded-full bg-neutral-200 shadow-lg"
                        onClick={() =>
                          document
                            .getElementById(`modal_${entry.id}_five`)
                            .close()
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        عنوان:
                      </p>
                      {user ? (
                        <EditText
                          inputClassName="bg-transparent outline-none"
                          name={entry.five_story}
                          defaultValue={entry.five_story}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `five_story`, value)
                          }
                        />
                      ) : (
                        <p className="text-xs text-black">{entry.five_story}</p>
                      )}
                    </div>
                    <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                      <p
                        className="text-md font-semibold text-neutral-600"
                        style={{ fontFamily: "iransans" }}
                      >
                        توضیحات:
                      </p>
                      {user ? (
                        <EditTextarea
                          inputClassName="bg-transparent outline-none"
                          name={entry.five_explanation}
                          defaultValue={entry.five_explanation}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `five_explanation`, value)
                          }
                        />
                      ) : (
                        <>
                          <p className="text-xs text-black">
                            {entry.five_explanation}
                          </p>
                        </>
                      )}
                    </div>
                    {user && (
                      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                        <p
                          className="text-md font-semibold text-neutral-600"
                          style={{ fontFamily: "iransans" }}
                        >
                          رنگ پس‌زمینه:
                        </p>
                        <EditText
                          name={entry.five_color}
                          defaultValue={entry.five_color}
                          onSave={({ value }) =>
                            handleEdit(entry.id, `five_color`, value)
                          }
                        />
                      </div>
                    )}
                    {user && (
                      <div className="w-full flex justify-center items-center px-2 py-2 gap-3">
                        <button
                          className="flex justify-center items-center w-auto h-10 px-6 bg-rose-400 hover:bg-rose-500 rounded-md text-white text-sm"
                          style={{ fontFamily: "iransans" }}
                          onClick={() => {
                            handleSave(entry.id);
                            document
                              .getElementById(`modal_${entry.id}_five`)
                              .close();
                          }}
                        >
                          ذخیره
                        </button>
                      </div>
                    )}
                  </div>
                </dialog>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export { OldContent };
