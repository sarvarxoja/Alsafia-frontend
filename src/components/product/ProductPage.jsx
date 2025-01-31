import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Edit, Trash, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { GlobalLoader } from "../loader/GlobalLoader";

export const ProductPage = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    getProduct();
  }, []);

  async function getProduct() {
    try {
      let { data } = await axios.get(`/products/single/${id}`);
      setData(data.data);
    } catch (error) {
      toast("an error occurred, please try again later", { type: "error" });
    } finally {
      setLoad(false);
    }
  }

  if (load) {
    return <GlobalLoader />;
  }

  console.log(data)

  return (
    <div className="p-6 bg-gray-100 min-h-screen dashboard">
      {/* Admin ma'lumotlari */}
      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h2 className="text-2xl font-semibold mb-2">Admin Ma'lumotlari</h2>
        <div className="text-gray-700">
          <p>
            <span className="font-bold">Ism: </span>
            {data.Admin?.name}
          </p>
          <p>
            <span className="font-bold">Familiya: </span>
            {data.Admin?.lastName}
          </p>
          <p>
            <span className="font-bold">Telefon raqam: </span>
            {data.Admin?.phoneNumber}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Mahsulot Ma'lumotlari</h2>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={`http://inchain.uz/api${data.productImage}`}
            alt={data.name}
            className="product_image pointer"
          />
          <div>
            <p>
              <span className="font-bold">Nomi: </span>
              {data.name}
            </p>
            <p>
              <span className="font-bold">Narxi: </span>
              {data.price.join(' / ')} {data.currency}
            </p>
            <p>
              <span className="font-bold">Umumiy miqdor: </span>
              {data.totalAmount}
            </p>
            <p>
              <span className="font-bold">Qolgan miqdor: </span>
              {data.remainingAmount}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Amallar tarixi</h3>
        {data.actionsTaken?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 text-left border">#</th>
                  <th className="px-4 py-2 text-left border">Amal</th>
                  <th className="px-4 py-2 text-left border">
                    Admin Ismi Familiasi
                  </th>
                  <th className="px-4 py-2 text-left border">
                    Admin Telefon Raqami
                  </th>
                  <th>Narx</th>
                  <th className="px-4 py-2 text-left border">Vaqt</th>
                </tr>
              </thead>
              <tbody>
                {data.actionsTaken.map((action, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{action.action}</td>
                    <td className="px-4 py-2 border">
                      {action.adminInfo?.name} {action.adminInfo?.lastName}
                    </td>
                    <td className="px-4 py-2 border">
                      {action.adminInfo?.phoneNumber}
                    </td>
                    <td className="px-4 py-2 border">
                      {action.price ? `${action.price} ${data.currency}` : ""}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(action?.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Amallar tarixi mavjud emas.</p>
        )}
      </div>
    </div>
  );
};
