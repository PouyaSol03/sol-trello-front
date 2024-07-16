import { useState, useEffect, useMemo } from "react";
// import { digitsEnToFa } from "@persian-tools/persian-tools";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { jwtDecode } from "jwt-decode";
// import { Dropdown } from "../Dropdown/Dropdown";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

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

const ContentCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [user, setUser] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [hexToIdMap, setHexToIdMap] = useState({});
  const [idToHexMap, setIdToHexMap] = useState({});

  // Calculate day difference
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const referenceDate = new Date("2024-07-06");
  const dayDifference = (currentDay - referenceDate.getDate() + 26) % 26;

  // Fetch background color options
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/content/bg-color/");
        const result = await res.json();
        setMenuItems(result);
        const hexMap = {};
        const idMap = {};
        result.forEach((item) => {
          hexMap[item.hex_value] = item.id;
          idMap[item.id] = item.hex_value;
        });
        setHexToIdMap(hexMap);
        setIdToHexMap(idMap);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/content/fixed-content/"
        );
        const result = await res.json();
        result.sort((a, b) => a.day - b.day);
        setCalendarData(result);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    fetchCalendarData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isStaff = localStorage.getItem("is_staff");
    setUser(token && token.split(".").length === 3 && isStaff === "true");
  }, []);

  const handleColorSelect = (id, field, hexValue) => {
    setEditedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: hexValue, // Store hex value here
      },
    }));
  };

  const openModal = (modalId) => {
    document.getElementById(modalId).showModal();
  };

  const handleEdit = (id, field, value) => {
    console.log(`Editing ${field} for entry ${id} with value: ${value}`);
    setEditedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id) => {
    const updatedEntry = editedData[id];
    if (updatedEntry) {
      // Convert hex codes to IDs using hexToIdMap for all color fields
      const dataToSave = { ...updatedEntry };
      const colorFields = [
        "first_color",
        "second_color",
        "third_color",
        "fourth_color",
        "five_color",
      ];
      colorFields.forEach((field) => {
        if (dataToSave[field] && hexToIdMap[dataToSave[field]]) {
          dataToSave[field] = hexToIdMap[dataToSave[field]];
        }
      });

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/content/fixed-content/${id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSave),
          }
        );

        if (response.ok) {
          setCalendarData((prev) =>
            prev.map((entry) =>
              entry.id === id ? { ...entry, ...dataToSave } : entry
            )
          );
          setEditedData((prevData) => ({
            ...prevData,
            [id]: {}, // Clear the edited data for the saved entry
          }));
        } else {
          console.error("Failed to save data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const dayToCollectionNames = useMemo(() => {
    const mapping = { food: {}, company: {}, both: {} };

    const addToMapping = (collections, type) => {
      collections.forEach((collection) => {
        const adjustedDay = ((collection.asDay + dayDifference - 1) % 26) + 1;
        if (!mapping[type][adjustedDay]) {
          mapping[type][adjustedDay] = [];
        }
        mapping[type][adjustedDay].push(collection.name);
      });
    };

    addToMapping(foodCollections, "food");
    addToMapping(companyCollections, "company");

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
          {calendarData.map((entry) => {
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
                <div
                  className="flex justify-center items-center w-48 h-10 p-2 text-white rounded-lg"
                  style={{
                    background: "#161c40",
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
                    background:
                      idToHexMap[entry.first_color] || entry.first_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_first`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-black text-xs">
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
                        <Menu
                          as="div"
                          className="relative inline-block text-right"
                        >
                          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            انتخاب رنگ پس زمینه
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="-mr-1 h-5 w-5 text-gray-400"
                            />
                          </MenuButton>
                          <MenuItems className="bg-slate-200 shadow-lg rounded-lg h-auto z-10">
                            {menuItems.map((item) => (
                              <MenuItem key={item.id}>
                                {({ active }) => (
                                  <div
                                    className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-100 ${
                                      active ? "bg-slate-100" : ""
                                    }`}
                                    onClick={() =>
                                      handleColorSelect(
                                        entry.id,
                                        "first_color",
                                        item.hex_value
                                      )
                                    } // Use hex_value
                                  >
                                    {item.name}
                                  </div>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
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
                    background:
                      idToHexMap[entry.second_color] || entry.second_color,
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
                            handleEdit(entry.id, "second_story", value)
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
                            handleEdit(entry.id, "second_explanation", value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-black">
                          {entry.second_explanation}
                        </p>
                      )}
                    </div>
                    {user && (
                      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                        <Menu
                          as="div"
                          className="relative inline-block text-right"
                        >
                          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            انتخاب رنگ پس زمینه
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="-mr-1 h-5 w-5 text-gray-400"
                            />
                          </MenuButton>
                          <MenuItems className="bg-slate-200 shadow-lg rounded-lg h-auto z-10">
                            {menuItems.map((item) => (
                              <MenuItem key={item.id}>
                                {({ active }) => (
                                  <div
                                    className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-100 ${
                                      active ? "bg-slate-100" : ""
                                    }`}
                                    onClick={() =>
                                      handleColorSelect(
                                        entry.id,
                                        "second_color",
                                        item.hex_value
                                      )
                                    } // Use hex_value
                                  >
                                    {item.name}
                                  </div>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
                      </div>
                    )}
                    {user && (
                      <div className="w-full flex justifycenter items-center px-2 py-2 gap-3">
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
                    background:
                      idToHexMap[entry.third_color] || entry.third_color,
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
                          name={entry.third_story}
                          defaultValue={entry.third_story}
                          onSave={({ value }) =>
                            handleEdit(entry.id, "third_story", value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-black">
                          {entry.third_story}
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
                          name={entry.third_explanation}
                          defaultValue={entry.third_explanation}
                          onSave={({ value }) =>
                            handleEdit(entry.id, "third_explanation", value)
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
                        <Menu
                          as="div"
                          className="relative inline-block text-right"
                        >
                          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            انتخاب رنگ پس زمینه
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="-mr-1 h-5 w-5 text-gray-400"
                            />
                          </MenuButton>
                          <MenuItems className="bg-slate-200 shadow-lg rounded-lg h-auto z-10">
                            {menuItems.map((item) => (
                              <MenuItem key={item.id}>
                                {({ active }) => (
                                  <div
                                    className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-100 ${
                                      active ? "bg-slate-100" : ""
                                    }`}
                                    onClick={() =>
                                      handleColorSelect(
                                        entry.id,
                                        "third_color",
                                        item.hex_value
                                      )
                                    } // Use hex_value
                                  >
                                    {item.name}
                                  </div>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
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
                    background:
                      idToHexMap[entry.fourth_color] || entry.fourth_color,
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
                          name={entry.fourth_story}
                          defaultValue={entry.fourth_story}
                          onSave={({ value }) =>
                            handleEdit(entry.id, "fourth_story", value)
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
                          name={entry.fourth_explanation}
                          defaultValue={entry.fourth_explanation}
                          onSave={({ value }) =>
                            handleEdit(entry.id, "fourth_explanation", value)
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
                        <Menu
                          as="div"
                          className="relative inline-block text-right"
                        >
                          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            انتخاب رنگ پس زمینه
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="-mr-1 h-5 w-5 text-gray-400"
                            />
                          </MenuButton>
                          <MenuItems className="bg-slate-200 shadow-lg rounded-lg h-auto z-10">
                            {menuItems.map((item) => (
                              <MenuItem key={item.id}>
                                {({ active }) => (
                                  <div
                                    className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-100 ${
                                      active ? "bg-slate-100" : ""
                                    }`}
                                    onClick={() =>
                                      handleColorSelect(
                                        entry.id,
                                        "fourth_color",
                                        item.hex_value
                                      )
                                    } // Use hex_value
                                  >
                                    {item.name}
                                  </div>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
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
                    background:
                      idToHexMap[entry.five_color] || entry.five_color,
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
                          name={entry.five_story}
                          defaultValue={entry.five_story}
                          onSave={({ value }) =>
                            handleEdit(entry.id, "five_story", value)
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
                          name={entry.five_explanation}
                          defaultValue={entry.five_explanation}
                          onSave={({ value }) =>
                            handleEdit(entry.id, "five_explanation", value)
                          }
                        />
                      ) : (
                        <p className="text-xs text-black">
                          {entry.five_explanation}
                        </p>
                      )}
                    </div>
                    {user && (
                      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
                        <Menu
                          as="div"
                          className="relative inline-block text-right"
                        >
                          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            انتخاب رنگ پس زمینه
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="-mr-1 h-5 w-5 text-gray-400"
                            />
                          </MenuButton>
                          <MenuItems className="bg-slate-200 shadow-lg rounded-lg h-auto z-10">
                            {menuItems.map((item) => (
                              <MenuItem key={item.id}>
                                {({ active }) => (
                                  <div
                                    className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-100 ${
                                      active ? "bg-slate-100" : ""
                                    }`}
                                    onClick={() =>
                                      handleColorSelect(
                                        entry.id,
                                        "five_color",
                                        item.hex_value
                                      )
                                    } // Use hex_value
                                  >
                                    {item.name}
                                  </div>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
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

export { ContentCalendar };
