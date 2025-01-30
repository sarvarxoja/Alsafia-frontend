import axios from "axios";
import { formatDate } from "../../utils/utils";
import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Download,
  X,
  Edit2,
  Trash2,
  SquareArrowOutUpRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { DeleteModal } from "../home/modals/DeleteModal";
import { EmployeeUpdateModal } from "./modals/UpdateEmployee";
import InfiniteScroll from "react-infinite-scroll-component";

export const Staff = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    position: "",
    dateOfEmployment: "",
    phoneNumber: "",
    dateOfBirth: "",
    parentName: "",
    salaryType: "stable",
    comment: "",
  });
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [salaryType, setSalaryType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [createLoad, setCreateLoad] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const getEmployees = async (position = "", newPage = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      let url = `/employee/get/all?limit=8&page=${newPage}`;
      if (position) {
        url = `/employee/data/search?query=${position}&type=position&page=${newPage}`;
      }
      const { data: responseData } = await axios.get(url);
      const formattedData = position ? responseData : responseData.data;

      setData((prevData) =>
        newPage === 1 ? formattedData : [...prevData, ...formattedData]
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees(selectedPosition, page);
  }, [page, selectedPosition]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (createLoad) return;
    setCreateLoad(true);
    try {
      let { data } = await axios.post("/employee/create", formData);
      setData((prevData) => [data.createdData, ...prevData]);
      setIsModalOpen(false);
      toast("employee created successfully", { type: "success" });
    } catch (error) {
      toast(error.response.data.message, { type: "error" });
    } finally {
      setCreateLoad(false);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await axios.get("/employee/download/data", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employees.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    try {
      if (value === "") {
        getEmployees(selectedPosition); // Refresh with position filter
      } else {
        let { data } = await axios.get(
          `/employee/data/search?query=${value}&type=name`
        );
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePositionChange = (e) => {
    const position = e.target.value;
    setSelectedPosition(position);
  };

  const openDeleteModal = (product) => {
    setSelectedEmployee(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteEmployee = async () => {
    try {
      await axios.delete(`/employee/delete/${selectedEmployee.id}`);
      toast("the product has been successfully uninstalled", {
        type: "success",
      });
      setData((prevData) =>
        prevData.filter((product) => product.id !== selectedEmployee.id)
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
    setSelectedEmployee(employee);
    setName(employee.name);
    setLastName(employee.lastName);
    setPosition(employee.position);
    setSalaryType(employee.salaryType);
    setPhoneNumber(employee.phoneNumber);
    setIsEditModalOpen(true);
  };

  console.log(page);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 dashboard">
      {/* Header section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Xodimlar</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi xodim</span>
          </button>
          <button
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => downloadExcel()}
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
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
        <select
          value={selectedPosition}
          onChange={handlePositionChange}
          className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Barcha lavozimlar</option>
          <option value="operator">Operator</option>
          <option value="GenDirektor">GenDirektor</option>
          <option value="Operatsion Direktor">Operatsion Direktor</option>
          <option value="Menejer">Menejer</option>
          <option value="HR">HR</option>
          <option value="SMM">SMM</option>
          <option value="Dasturchi">Dasturchi</option> pointer
          <option value="Targetolog">Targetolog</option>
          <option value="Yetkazuvchi">Yetkazuvchi</option>
          <option value="Rob">Rob</option>
          <option value="Loyihachi">Loyihachi</option>
          <option value="Kontrol Menejer">Kontrol Menejer</option>
          <option value="Operator">Operator</option>
          <option value="Farosh">Farrosh</option>
        </select>
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
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 pointer">
                Ish haqi turi
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 pointer">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((staff, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center pointer">
                        <span className="text-blue-600 font-medium">
                          {staff.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 pointer">
                        {staff.name}{" "}
                        {staff.lastName === "unknown" ? "" : staff.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 pointer">
                  {staff.position}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 pointer">
                  {staff.phoneNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 pointer">
                  {formatDate(staff.dateOfBirth)}
                </td>
                <td className="px-6 py-4 pointer">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${"bg-green-100 text-green-800"}`}
                  >
                    {staff.salaryType === "stable"
                      ? "Oylik"
                      : staff.salaryType === "stable_and_percentage"
                      ? "Oylik va foizda"
                      : staff.salaryType === "percentage"
                      ? "Foizda"
                      : "unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openEditModal(staff)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => openDeleteModal(staff)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link to={`/employee/${staff.id}`}>
                      <SquareArrowOutUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <InfiniteScroll
          dataLength={data.length} // Length of the current data array
          next={() => setPage(page + 1)} // Function to load next page
          hasMore={!loading} // Disable infinite scroll while loading
          endMessage={<p style={{ textAlign: "center" }}>No more employees</p>}
        />
        {loading && <div className="ml-4 mt-2 mb-2">Loading...</div>}
      </div>

      {/* Modal */}
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
              <h2 className="text-xl font-semibold">Yangi xodim qo'shish</h2>
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
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg border border-gray-200"
                  placeholder="Familiasi"
                  required
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
                  required
                />
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled selected>
                    Lavozimlar
                  </option>
                  <option value="GenDirektor">GenDirektor</option>
                  <option value="Operatsion Direktor">
                    Operatsion Direktor
                  </option>
                  <option value="Menejer">Menejer</option>
                  <option value="HR">HR</option>
                  <option value="SMM">SMM</option>
                  <option value="Dasturchi">Dasturchi</option>
                  <option value="Targetolog">Targetolog</option>
                  <option value="Yetkazuvchi">Yetkazuvchi</option>
                  <option value="Rob">Rob</option>
                  <option value="Loyihachi">Loyihachi</option>
                  <option value="Kontrol Menejer">Kontrol Menejer</option>
                  <option value="Operator">Operator</option>
                  <option value="Farosh">Farrosh</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Ishga qabul qilingan sana
                  </label>
                  <input
                    type="date"
                    name="dateOfEmployment"
                    value={formData.dateOfEmployment}
                    onChange={handleInputChange}
                    className="px-4 py-2 rounded-lg border border-gray-200 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Tug'ilgan sana
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="px-4 py-2 rounded-lg border border-gray-200 w-full"
                  />
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  placeholder="Otasining ismi"
                />
              </div>
              <div className="mt-4">
                <select
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                >
                  <option value="stable">Stabil (oylik)</option>
                  <option value="percentage">Foizda</option>
                  <option value="stable_and_percentage">
                    Stabil (oylik) va foizda
                  </option>
                </select>
              </div>
              <div className="mt-4">
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  placeholder="Izoh"
                />
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
          handleDelete={handleDeleteEmployee}
          closeDeleteModal={closeDeleteModal}
          selectedData={selectedEmployee}
        />
      )}

      {isEditModalOpen && (
        <EmployeeUpdateModal
          closeModal={closeModal}
          name={name}
          setName={setName}
          lastName={lastName}
          setLastName={setLastName}
          position={position}
          setPosition={setPosition}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          salaryType={salaryType}
          setSalaryType={setSalaryType}
          selectedData={selectedEmployee}
          setData={setData}
        />
      )}
    </div>
  );
};
