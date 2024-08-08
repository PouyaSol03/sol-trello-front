import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dialog from "../../components/Dialog/Dialog";
import Modal from "react-modal";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;  // Ensure this is defined in your .env file and loaded correctly

// Make sure to set the app element for accessibility
Modal.setAppElement("#root");

const Taskmanage = () => {
  const [username, setUsername] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: "",
    title: "",
    description: "",
    deadLine: null,
    label: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    fetchAuthData();
  }, []);

  const fetchAuthData = () => {
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        setUsername(authData.username || "کاربر");
        setIsStaff(authData?.is_staff);
      } catch (error) {
        console.error("Error parsing authData:", error);
        setUsername("کاربر");
      }
    } else {
      setUsername("کاربر");
    }
  };

  const fetchUsers = () => {
    if (!authToken) {
      console.error("Authentication token is not available.");
      return;
    }

    axios
      .get(`${apiUrl}/api/user/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error.response?.data);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isStaff) {
      alert("فقط ادمین دسترسی به ساخت تسک دارد!");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/task/task-create/`, 
        formData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log(response.data);
      alert("Task created successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error("Failed to create task:", error.response?.data);
      alert("Error creating task");
    }
  };

  const OpenModal = () => {
    fetchUsers(); // Fetch users only when the modal is about to open
    setOpenModal(true);
  };

  const CloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <section className="h-screen bg-slate-100 p-4 flex flex-col justify-start items-center">
        <header className="container h-auto p-3 flex justify-between items-center shadow-lg rounded-lg">
          <div className="flex justify-center items-center gap-4">
            <h2 className="text-xl">مدیریت تسک ها</h2>
            <Link className="hover:text-slate-600" to="/dashboard">
              داشبورد
            </Link>
          </div>
          <div className="flex justify-center items-center gap-2">
            <p>نام کاربری:</p>
            <p>{username}</p>
          </div>
        </header>

        {isStaff && (
          <div
            className="fixed bg-red-600 w-20 h-20 rounded-full bottom-10 right-32 flex justify-center items-center hover:scale-110 cursor-pointer"
            onClick={OpenModal}
          >
            <svg
              className="w-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="#ffffff"
                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
              />
            </svg>
          </div>
        )}

        {openModal && (
          <Dialog
            className="w-48"
            isOpen={openModal}
            onClose={CloseModal}
            width={500}
            height={"auto"}
          >
            <div className="w-full flex justify-center items-start flex-col gap-2">
              <h2 className="w-full text-center">ایجاد تسک</h2>
              <hr className="w-full" />
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col justify-center items-start gap-2"
              >
                <div className="w-full flex justify-center items-center gap-3">
                  <label className="text-sm">برای:</label>
                  <select
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    className="w-11/12 bg-transparent focus:outline-none border rounded-lg h-10"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full flex justify-center items-center flex-col gap-1">
                  <label className="w-full text-sm">عنوان تسک:</label>
                  <input
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded-lg h-10 focus:outline-none p-2 text-gray-600"
                  />
                </div>
                <div className="w-full flex justify-center items-center flex-col gap-1">
                  <label className="w-full text-sm">توضیحات بیشتر:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded-lg max-h-20 focus:outline-none p-2 bg-transparent text-gray-600"
                  />
                </div>
                <div className="w-full flex justify-center items-center gap-3">
                  <div className="w-1/2 flex flex-col gap-1">
                    <label className="text-sm">تاریخ ددلاین: (اختیاری)</label>
                    <input
                      name="deadLine"
                      type="date"
                      value={formData.deadLine}
                      onChange={handleChange}
                      className="border h-10 flex justify-center items-center rounded-lg focus:outline-none p-2 text-center"
                    />
                  </div>
                  <div className="w-1/2 flex flex-col gap-1">
                    <label className="text-sm">انتخاب لیبل:</label>
                    <select
                      name="label"
                      value={formData.label}
                      onChange={handleChange}
                      className="bg-transparent focus:outline-none border rounded-lg h-10"
                    >
                      {/* Populate with your label options */}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 px-2 py-2 w-full h-10 text-white rounded-lg"
                >
                  ایجاد
                </button>
              </form>
            </div>
          </Dialog>
        )}
      </section>
    </>
  );
};

export { Taskmanage };
