import axios from "axios";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export const AdminUpdateModal = ({
  closeModal,
  name,
  setName,
  lastName,
  setLastName,
  role,
  setRole,
  selectedData,
  setData,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminUpdate = async (e) => {
    e.preventDefault();

    // Prepare the request data
    const updateData = {
      name: name,
      lastName: lastName,
      role: role,
    };

    // Only include the password if it's not empty
    if (password.length > 0) {
      updateData.password = password;
    }

    try {
      await axios.patch(`/admin/update/${selectedData.id}`, updateData);
      setData((prevData) =>
        prevData.map((admin) =>
          admin.id === selectedData.id
            ? {
                ...admin,
                name: name,
                lastName: lastName,
                role: role,
              }
            : admin
        )
      );
      closeModal();
      toast("The product has been updated successfully", { type: "success" });
    } catch (error) {
      toast(error.response.data.message, { type: "error" });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-md w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">Admin Yangilash</h3>
        <form onSubmit={handleAdminUpdate}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Ismi
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-2">
              Familiasi
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block mb-2">
              Roli
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200"
            >
              <option value="hr">HR</option>
              <option value="pm">PM</option>
            </select>
          </div>
          <div className="mt-4 relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Parolni kiriting"
              className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none mb-4 focus:ring-2 focus:ring-blue-500 bg-white/90"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Yangilash
          </button>
        </form>
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  );
};
