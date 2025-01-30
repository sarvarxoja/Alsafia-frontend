import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export const TaskModal = ({ isOpen, setIsOpen }) => {
  const { id } = useParams();
  const modalRef = useRef(null);
  const [task, setTask] = useState();
  const [date, setDate] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
       await axios.patch(`/employee/assignment/${id}`, {
        task: task,
        date: date,
      });
      toast("Vazifa muvaffaqiyatli biriktirildi", {type: "success"})
      setIsOpen(false)
    } catch (error) {
      console.log(error.response.data.message);
      toast(error.response.data.message, { type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Task</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Kantaktlar soni</label>
          <input
            type="number"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kontaktlar sonini kiriting"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Qaysi kun uchun vazifa belgilamoqchisiz?
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
