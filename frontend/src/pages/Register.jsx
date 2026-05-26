import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required");

      return;
    }

    const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

if (formData.password.length < 6) {
  setError(
  "Password must be at least 6 characters"
);

  return;
}

if (!passwordRegex.test(formData.password)) {
  setError(
  "Password must contain uppercase, number and special character"
);;

  return;
}
setError("");

    try {
      setLoading(true);

      await api.post(
        "/Auth/register",
        formData
      );

      alert("User created successfully");

      navigate("/");

    } catch (error) {
      console.error(error);

      setError(
  error.response?.data ||
  "Register failed"
);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Register
        </h1>
        {
  error && (
    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
      {error}
    </div>
  )
}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Loading..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-4">
          Already have an account?
        </p>

        <Link
          to="/"
          className="block text-center text-blue-600 mt-2"
        >
          Login here
        </Link>

      </div>

    </div>
  );
}

export default Register;