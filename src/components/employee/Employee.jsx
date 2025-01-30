import "./employee.css";
import React, { useEffect, useState } from "react";
import {
  User,
  Phone,
  Calendar,
  Briefcase,
  DollarSign,
  Info,
  Calendar1,
  Webcam,
  Pencil,
} from "lucide-react";
import axios from "axios";
import { BarChart } from "@mui/x-charts";
import { Link, useParams } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";
import { TaskModal } from "../employees/modals/TaskModal";
import { formatDate, formatDateM } from "../../utils/utils";

export const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [dealData, setDealData] = useState([]);
  const [contactData, setContactData] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getDealCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [dateQuery, setDateQuery] = useState(getCurrentDate());
  const [dealDateQuery, setDealDateQuery] = useState(getDealCurrentDate());

  useEffect(() => {
    getEmployee();
  }, [id]);

  async function getEmployee() {
    try {
      let { data } = await axios.get(`/employee/${id}`);
      console.log(data);
      setUser(data.employee);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user?.system_id) {
      fetchStats();
    }
  }, []);

  useEffect(() => {
    if (user?.system_id) {
      const fetchStats = async () => {
        try {
          let { data } = await axios.get(
            `/integration/statistics/${user.system_id}/contact?date=${dateQuery}`
          );
          console.log(data);
          setContactData(data.results);
        } catch (error) {
          setContactData([]);
        }
      };
      fetchStats();
    }
  }, [user?.system_id, dateQuery, dealDateQuery]);

  useEffect(() => {
    if (user?.system_id) {
      const fetchStats = async () => {
        try {
          let { data } = await axios.get(
            `/integration/statistics/${user.system_id}/deals?date=${dealDateQuery}`
          );
          setDealData(data.results);
        } catch (error) {
          setDealData([]);
        }
      };
      fetchStats();
    }
  }, [user?.system_id, dealDateQuery]);

  console.log("a", dealData);

  return (
    <div className=" mx-auto p-8 bg-gray-100 rounded-lg shadow-lg dashboard">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        Foydalanuvchi Profili
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Foydalanuvchi haqida ma'lumot */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pointer">
            Shaxsiy ma'lumotlar
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <User className="w-5 h-5 text-blue-500 mr-3" />
              <span className="font-medium mr-2 pointer">Ismi:</span>{" "}
              {user.name}
            </li>
            <li className="flex items-center">
              <User className="w-5 h-5 text-blue-500 mr-3" />
              <span className="font-medium mr-2 pointer">Familiyasi:</span>{" "}
              {user.lastName}
            </li>
            <li className="flex items-center">
              <Calendar className="w-5 h-5 text-red-500 mr-3 pointer" />
              <span className="font-medium mr-2 pointer">Tug'ilgan sana:</span>
              {formatDate(user.dateOfBirth)}
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 text-orange-500 mr-3" />
              <span className="font-medium pointer mr-2">Telefon:</span>
              {user.phoneNumber}
            </li>
          </ul>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-white px-4 py-2  hover:bg-blue-600 transition mt-4 pointer"
          >
            Create Task
          </button>
        </div>

        {/* Ishga oid ma'lumotlar */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pointer">
            Ishga oid ma'lumotlar
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Briefcase className="w-5 h-5 text-green-500 mr-3 pointer" />
              <span className="font-medium mr-2 pointer">Lavozim:</span> {user.position}
            </li>
            <li className="flex items-center">
              <Calendar className="w-5 h-5 text-purple-500 mr-3 pointer" />
              <span className="font-medium mr-2 pointer">Ishga kirgan sana:</span>
              {formatDate(user.dateOfEmployment)}
            </li>
            <li className="flex items-center">
              <DollarSign className="w-5 h-5 text-yellow-500 mr-3 pointer" />
              <span className="font-medium mr-2 pointer">Maosh turi:</span>
              {user.salaryType === "stable" ? "Barqaror" : "Foizli"}
            </li>
            <li className="flex items-center">
              <Webcam className="w-5 h-5 text-yellow-500 mr-3 pointer" />
              <span className="font-medium mr-2 pointer">Online:</span>
              <span>{formatDateM(user.lastLogin)}</span>
            </li>
            <li>
              <span className="font-medium mr-2 pointer">Dashboard:</span>
              <Link to={`dashboard/${user.system_id}`} className="staff_dashboard_link">Link</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Izoh</h2>
        <p className="bg-white p-4 rounded-lg shadow-md text-gray-600 chart_width">
          <Info className="w-5 h-5 inline-block text-gray-400 mr-2" />
          {user.comment ? user.comment : "Izoh yo'q"}
        </p>
      </div>
      <div className="max-w-md p-4 bg-white shadow-md rounded-lg mt-3">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Kontaktlar statistikasi
        </h2>
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <input
            type="date"
            value={dateQuery}
            onChange={(e) => setDateQuery(e.target.value)}
            className="flex-grow p-2 outline-none text-gray-700"
          />
          <div className="p-2 bg-blue-500 text-white">
            <Calendar1 size={20} />
          </div>
        </div>
        {dateQuery && (
          <p className="mt-2 text-sm text-gray-600">
            Tanlangan sana: {new Date(dateQuery).toLocaleDateString()}
          </p>
        )}
      </div>
      {contactData.length ? (
        <div className="mt-6">
          {contactData.map((e, index) => {
            return (
              <div className="bg-white p-4 rounded-lg shadow-md text-gray-600 mt-2 chart_width">
                <div className="flex flex-wrap">
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: [
                          "Bog'lanilganlar soni",
                          "Bog'lanilmaganlar soni",
                          "Berilgan kontaktlar",
                        ],
                      },
                    ]}
                    series={[
                      {
                        data: [
                          parseFloat(e.connected),
                          parseFloat(e.notConnected),
                          parseFloat(e.totalContacts),
                        ],
                      },
                      {
                        data: [
                          parseFloat(e.connected),
                          parseFloat(e.notConnected),
                          parseFloat(e.totalContacts),
                        ],
                      },
                      {
                        data: [
                          parseFloat(e.connected),
                          parseFloat(e.notConnected),
                          parseFloat(e.totalContacts),
                        ],
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </div>
                {formatDateM(e.createdAt)}
              </div>
            );
          })}
        </div>
      ) : null}
      <div className="max-w-md p-4 bg-white shadow-md rounded-lg mt-3">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Sotuvlar statistikasi
        </h2>
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <input
            type="date"
            value={dealDateQuery}
            onChange={(e) => setDealDateQuery(e.target.value)}
            className="flex-grow p-2 outline-none text-gray-700"
          />
          <div className="p-2 bg-blue-500 text-white">
            <Calendar1 size={20} />
          </div>
        </div>
        {dealDateQuery && (
          <p className="mt-2 text-sm text-gray-600">
            Tanlangan sana: {new Date(dealDateQuery).toLocaleDateString()}
          </p>
        )}
      </div>
      {dealData.length ? (
        <div className="mt-6">
          {dealData.map((e, index) => {
            const totalSales = parseFloat(
              e.totalSales.replace(/[^0-9.-]+/g, "")
            );
            const soldPercentage = parseFloat(e.percentage.replace("%", ""));

            return (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md text-gray-600 mt-2 flex chart_width"
              >
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: 100 - soldPercentage,
                          label: `Sotilgan ${soldPercentage}%`,
                        },
                        {
                          id: 1,
                          value: 100 - soldPercentage,
                          label: `Sotilmagan ${100 - soldPercentage}%`,
                        },
                      ],
                      outerRadius: 100,
                      paddingAngle: 5,
                    },
                  ]}
                  width={520}
                  height={200}
                />
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: Number(
                            e.totalSales.replace(/\s/g, "").replace("UZS", "")
                          ),
                          label: `Sotilgan narx ${e.totalSales}`,
                        },
                        {
                          id: 1,
                          value: Number(e.totalDeals),
                          label: `Sotuvlar soni ${e.totalDeals}`,
                        },
                      ],
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 5,
                    },
                  ]}
                  width={720}
                  height={200}
                />
                {formatDateM(e.createdAt)}
              </div>
            );
          })}
        </div>
      ) : null}
      {isOpen && <TaskModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};
