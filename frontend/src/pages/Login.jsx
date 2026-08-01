
import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [companyName, setCompanyName] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch existing tenants for Member to join
  useEffect(() => {
    if (!isLogin && role === "Member") {
      fetchTenants();
    }
  }, [isLogin, role]);

  const fetchTenants = async () => {
    try {
      const { data } = await API.get("/tenants/all");
      setTenants(data.tenants);
    } catch (error) {
      console.error("Error fetching tenants");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // LOGIN
        const { data } = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/notes");
      } else {
        // REGISTER
        const payload = {
          name,
          email,
          password,
          role,
          ...(role === "Admin"
            ? { companyName }
            : { tenantId: selectedTenant }),
        };

        const { data } = await API.post("/auth/register", payload);
        setSuccess("Registered successfully! Please login.");
        setIsLogin(true);
        resetForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isLogin ? "Login failed" : "Registration failed")
      );
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("Member");
    setCompanyName("");
    setSelectedTenant("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {/* Register Fields */}
        {!isLogin && (
          <>
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              required
            />

            {/* Role Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                I want to:
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole("Admin")}
                  className={`flex-1 py-2 rounded border font-semibold text-sm ${
                    role === "Admin"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  Create Company
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("Member");
                    fetchTenants();
                  }}
                  className={`flex-1 py-2 rounded border font-semibold text-sm ${
                    role === "Member"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  Join Company
                </button>
              </div>
            </div>

            {/* Admin: Company Name */}
            {role === "Admin" && (
              <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
                required
              />
            )}

            {/* Member: Select Existing Tenant */}
            {role === "Member" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Select Company:
                </label>
                <select
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">-- Select a company --</option>
                  {tenants.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Success */}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isLogin ? "Login" : role === "Admin" ? "Create & Register" : "Join & Register"}
        </button>

        {/* Toggle */}
        <p className="text-center text-sm mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
              resetForm();
            }}
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}