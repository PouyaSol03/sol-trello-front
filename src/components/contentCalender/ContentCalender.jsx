import { useState, useEffect, useMemo } from "react";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from 'react-router-dom';


// Sample data moved outside the component
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

const Header = () => (
  <div className="w-full h-auto flex justify-center items-center mt-4">
    <div className="w-auto h-auto flex justify-start items-center gap-3 bg-transparent py-2 overflow-x-auto px-1">
      <div className="flex justify-center items-center w-48 bg-transparent p-2 minHeight-40 h-auto rounded-lg text-white opacity-50">
        <p className="w-auto text-xs"></p>
      </div>
      <div className="flex justify-center items-center rounded-lg w-12 h-10 bg-[#161c40] text-white hidden">
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
          <EditText name={entry[`${field}_story`]} defaultValue={entry[`${field}_story`]} onSave={({ value }) => handleEdit(id, `${field}_story`, value)} />
        ) : (
          <p className="text-sm text-black">{entry[`${field}_story`]}</p>
        )}
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start px-2 py-2 gap-3">
        <p className="text-md font-semibold text-neutral-600">توضیحات:</p>
        {user ? (
          <EditTextarea name={entry[`${field}_explanation`]} defaultValue={entry[`${field}_explanation`]} onSave={({ value }) => handleEdit(id, `${field}_explanation`, value)} />
        ) : (
          <p className="text-sm text-black">{entry[`${field}_explanation`]}</p>
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
                    <div className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-100 ${active ? "bg-slate-100" : ""}`} onClick={() => handleColorSelect(id, `${field}_color`, item.hex_value)}>
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

const ContentEntry = ({ entry, dayToCollectionNames, user, editedData, handleEdit, handleSave, menuItems, handleColorSelect }) => {
  const renderCollectionLink = (name) => (
    <Link key={name} to={`/collection/${name}`} className="w-auto text-white">{name}</Link>
  );

  const renderContentFields = (entry, field, user, handleEdit, handleSave, menuItems, handleColorSelect) => (
    <div key={field} className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer" style={{ background: entry[`${field}_color`] }} onClick={() => openModal(`modal_${entry.id}_${field}`)}>
      <p className="relative w-full h-full flex justify-center items-center text-white text-xs">
        <svg className="absolute left-2 w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="#ffffff" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
        {entry[`${field}_story`]}
      </p>
    </div>
  );

  const openModal = (modalId) => document.getElementById(modalId).showModal();
  const closeModal = (modalId) => document.getElementById(modalId).close();

  const renderModal = (id, entry, field, user, handleEdit, handleSave, menuItems, handleColorSelect) => (
    <Modal key={field} id={id} entry={entry} field={field} user={user} handleEdit={handleEdit} handleSave={handleSave} menuItems={menuItems} handleColorSelect={handleColorSelect} closeModal={() => closeModal(`modal_${id}_${field}`)} />
  );

  const collectionNames = [
    ...dayToCollectionNames.food[entry.day] || [],
    ...dayToCollectionNames.company[entry.day] || [],
    ...dayToCollectionNames.both[entry.day]?.food || [],
    ...dayToCollectionNames.both[entry.day]?.company || []
  ];

  return collectionNames.map((name) => (
    <div key={name} className="w-full h-auto flex justify-start items-center gap-3 rounded-lg px-1 py-2 ">
      <div className="flex justify-center items-center w-48 h-10 p-2 text-white rounded-lg" style={{ background: "#161c40" }}>
        {renderCollectionLink(name)}
      </div>
      <div className="flex justify-center items-center rounded-lg w-12 h-10 text-white " style={{ background: "#161c40" }}>
        <p className="text-sm">{entry.day}</p>
      </div>
      {['first', 'second', 'third', 'fourth', 'five'].map((field) => renderContentFields(entry, field, user, handleEdit, handleSave, menuItems, handleColorSelect))}
      {['first', 'second', 'third', 'fourth', 'five'].map((field) => renderModal(entry.id, entry, field, user, handleEdit, handleSave, menuItems, handleColorSelect))}
    </div>
  ));
};

const ContentCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [user, setUser] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [hexToIdMap, setHexToIdMap] = useState({});
  const [idToHexMap, setIdToHexMap] = useState({});

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const referenceDate = new Date("2024-07-06");
  const dayDifference = (currentDay - referenceDate.getDate() + 26) % 26;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("https://apisoltrello.liara.run/api/content/bg-color/");
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
        const res = await fetch("https://apisoltrello.liara.run/api/content/fixed-content/");
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
      const dataToSave = { ...updatedEntry };
      const colorFields = ["first_color", "second_color", "third_color", "fourth_color", "five_color"];
      colorFields.forEach((field) => {
        if (dataToSave[field] && hexToIdMap[dataToSave[field]]) {
          dataToSave[field] = hexToIdMap[dataToSave[field]];
        }
      });

      try {
        const response = await fetch(`https://apisoltrello.liara.run/api/content/fixed-content/${id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        });

        if (response.ok) {
          setCalendarData((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...dataToSave } : entry)));
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
    <section className="w-full h-auto overflow-y-auto overflow-x-auto px-5">
      <Header />
      <div className="w-full h-auto flex flex-col justify-start items-center mt-2 gap-1">
        {calendarData.map((entry) => {
          const isFoodDay = dayToCollectionNames.food[entry.day];
          const isCompanyDay = dayToCollectionNames.company[entry.day];
          const isBothDay = dayToCollectionNames.both[entry.day];

          if (!isBothDay && !isFoodDay && !isCompanyDay) return null;

          return (
            <ContentEntry
              key={entry.id}
              entry={entry}
              dayToCollectionNames={dayToCollectionNames}
              user={user}
              editedData={editedData}
              handleEdit={handleEdit}
              handleSave={handleSave}
              menuItems={menuItems}
              handleColorSelect={handleColorSelect}
            />
          );
        })}
      </div>
    </section>
  );
};

export { ContentCalendar };