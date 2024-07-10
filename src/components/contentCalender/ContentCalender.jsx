import { useState, useEffect, useMemo } from "react";
import { digitsEnToFa } from "@persian-tools/persian-tools";

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
  // const [expandedEntryId, setExpandedEntryId] = useState(null);

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

  // const toggleDropdown = (id) => {
  //   setExpandedEntryId((prevId) => (prevId === id ? null : id));
  // };

  return (
    <>
      <section className="w-full h-auto overflow-y-auto px-5">
        <div className="w-full h-full flex justify-center items-center mt-4">
          <div className="w-full h-auto flex justify-start items-center gap-4 bg-transparent rounded-full p-2">
            <div
              className="flex justify-center items-center"
              style={{
                background: "transparent",
                padding: "8px",
                width: "200px",
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
              className="flex justify-center items-center rounded-full"
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
                id="accordion-collapse"
                data-accordion="collapse"
                // id="accordionExample"
                className={`w-full h-auto flex justify-start items-center gap-4 rounded-full p-2 ${
                  isBothDay
                    ? "bg-green-300"
                    : isFoodDay
                    ? "bg-rose-300"
                    : isCompanyDay
                    ? "bg-blue-300"
                    : ""
                }`}
              >
                <div
                  className="flex justify-center items-center"
                  style={{
                    background: "transparent",
                    padding: "8px",
                    width: "200px",
                    minHeight: "40px",
                    height: "auto",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                >
                  <p
                    className="w-auto text-black"
                    style={{
                      fontSize: "13px",
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
                  className="flex justify-center items-center rounded-full"
                  style={{
                    background: "#161c40",
                    width: "30px",
                    height: "30px",
                    color: "#fff",
                  }}
                >
                  <p className="text-sm">{digitsEnToFa(entry.day)}</p>
                </div>
                <div class="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      id="menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
                    >
                      {digitsEnToFa(entry.first_story)}
                      <svg
                        className="-mr-1 h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        Account settings
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export { ContentCalender };
