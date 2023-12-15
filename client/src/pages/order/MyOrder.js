import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserOrderAsync,
  selectUserOrder,
} from "../../redux/features/auth/authSlice";
import { discountedPrice } from "../../app/constants";
import { selectOrderStatus } from "../../redux/features/order/orderSlice";
import { ThreeCircles } from "react-loader-spinner";

const MyOrder = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrder);
  const status = useSelector(selectOrderStatus);
  useEffect(() => {
    dispatch(getUserOrderAsync());
  }, [dispatch]);
  return (
    <div>
      <h2 className="text-4xl max-w-7xl mt-6 font-bold mx-auto text-gray-800">
        My Orders
      </h2>
      {status === "loading" && (
        <ThreeCircles
          height="100"
          width="100"
          color="#4fa94d"
          visible={true}
          ariaLabel="three-circles-rotating"
          wrapperClass="grid place-content-center pt-5"
        />
      )}
      {orders &&
        orders.map((order) => (
          <div className="mx-auto mt-12  bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Order # {order.id}
              </h2>
              <h3 className="text-2xl font-bold tracking-tight text-red-900">
                Order Status : {order.status}
              </h3>
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {order.products.map((product) => (
                      <li key={product.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={product.product.imageSrc}
                            alt={product.product.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <p>{product.name}</p>
                              </h3>
                              <p className="ml-4">
                                ${discountedPrice(product.product)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.brand}
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">
                              <label
                                htmlFor="quantity"
                                className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                              >
                                Qty:{product.quantity}
                              </label>
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${order.totalAmount}</p>
                </div>
                <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                  <p>Total Items in Order</p>
                  <p>{order.totalItems} items</p>
                </div>
                <p className="mt-2 text-sm text-gray-500">Shipping Address :</p>
                <div className="flex justify-between gap-x-6 py-5 px-3 border-solid border-2 border-gray-200">
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {order.selectedAddress.name}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {order.selectedAddress.address}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {order.selectedAddress.pinCode}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">
                      Phone: {order.selectedAddress.phone}
                    </p>
                    <p className="text-sm leading-6 text-gray-900">
                      {order.selectedAddress.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MyOrder;
