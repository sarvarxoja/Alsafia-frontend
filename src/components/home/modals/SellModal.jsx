import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { ChevronDown, Edit } from "lucide-react";

export const SellModal = ({
  totalPrice,
  selectedProduct,
  closeModal,
  quantity,
  setQuantity,
  setTotalPrice,
  setData,
}) => {
  const [selError, setSellError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [customInput, setCustomInput] = useState("");

  console.log(selectedProduct)

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    if (selectedProduct) {
      setTotalPrice(newQuantity * selectedProduct.price);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const priceToSend =
      selectedOption === "other" ? customInput : selectedOption;

    console.log(priceToSend);

    try {
      await axios.patch(`/products/sell/${selectedProduct.id}`, {
        amount: quantity,
        price: priceToSend, // here, priceToSend is either selectedOption or customInput
      });
      closeModal();
      setData((prevData) =>
        prevData.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
                remainingAmount: Number(product.remainingAmount) - Number(quantity),
                quantitySold: Number(product.quantitySold) + Number(quantity),
                revenue: Number(product.revenue) + Number(priceToSend),
              }
            : product
        )
      );
      toast("The product has been updated successfully", { type: "success" });
    } catch (error) {
      setSellError(error.response.data);
    }
  };
  const options = [
    {
      value: selectedProduct?.price?.[0],
      label: `Standart narx (${selectedProduct?.price?.[0]})`,
    },
    {
      value: selectedProduct?.price?.[1],
      label: `Chegirmali narx (${selectedProduct?.price?.[1]})`,
    },
    { value: "other", label: "Boshqa" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-md w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">{selectedProduct?.name}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">
              Miqdor
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
          <div className="relative">
            <select
              value={selectedOption}
              required
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full appearance-none border border-gray-300 rounded-md p-2 pr-10 text-gray-700 focus:outline-none mb-2"
            >
              <option value="" disabled>
                Select an option
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={20} />
            </div>
          </div>

          {selectedOption === "other" && (
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <div className="p-2 bg-blue-500 text-white">
                <Edit size={20} />
              </div>
              <input
                type="number"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Narxni kiriting"
                className="flex-grow p-2 outline-none text-gray-700"
              />
            </div>
          )}
          <div className="mb-4 text-red-600 sel_error">
            {selError ? (
              <span>
                Mahsulot yetarli emas siz so'rayotgan miqdor:{" "}
                {selError.requestedAmount}, mahsulotning miqdori:{" "}
                {selError.availableAmount}
              </span>
            ) : (
              ""
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Sotish
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
