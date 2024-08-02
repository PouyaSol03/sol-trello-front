import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        password,
        email: email || undefined, // Make email optional
      });

      if (response.status === 201) {
        const { access, refresh, username, is_staff } = response.data;
        const authData = {
          access,
          refresh,
          username,
          is_staff,
        };
        localStorage.setItem("authData", JSON.stringify(authData));
        navigate("/dashboard");
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      if (err.response && err.response.data) {
        const errorMsg = Object.values(err.response.data).join(' ');
        setError(errorMsg || "Registration failed. Please check your details and try again.");
      } else {
        setError("Registration failed. Please check your details and try again.");
      }
    }
  };

  return (
    <main className="flex justify-center w-full h-screen items-center text-blue-50">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            ثبت نام
          </h2>
        </div>
        {error && <p className="block text-red-500 mb-4">{error}</p>}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                نام کاربری
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-slate-200 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ایمیل (اختیاری)
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-200 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                رمز عبور
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-200 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                تکرار رمز عبور
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-slate-200 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                ثبت نام
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            حساب کاربری دارید؟
            <a
              href="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              وارد شوید
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export { Register };
