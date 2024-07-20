import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Header = () => (
  <div className="w-full h-auto flex justify-center items-center">
    <div className="w-auto h-auto flex justify-start items-center gap-3 bg-transparent py-2 overflow-x-auto px-1">
      <div className="flex justify-center items-center rounded-lg w-12 h-10 bg-[#161c40] text-white">
        <p className="text-xs">روز</p>
      </div>
      {['محتوای اول', 'محتوای دوم', 'محتوای سوم', 'محتوای چهارم', 'محتوای پنجم'].map((text, idx) => (
        <div key={idx} className="flex justify-center items-center rounded-lg w-68 h-10 bg-[#161c40] text-white">
          <p>{text}</p>
        </div>
      ))}
    </div>
  </div>
);

const Modal = ({ id, entry, field, user, handleEdit, handleSave, menuItems, handleColorSelect, closeModal }) => (
  <dialog id={`modal_${id}_${field}`} className="modal">
    <div className="w-1/3 h-auto flex flex-col justify-start items-start gap-2 px-2 py-3 bg-white rounded-lg">
      <div className="w-full flex justify-between items-center px-2 py-1">
        <p className="text-md font-semibold text-neutral-800">ویرایش محتوا</p>
        <button className="flex justify-center items-center w-8 h-8 rounded-full bg-neutral-200 shadow-lg" onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
        <p className="text-md font-semibold text-neutral-600">عنوان:</p>
        {user ? (
          <EditText name={entry[`title_${field}_content`]} defaultValue={entry[`title_${field}_content`]} onSave={({ value }) => handleEdit(id, `title_${field}_content`, value)} />
        ) : (
          <p className="text-sm text-black">{entry[`title_${field}_content`]}</p>
        )}
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
        <p className="text-md font-semibold text-neutral-600">توضیحات:</p>
        {user ? (
          <EditTextarea name={entry[`desc_${field}_content`]} defaultValue={entry[`desc_${field}_content`]} onSave={({ value }) => handleEdit(id, `desc_${field}_content`, value)} />
        ) : (
          <p className="text-sm text-black">{entry[`desc_${field}_content`]}</p>
        )}
      </div>
      {user && (
        <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
          <Menu as="div" className="relative inline-block text-right">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              انتخاب رنگ پس زمینه
              <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
            </MenuButton>
            <MenuItems className="bg-slate-200 shadow-lg rounded-lg h-auto z-10">
              {menuItems.map((item) => (
                <MenuItem key={item.id}>
                  {({ active }) => (
                    <div className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-100 ${active ? "bg-slate-100" : ""}`} onClick={() => handleColorSelect(id, `bg_color_${field}`, item.hex_value)}>
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
          <button className="flex justify-center items-center w-auto h-10 px-6 bg-rose-400 hover:bg-rose-500 rounded-md text-white text-sm" onClick={() => { handleSave(id); closeModal(); }}>
            ذخیره
          </button>
        </div>
      )}
    </div>
  </dialog>
);

const ContentEntry = ({ entry, user, handleEdit, handleSave, menuItems, handleColorSelect }) => {
  const renderContentFields = (entry, field, user, handleEdit, handleSave, menuItems, handleColorSelect) => {
    const backgroundColor = entry[`bg_color_${field}`] || '#160000'; // Default to white if color is not defined

    return (
      <div
        key={field}
        className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
        style={{ background: backgroundColor }}
        onClick={() => openModal(`modal_${entry.id}_${field}`)}
      >
        <p className="relative w-full h-full flex justify-center items-center text-white text-xs">
          <svg className="absolute left-2 w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="#ffffff" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
          {entry[`title_${field}_content`]}
        </p>
      </div>
    );
  };

  const openModal = (modalId) => document.getElementById(modalId).showModal();
  const closeModal = (modalId) => document.getElementById(modalId).close();

  const renderModal = (id, entry, field, user, handleEdit, handleSave, menuItems, handleColorSelect) => (
    <Modal
      key={field}
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
    <div key={entry.id} className="w-full h-auto flex justify-start items-center gap-3 rounded-lg px-1 py-2">
      <div className="flex justify-center items-center rounded-lg w-12 h-10 text-white" style={{ background: "#161c40" }}>
        <p className="text-sm">{entry.day}</p>
      </div>
      {['first', 'seconde', 'three', 'four', 'five'].map((field) =>
        renderContentFields(entry, field, user, handleEdit, handleSave, menuItems, handleColorSelect)
      )}
      {['first', 'seconde', 'three', 'four', 'five'].map((field) =>
        renderModal(entry.id, entry, field, user, handleEdit, handleSave, menuItems, handleColorSelect)
      )}
    </div>
  );
};


const ContentPage = () => {
  const { collectionName } = useParams();
  const [calendarData, setCalendarData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [user, setUser] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/content/bg-color/");
        const result = await res.json();
        setMenuItems(result);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/content/page-content/?name=${collectionName}`);
        const result = await res.json();
        result.sort((a, b) => a.day - b.day);
        setCalendarData(result);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    fetchCalendarData();
  }, [collectionName]);

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
        [field]: hexValue,
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
        const response = await fetch(`http://127.0.0.1:8000/api/content/page-content/${id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEntry),
        });

        if (response.ok) {
          setCalendarData((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...updatedEntry } : entry)));
          setEditedData((prevData) => ({
            ...prevData,
            [id]: {},
          }));
        } else {
          console.error("Failed to save data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <section className="w-full h-auto overflow-y-auto px-5">
      <Header />
      {calendarData.map((entry) => (
        <ContentEntry
          key={entry.id}
          entry={entry}
          user={user}
          handleEdit={handleEdit}
          handleSave={handleSave}
          menuItems={menuItems}
          handleColorSelect={handleColorSelect}
        />
      ))}
    </section>
  );
};

export { ContentPage };
