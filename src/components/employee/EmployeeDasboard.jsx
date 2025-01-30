import axios from "axios";
import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "react-toastify";
import { BarChart } from "@mui/x-charts";

// Chart.js kerakli modullarini ro'yxatdan o'tkazish
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const DatePickerPage = () => {
  const { system_id } = useParams();
  const [load, setLoad] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [allStat, setAllStat] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [dateResult, setDateResult] = useState(null);

  useEffect(() => {
    getAllStatistics();
  }, [system_id]);

  async function getAllStatistics() {
    try {
      let { data } = await axios.get(
        `/integration/all/statistics/data/${system_id}`
      );
      setAllStat(data.statisticsData);
    } catch (error) {
      console.log(error);
    }
  }

  // Chart uchun ma'lumotlarni tayyorlash
  const chartData = {
    labels: allStat.map((stat) =>
      new Date(stat.createdAt).toLocaleDateString()
    ), // X o'qi uchun sana
    datasets: [
      {
        label: "Connected",
        data: allStat.map((stat) => stat.connected), // Y o'qi uchun connected ma'lumotlari
        borderColor: "rgba(75, 192, 192, 1)", // Chiziq rangi
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Chiziq orqa fon rangi
        tension: 0.1, // Chiziq egri bo'lishi uchun
      },
      {
        label: "Not Connected",
        data: allStat.map((stat) => stat.notConnected), // Y o'qi uchun notConnected ma'lumotlari
        borderColor: "rgba(255, 99, 132, 1)", // Chiziq rangi
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Chiziq orqa fon rangi
        tension: 0.1,
      },
    ],
  };

  async function getStatsByDate() {
    setLoad(true);
    try {
      if (startDate.length === 0 && startDate.length === 0) {
        return toast("Malumotlarni kiritmadingiz", { type: "error" });
      }

      if (startDate.length === 0) {
        return toast("Boshlanish sanasini kiritmadingiz", { type: "error" });
      }

      if (endDate.length === 0) {
        return toast("Tugash sanasini kiritmadingiz", { type: "error" });
      }

      let { data } = await axios.post(
        `/integration/statistic/long/${system_id}`,
        {
          startDate: startDate,
          endDate: endDate,
        }
      );

      console.log(data);
      setDateResult(data);
    } catch (error) {
      setDateResult([]);
    } finally {
      setLoad(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dashboard">
      <div className="max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sana tanlash</h1>
        <div className="gap-7 flex">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Boshlanish sanasi
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tugash sanasi
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative mt-3">
              <button
                disabled={load}
                onClick={getStatsByDate}
                className="select-none w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                {load ? <span className="loader_login"></span> : "Yuborish"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {dateResult ? (
        <div className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-gray-600 mt-2 chart_width">
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
                    parseFloat(dateResult.completedTasks),
                    parseFloat(dateResult.pendingTasks),
                    parseFloat(dateResult.totalTasks),
                  ],
                },
                {
                  data: [
                    parseFloat(dateResult.completedTasks),
                    parseFloat(dateResult.pendingTasks),
                    parseFloat(dateResult.totalTasks),
                  ],
                },
                {
                  data: [
                    parseFloat(dateResult.completedTasks),
                    parseFloat(dateResult.pendingTasks),
                    parseFloat(dateResult.totalTasks),
                  ],
                },
              ]}
              width={500}
              height={300}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md text-gray-600 mt-2 chart_width">
          <span className="block mt-[100px] mb-[100px] text-center">
            Malumot topilmadi
          </span>
        </div>
      )}
      {allStat.length > 0 && (
        <div className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-gray-600 mt-2 chart_width">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: { display: true, text: "Statistika" },
                  legend: { position: "top" },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
