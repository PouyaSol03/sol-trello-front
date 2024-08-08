import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/api/login/`, {
        username,
        password,
      });

      if (response.status === 200) {
        const { access, username: responseUsername, is_staff } = response.data;
        localStorage.setItem("authToken", access);
        const loginResponse = { username: responseUsername, is_staff };
        localStorage.setItem("authData", JSON.stringify(loginResponse));

        // Redirect based on username
        if (responseUsername === "bonito") {
          navigate("/bonito");
        } else {
          navigate("/dashboard"); // Redirect to the default page or dashboard
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      // Handle error response more specifically
      const errorMessage = error.response?.data?.message || "نام کاربری یا رمز عبور اشتباه است";
      console.error("Error during login:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <main className="flex justify-center w-full h-screen items-center bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 text-gray-900">
            ورود
          </h2>
          {error && (
            <p className="w-full text-center text-red-500 mt-4">{error}</p>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900"
              >
                نام کاربری
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full rounded-md sm:text-sm border h-10 px-2"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                رمز عبور
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md sm:text-sm h-10 border px-2"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
            >
              ورود
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export { Login };
