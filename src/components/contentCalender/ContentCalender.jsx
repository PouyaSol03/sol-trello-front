import { useState, useEffect, useMemo } from "react";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { EditText, EditTextarea } from "react-edit-text";
import 'react-edit-text/dist/index.css';

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
    name: "چه جیگری",
    asDay: 21,
  },
  {
    id: 10,
    name: "سالار",
    asDay: 22,
  },
  {
    id: 11,
    name: "بامداد",
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

const ContentCalender = () => {
  const [calenderData, setCalenderData] = useState([]);
  const [editedData, setEditedData] = useState({});


  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "http://127.0.0.1:8000/api/content/fixed-content/"
      );
      const result = await res.json();

      // Sort the result by 'day'
      result.sort((a, b) => a.day - b.day);

      setCalenderData(result);
    }
    fetchData();
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
  };
  const handleSave = async (id) => {
    const dataToSave = editedData[id];
    const res = await fetch(`http://127.0.0.1:8000/api/content/fixed-content/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    });
    if (res.ok) {
      const updatedItem = await res.json();
      setCalenderData((prevData) =>
        prevData.map((item) => (item.id === id ? updatedItem : item))
      );
      setEditedData((prevData) => {
        const { [id]: removed, ...rest } = prevData;
        return rest;
      });
    } else {
      console.error('Failed to save data');
    }
  };

  // Get the current day of the month
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  // Reference day (e.g., the day the code was written)
  const referenceDate = new Date("2024-07-06"); // Replace with your reference date
  const referenceDay = referenceDate.getDate();

  // Calculate the difference in days
  const dayDifference = (currentDay - referenceDay + 26) % 26; // Ensure non-negative and wrap around 26 days

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

  


  return (
    <>
      <section className="w-full h-auto overflow-y-auto px-5">
        <div className="w-full h-full flex justify-center items-center mt-4">
          <div className="w-full h-auto flex justify-start items-center gap-3 bg-transparent rounded-full py-2">
            <div
              className="flex justify-center items-center w-60"
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
              className="flex justify-center items-center rounded-lg w-10 h-10"
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
                className={`w-full h-auto flex justify-start items-center gap-3 rounded-lg py-2 ${
                  isBothDay
                    ? "bg-green-300"
                    : isFoodDay
                    ? "bg-rose-300"
                    : isCompanyDay
                    ? "bg-blue-300"
                    : ""
                }`}
              >
                <div className="flex justify-center items-center w-60 h-10 p-2 bg-transparent text-black">
                  <p
                    className="w-auto text-black"
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
                  className="flex justify-center items-center rounded-lg w-10 h-10 text-white"
                  style={{
                    background: "#161c40",
                  }}
                >
                  <p className="text-sm">{digitsEnToFa(entry.day)}</p>
                </div>
                <div
                  className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
                  style={{
                    background: entry.first_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_first`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-white text-sm">
                    <svg
                      className="absolute left-3 w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#ffffff"
                        d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-1 2.5-32.8-12.5-45.3 0s -12.5 32.8 0 45.3l192 192z"
                      />
                    </svg>
                    {digitsEnToFa(entry.first_story)}
                  </p>
                </div>
                {/* Modal for this entry */}
                <dialog id={`modal_${entry.id}_first`} className="modal">
                  <div className="modal-box w-full h-80 flex flex-col justify-center items-center">
                    <form 
                    onSubmit={(e) => e.preventDefault()}
                    action="" 
                    className="w-full h-full flex flex-col justify-around items-center">
                      <EditText 
                      // style={{ width: '100%', }}
                      onChange={(e) => 
                        handleEdit(entry.id, "first_story", e.target.value)
                      }
                      id={entry.first_story} 
                      name={entry.first_story} 
                      defaultValue={digitsEnToFa(entry.first_story)}
                      // showEditButton
                      // editButtonProps={{style: { width: 20 }}}
                      />
                      <EditTextarea 
                      onChange={(e) =>
                        handleEdit(entry.id, "first_explanation", e.target.value)
                      }
                      rows={6}
                      // className="max-h-full text-right flex"
                      id={entry.first_explanation}
                      name={entry.first_explanation}
                      defaultValue={digitsEnToFa(entry.first_explanation)}
                      showEditButton
                      />
                      <div className="w-full flex justify-end items-center">
                        <button
                              className="w-16 h-11 bg-slate-300 flex justify-center items-center rounded-lg text-black hover:bg-slate-400
                              outline-none"
                              onClick={() => {
                                handleSave(entry.id);
                                document.getElementById(`modal_${entry.id}_first`).close();
                              }}
                            >
                              بستن
                        </button>
                      </div>
                    </form>
                  </div>
                </dialog>
                <div
                  className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
                  style={{
                    background: entry.second_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_second`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-white text-sm">
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
                    {digitsEnToFa(entry.second_story)}
                  </p>
                </div>
                <dialog id={`modal_${entry.id}_second`} className="modal">
                  <div className="modal-box w-full h-80 flex flex-col justify-center items-center">
                    <form action="" className="w-full h-full flex flex-col justify-around items-center">
                      <EditText 
                      // style={{ width: '100%', }}
                      id={entry.second_story} 
                      name={entry.second_story} 
                      defaultValue={digitsEnToFa(entry.second_story)}
                      // showEditButton
                      // editButtonProps={{style: { width: 20 }}}
                      />
                      <EditTextarea 
                      rows={6}
                      // className="max-h-full text-right flex"
                      id={entry.second_explanation}
                      name={entry.second_explanation}
                      defaultValue={digitsEnToFa(entry.second_explanation)}
                      showEditButton
                      />
                      <div className="w-full flex justify-end items-center">
                        <button
                              className="w-16 h-11 bg-slate-300 flex justify-center items-center rounded-lg text-black hover:bg-slate-400
                              outline-none"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent default behavior
                                document.getElementById(`modal_${entry.id}_second`).close();
                              }}
                            >
                              بستن
                        </button>
                      </div>
                    </form>
                  </div>
                </dialog>
                <div
                  className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
                  style={{
                    background: entry.third_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_third`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-white text-sm">
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
                    {digitsEnToFa(entry.third_story)}
                  </p>
                </div>
                <dialog id={`modal_${entry.id}_third`} className="modal">
                  <div className="modal-box w-full h-80 flex flex-col justify-center items-center">
                    <form action="" className="w-full h-full flex flex-col justify-around items-center">
                      <EditText 
                      // style={{ width: '100%', }}
                      id={entry.third_story} 
                      name={entry.third_story} 
                      defaultValue={digitsEnToFa(entry.third_story)}
                      // showEditButton
                      // editButtonProps={{style: { width: 20 }}}
                      />
                      <EditTextarea 
                      rows={6}
                      // className="max-h-full text-right flex"
                      id={entry.third_explanation}
                      name={entry.third_explanation}
                      defaultValue={digitsEnToFa(entry.third_explanation)}
                      showEditButton
                      />
                      <div className="w-full flex justify-end items-center">
                        <button
                              className="w-16 h-11 bg-slate-300 flex justify-center items-center rounded-lg text-black hover:bg-slate-400
                              outline-none"
                              onClick={() =>
                                document
                                  .getElementById(`modal_${entry.id}_third`)
                                  .close()
                              }
                            >
                              بستن
                        </button>
                      </div>
                    </form>
                  </div>
                </dialog>
                <div
                  className="flex justify-center items-center rounded-lg w-68 h-10 cursor-pointer"
                  style={{
                    background: entry.fourth_color,
                  }}
                  onClick={() => openModal(`modal_${entry.id}_fourth`)}
                >
                  <p className="relative w-full h-full flex justify-center items-center text-white text-sm">
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
                    {digitsEnToFa(entry.fourth_story)}
                  </p>
                </div>
                <dialog id={`modal_${entry.id}_fourth`} className="modal">
                  <div className="modal-box w-full h-80 flex flex-col justify-center items-center">
                    <form action="" className="w-full h-full flex flex-col justify-around items-center">
                      <EditText 
                      // style={{ width: '100%', }}
                      id={entry.fourth_story} 
                      name={entry.fourth_story} 
                      defaultValue={digitsEnToFa(entry.fourth_story)}
                      // showEditButton
                      // editButtonProps={{style: { width: 20 }}}
                      />
                      <EditTextarea 
                      rows={6}
                      // className="max-h-full text-right flex"
                      id={entry.fourth_explanation}
                      name={entry.fourth_explanation}
                      defaultValue={digitsEnToFa(entry.fourth_explanation)}
                      showEditButton
                      />
                      <div className="w-full flex justify-end items-center">
                        <button
                              className="w-16 h-11 bg-slate-300 flex justify-center items-center rounded-lg text-black hover:bg-slate-400
                              outline-none"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent default behavior
                                document.getElementById(`modal_${entry.id}_fourth`).close();
                              }}
                            >
                              بستن
                        </button>
                      </div>
                    </form>
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

export { ContentCalender };
