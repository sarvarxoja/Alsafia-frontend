import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { BarChart2, Users, Package, DollarSign } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { GlobalLoader } from "../loader/GlobalLoader";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    tooltip: { enabled: true },
  },
};

const Card = ({ background, title, value, icon: Icon }) => (
  <div
    className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    style={{ background: background }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-semibold mt-2 text-gray-800">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-blue-50">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
);

export const Products = () => {
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const [employeesData, setEmployeesData] = useState();

  useEffect(() => {
    getProductsData();
    getEmployeesData();
  }, []);

  async function getProductsData() {
    try {
      let { data } = await axios.get("/dashboard");
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getEmployeesData() {
    try {
      let { data } = await axios.get("/employees/dashboard");
      setEmployeesData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  }

  const chartData = {
    labels: ["Mavjud mahsulotlar soni"],
    datasets: [
      {
        data: [data.totalRemainingAmount],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  if (load) {
    return <GlobalLoader />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 dashboard">
      <div className="mb-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card
            title="Jammi maxsulotlar"
            value={data.totalProducts || 0}
            icon={Package}
            background={"#FFE0B2"}
          />
          <Card
            title="Shu yillik sotuvlar"
            value={data.yearlySales || 0}
            icon={BarChart2}
            background={"#C5E1A5"}
          />
          <Card
            title="Xaftalik sotuvlar"
            value={data.weeklySales || 0}
            icon={Users}
            background={"#E1BEE7"}
          />
          <Card
            title="Kunlik sotuvlar"
            value={data.dailySales || 0}
            icon={DollarSign}
            background={"#B2DFDB"}
          />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-">
        <div className="h-[400px] flex items-center justify-center text-gray-500 border border-dashed border-gray-200 rounded-lg pb-2">
          <Pie data={chartData} options={options} />
        </div>
      </div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 mt-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Xodimlar haqida ma'lumot
        </h1>

        <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
          <p className="text-lg text-gray-800">
            Umumiy xodimlar soni:{" "}
            <span className="font-bold">{employeesData?.totalEmployees}</span>
          </p>
          <div className="mt-4">
            <p className="text-lg text-gray-800 font-semibold">
              Umumiy lavozimlar:
            </p>
            {employeesData ? (
              <ul className="list-disc list-inside text-gray-700">
                {Object.entries(employeesData.positionCounts).map(
                  ([position, count]) => (
                    <li key={position} className="mt-1">
                      {position}: <span className="font-medium">{count}</span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-600">Lavozimlar yo'q</p>
            )}
          </div>
          <div className="mt-6">
            <p className="text-lg text-gray-800 font-semibold">
              To'lov usullari bo'yicha ma'lumot:
            </p>
            {employeesData ? (
              <ul className="list-disc list-inside text-gray-700">
                {Object.entries(employeesData.salaryTypeCounts).map(
                  ([type, count]) => (
                    <li
                      key={type}
                      className={`mt-1 ${
                        type === "stable"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      } p-2 rounded-md`}
                    >
                      {count} kishi {type === "stable" ? "foiz" : "oylik"} da
                      oylik oladi
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-600">Ma'lumot yo'q</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
