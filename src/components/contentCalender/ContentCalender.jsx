import { useState, useEffect } from "react";

const Header = () => (
  <div className="w-full h-auto flex justify-center items-center px-1 py-2">
    <div className="w-auto h-auto flex justify-start items-center gap-3 bg-transparent overflow-x-auto">
      <div className="flex justify-center items-center rounded-lg w-36 h-10 bg-transparent text-white">
        <p className="text-sm"></p>
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



const ContentCalender = () => {


  return(
    <>
      <section className="w-full h-auto overflow-y-auto p-4">
        <Header/>
        w
      </section>
    </>
  )
}

export { ContentCalender }