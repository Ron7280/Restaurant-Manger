import { useLocation } from "react-router-dom";

const OrderPage = () => {
  const location = useLocation();
  const order = location.state?.order || [];

  const totalPrice = order.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const uniqueGroups = order.length;

  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <div
        className="w-[40%] h-[80%] bg-white shadow-lg text-black shadow-black
       rounded-2xl p-3 justify-between flex flex-col"
      >
        <div className="flex h-[80%] flex-col gap-3">
          <div className="font-bold text-xl w-full text-center ">
            Your Order
          </div>
          <div
            className="flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-mainColor
          h-full pr-2 scrollbar-track-transparent"
          >
            {order.length === 0 && (
              <div className="text-gray-500">No items selected.</div>
            )}

            {order.map((item) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-gray-200"
              >
                {/* Header Row */}
                <div className="grid grid-cols-4 font-bold text-gray-700 text-sm pb-1 border-b">
                  <div>Order</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-center">Price</div>
                  <div className="text-right">Total</div>
                </div>

                {/* Item Row */}
                <div className="grid grid-cols-4 items-center text-lg text-gray-800">
                  <div className="font-semibold">{item.name}</div>

                  <div className="text-center text-gray-600">{item.qty}</div>

                  <div className="text-center text-gray-600">
                    ${item.price.toFixed(2)}
                  </div>

                  <div className="text-right font-bold text-emerald-600">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            {order.map((item) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-gray-200"
              >
                {/* Header Row */}
                <div className="grid grid-cols-4 font-bold text-gray-700 text-sm pb-1 border-b">
                  <div>Order</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-center">Price</div>
                  <div className="text-right">Total</div>
                </div>

                {/* Item Row */}
                <div className="grid grid-cols-4 items-center text-lg text-gray-800">
                  <div className="font-semibold">{item.name}</div>

                  <div className="text-center text-gray-600">{item.qty}</div>

                  <div className="text-center text-gray-600">
                    ${item.price.toFixed(2)}
                  </div>

                  <div className="text-right font-bold text-emerald-600">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-[20%] flex flex-col justify-between">
          <div className="flex justify-between text-lg font-semibold">
            <div>Unique Items :</div>
            <div className="mt-2 font-semibold w-[20%] max-w-[40%] text-center rounded-full bg-red-200 text-black">
              {uniqueGroups}
            </div>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <div>Total :</div>
            <div className="mt-2 font-semibold w-[20%] max-w-[40%] text-center rounded-full bg-red-200 text-black">
              ${totalPrice.toFixed(2)}
            </div>
          </div>

          {order.length > 0 && (
            <button className="mt-4 w-full bg-green-600 text-white p-2 rounded-md">
              Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
