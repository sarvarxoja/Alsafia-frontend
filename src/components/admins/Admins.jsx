import axios from "axios";
import { formatDate } from "../../utils/utils";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  X,
  Edit2,
  Trash2,
  SquareArrowOutUpRight,
  EyeOff,
  Eye,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DeleteModal } from "../home/modals/DeleteModal";
import { toast } from "react-toastify";
import { AdminUpdateModal } from "./modal/Update";

export const Admins = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    password: "",
    phoneNumber: "",
    role: "",
  });
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [salaryType, setSalaryType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    getEmployees();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  const handleScroll = () => {
    const bottom =
      document.documentElement.scrollHeight ===
      document.documentElement.scrollTop + window.innerHeight;
    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  async function getEmployees() {
    try {
      const { data } = await axios.get(`/admin/all?limit=8&page=${page}`);
      setData((prevData) => [...prevData, ...data.admins]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", formData);
      getEmployees();
      setIsModalOpen(false);
    } catch (error) {
      toast(error.response.data.message, { type: "error" });
    }
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    try {
      if (value === "") {
        getEmployees(); // Refresh with position filter
      } else {
        let { data } = await axios.get(
          `/admin/search?query=${value}&type=name`
        );
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteAdmin = async () => {
    try {
      await axios.delete(`/admin/delete/${selectedAdmin.id}`);
      toast("the admin has been successfully uninstalled", {
        type: "success",
      });
      setData((prevData) =>
        prevData.filter((admin) => admin.id !== selectedAdmin.id)
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  const openEditModal = (employee) => {
    setSelectedAdmin(employee);
    setName(employee.name);
    setLastName(employee.lastName);
    setRole(employee.role);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 dashboard">
      {/* Header section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Adminlar</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi admin</span>
          </button>
        </div>
      </div>
      {/* Search and filter section */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Xodimni qidiring"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleSearchInputChange}
          />
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        </div>
      </div>
      {/* Table section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 pointer">
                Ismi va familia
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 pointer">
                Lavozim
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 pointer">
                Telefon
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 pointer">
                Tug'ilgan sanasi
              </th>

              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 pointer">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((admin, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center pointer">
                        <span className="text-blue-600 font-medium">
                          {admin.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 pointer">
                        {admin.name} {admin.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 pointer">
                  {admin.role}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 pointer">
                  {admin.phoneNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 pointer">
                  {formatDate(admin.lastLogin)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openEditModal(admin)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => openDeleteModal(admin)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link to={`/admin/${admin.id}`}>
                      <SquareArrowOutUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Yangi admin qo'shish</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg border border-gray-200"
                  placeholder="Ismi"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg border border-gray-200"
                  placeholder="Familiasi"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg border border-gray-200"
                  placeholder="Telefon"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg border border-gray-200"
                  required
                >
                  <option value="" disabled selected>
                    Lavozimlar
                  </option>
                  <option value="hr">HR</option>
                  <option value="pm">Product manager</option>
                </select>
              </div>
              <div className="mt-4 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Parolni kiriting"
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                  value={formData.password}
                  onChange={handleInputChange}
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
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Yopish
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          handleDelete={handleDeleteAdmin}
          closeDeleteModal={closeDeleteModal}
          selectedData={selectedAdmin}
        />
      )}
      
      {isEditModalOpen && (
        <AdminUpdateModal
          closeModal={closeModal}
          name={name}
          setName={setName}
          lastName={lastName}
          setLastName={setLastName}
          role={role}
          setRole={setRole}
          selectedData={selectedAdmin}
          setData={setData}
        />
      )}
    </div>
  );
};
