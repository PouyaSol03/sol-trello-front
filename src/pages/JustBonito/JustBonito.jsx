/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Header = () => (
  <div className="w-full h-auto flex justify-start items-center px-1 py-2">
    <div className="w-auto h-auto flex justify-start items-center gap-3 bg-transparent overflow-x-auto">
      <div className="flex justify-center items-center rounded-lg w-12 h-10 bg-[#161c40] text-white">
        <p className="text-xs">روز</p>
      </div>
      {[
        "محتوای اول",
        "محتوای دوم",
        "محتوای سوم",
        "محتوای چهارم",
        "محتوای پنجم",
      ].map((text, idx) => (
        <div
          key={idx}
          className="flex justify-center items-center rounded-lg w-68 h-10 bg-[#161c40] text-white"
        >
          <p>{text}</p>
        </div>
      ))}
    </div>
  </div>
);

const Modal = ({
  id,
  entry,
  field,
  user,
  handleEdit,
  handleSave,
  menuItems,
  handleColorSelect,
  closeModal,
}) => (
  <dialog id={`modal_${id}_${field}`} className="modal">
    <div className="w-1/3 h-auto flex flex-col justify-start items-start gap-2 px-2 py-3 bg-white rounded-lg">
      <div className="w-full flex justify-between items-center px-2 py-1">
        <p className="text-md font-semibold text-neutral-800">ویرایش محتوا</p>
        <button
          className="flex justify-center items-center w-8 h-8 rounded-full bg-neutral-200 shadow-lg"
          onClick={closeModal}
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
        <p className="text-md font-semibold text-neutral-600">عنوان:</p>
        {user ? (
          <EditText
            name={entry[`title_${field}_content`]}
            defaultValue={entry[`title_${field}_content`]}
            onSave={({ value }) =>
              handleEdit(id, `title_${field}_content`, value)
            }
          />
        ) : (
          <p className="text-sm text-black">
            {entry[`title_${field}_content`]}
          </p>
        )}
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
        <p className="text-md font-semibold text-neutral-600">توضیحات:</p>
        {user ? (
          <EditTextarea
            name={entry[`desc_${field}_content`]}
            defaultValue={entry[`desc_${field}_content`]}
            onSave={({ value }) =>
              handleEdit(id, `desc_${field}_content`, value)
            }
          />
        ) : (
          <p className="text-sm text-black">{entry[`desc_${field}_content`]}</p>
        )}
      </div>
      {user && (
        <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
          <Menu as="div" className="relative inline-block text-right">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              انتخاب موضوع
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
                        handleColorSelect(id, `bg_color_${field}`, item.id)
                      } // Pass the actual color ID
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
            onClick={() => {
              handleSave(id);
              closeModal();
            }}
          >
            ذخیره
          </button>
        </div>
      )}
    </div>
  </dialog>
);

const ContentEntry = ({
  entry,
  user,
  handleEdit,
  handleSave,
  menuItems,
  handleColorSelect,
  dueDate, // Receive dueDate as prop
}) => {
  const renderContentFields = (
    entry,
    field,
    user,
    handleEdit,
    handleSave,
    menuItems,
    handleColorSelect
  ) => {
    const backgroundColor = entry[`bg_color_${field}_hex`] || ""; // Accessing the nested hex_value

    return (
      <div
        key={`${entry.id}-${field}`}
        className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
        style={{ backgroundColor: backgroundColor }} // Correct usage
        onClick={() => openModal(`modal_${entry.id}_${field}`)}
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
          {entry[`title_${field}_content`]}
        </p>
      </div>
    );
  };

  const openModal = (modalId) => document.getElementById(modalId).showModal();
  const closeModal = (modalId) => document.getElementById(modalId).close();
  const isDueDate = entry.day === dueDate; // Determine if the entry day matches the due date

  const renderModal = (
    id,
    entry,
    field,
    user,
    handleEdit,
    handleSave,
    menuItems,
    handleColorSelect
  ) => (
    <Modal
      key={`${id}-${field}`}
      id={id}
      entry={entry}
      field={field}
      user={user}
      handleEdit={handleEdit}
      handleSave={handleSave}
      menuItems={menuItems}
      handleColorSelect={handleColorSelect}
      closeModal={() => closeModal(`modal_${id}_${field}`)}
    />
  );

  return (
    <div
      key={entry.id}
      className="w-full h-auto flex justify-start items-center gap-3 rounded-lg px-1 py-1"
    >
      <div
        className="flex justify-center items-center rounded-lg w-12 h-10 text-white"
        style={{ backgroundColor: isDueDate ? "#ff0000" : "#161c40" }}
      >
        <p className="text-sm">{entry.day}</p>
      </div>
      {["first", "seconde", "thired", "four", "five"].map((field) =>
        renderContentFields(
          entry,
          field,
          user,
          handleEdit,
          handleSave,
          menuItems,
          handleColorSelect
        )
      )}
      {["first", "seconde", "thired", "four", "five"].map((field) =>
        renderModal(
          entry.id,
          entry,
          field,
          user,
          handleEdit,
          handleSave,
          menuItems,
          handleColorSelect
        )
      )}
    </div>
  );
};

// JustBonito Component
const JustBonito = () => {
  const [namePages, setNamePages] = useState([]);
  const [specialPages, setSpecialPages] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [user, setUser] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const { collectionName } = useParams();
  const navigate = useNavigate();
  const specialPageNames = ["دکتر غلام زاده", "دکتر حلیمی"];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch(
          "https://apisoltrello.liara.run/api/content/bg-color/"
        );
        const data = await res.json();
        setMenuItems(
          data.map((item) => ({
            id: item.id,
            name: item.name,
            hexValue: item.hex_value,
          }))
        );
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (collectionName) {
      const fetchCalendarData = async () => {
        try {
          const res = await fetch(
            `https://apisoltrello.liara.run/api/content/page-content/?name=${collectionName}`
          );
          if (!res.ok) throw new Error("Failed to fetch calendar data");
          const result = await res.json();
          result.sort((a, b) => a.day - b.day);
          setCalendarData(result);
        } catch (error) {
          console.error("Error fetching calendar data:", error);
        }
      };
      fetchCalendarData();
    }
  }, [collectionName]);

  useEffect(() => {
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      const authData = JSON.parse(authDataString);
      setUser(
        authData.is_staff
      );
    }
  }, []);

  useEffect(() => {
    const fetchNamePages = async () => {
      try {
        const response = await fetch(
          "https://apisoltrello.liara.run/api/content/name-page/"
        );
        if (!response.ok) throw new Error("Failed to fetch name pages");
        const data = await response.json();
        setNamePages(data);
        const filteredPages = data.filter((page) =>
          specialPageNames.includes(page.name)
        );
        setSpecialPages(filteredPages);
      } catch (error) {
        console.error("Error fetching name pages:", error);
      }
    };
    fetchNamePages();
  }, []);

  const handleColorSelect = (id, field, colorId) => {
    setEditedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: colorId,
      },
    }));
  };

  const handleEdit = (id, field, value) => {
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
      try {
        const response = await fetch(
          `https://apisoltrello.liara.run/api/content/page-content/${id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEntry),
          }
        );
        if (response.ok) {
          const updatedData = await response.json();
          setCalendarData((prev) =>
            prev.map((entry) =>
              entry.id === id ? { ...entry, ...updatedData } : entry
            )
          );
          setEditedData((prevData) => ({ ...prevData, [id]: {} }));
        } else {
          console.error("Failed to save data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handlePageClick = (pageName) => {
    setSelectedPage(pageName); // Set the selected page
    navigate(`/bonito/${pageName}`);
  };

  const [selectedPage, setSelectedPage] = useState(null);

  return (
    <>
      <section className="bg-gray-200 h-screen flex justify-center items-center p-2 gap-2">
        <aside className="w-80 h-full bg-white rounded-lg flex flex-col justify-start items-center px-2">
          <h1 className="mt-6 font-semibold text-xl">بونیتو</h1>
          <hr className="w-full mt-2" />
          <div className="mt-4 w-full h-90 overflow-y-auto px-1">
            {specialPages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageClick(page.name)}
                className={`block w-full text-right p-2 my-1 rounded-lg ${
                  selectedPage === page.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                } `}
              >
                {page.name}
              </button>
            ))}
          </div>
        </aside>
        <main className="w-full h-full bg-white rounded-lg p-2 overflow-y-auto">
          <div className="flex justify-start items-center mt-2 mb-2 gap-1">
            <strong className="">محتوای اختصاصی برای:</strong>
            <p className="bg-slate-300 px-2 py-2 rounded-lg">{selectedPage}</p>
          </div>
          <Header />
          {calendarData.length > 0 ? (
            calendarData.map((entry) => (
              <ContentEntry
                key={entry.id}
                entry={entry}
                user={user}
                handleEdit={handleEdit}
                handleSave={handleSave}
                menuItems={menuItems}
                handleColorSelect={handleColorSelect}
              />
            ))
          ) : (
            <p className="text-center text-lg mt-4">
              لطفا پیج مورد نظر رو انتخاب کنید
            </p>
          )}
        </main>
      </section>
    </>
  );
};

export { JustBonito };
