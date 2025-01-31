import "./login.css";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from "../../../../public/logo.png";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";

const Login = ({ access }) => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (access === true) {
      navigate("/home");
    }
  }, [access]);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      let { data } = await axios.post("/auth/login", formData);
      console.log(data);
      if (data.status === 200) {
        if (data.role === "hr") {
          navigate("/employees");
          // window.location.reload();
        } else {
          navigate("/home");
          // window.location.reload();
        }
      }
    } catch (error) {
      console.log(error);
      // toast(error.response.data.msg, { type: "error" });
    } finally {
      setLoad(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center main_auth_container">
      <div className="w-full max-w-md mx-4 bg-white/70 backdrop-blur shadow-xl rounded-xl login_form">
        <div className="p-6 space-y-1 flex flex-col items-center border-b">
          <img src={Logo} alt="Logo" className="alsafia_logo" />
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Telefon raqamingizni kiriting"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Parolni kiriting"
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              disabled={load}
              type="submit"
              className="w-full enter_btn text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 transition-colors"
            >
              {load ? <span className="loader_login"></span> : "Kirish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
