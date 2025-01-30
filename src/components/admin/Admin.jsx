import React, { useEffect, useState } from "react";
import {
  User,
  Phone,
  Briefcase,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

export const AdminProfile = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    getEmployee();
  }, []);

  async function getEmployee() {
    try {
      let { data } = await axios.get(`/admin/get/${id}`);
      setAdmin(data.admin);
      setIsYour(data.isYour);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className=" mx-auto p-8 bg-gray-100 rounded-lg shadow-lg dashboard">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        Foydalanuvchi Profili
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Foydalanuvchi haqida ma'lumot */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Shaxsiy ma'lumotlar
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <User className="w-5 h-5 text-blue-500 mr-3" />
              <span className="font-medium mr-2">Ismi:</span> {admin.name}
            </li>
            <li className="flex items-center">
              <User className="w-5 h-5 text-blue-500 mr-3" />
              <span className="font-medium mr-2">Familiyasi:</span>{" "}
              {admin.lastName}
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 text-orange-500 mr-3" />
              <span className="font-medium mr-2">Telefon:</span>{" "}
              {admin.phoneNumber}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Ishga oid ma'lumotlar
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Briefcase className="w-5 h-5 text-green-500 mr-3" />
              <span className="font-medium mr-2">Lavozim:</span> {admin.role}
            </li>{" "}
          </ul>
        </div>
      </div>
    </div>
  );
};
