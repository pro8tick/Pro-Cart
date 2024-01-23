import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteCartProductAsync,
  selectItems,
  updateProductAsync,
} from "../../redux/features/cart/cartSlice";
import { discountedPrice } from "../../app/constants";
import Modal from "../Modal";
import { useState } from "react";

export default function Cart() {
  const [showModal, setShowModal] = useState(null);
  const dispatch = useDispatch();
  const products = useSelector(selectItems);
  const totalAmount = products.reduce(
    (amount, item) => discountedPrice(item.product) * item.quantity + amount,
    0
  );
  const totalItems = products.reduce(
    (total, items) => items.quantity + total,
    0
  );
  const handleQuantity = (e, item) => {
    dispatch(
      updateProductAsync({
        id: item.id,
        quantity: +e.target.value,
      })
    );
  };

  const handleRemove = (e, id) => {
    dispatch(deleteCartProductAsync(id));
  };

  return (
    <>
      {products.length > 0 ? (
        <div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">
              Cart
            </h2>
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {products.map((product) => (
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
                              <p>{product.product.name}</p>
                            </h3>
                            <p className="ml-4">
                              ${discountedPrice(product.product)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.product.brand}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">
                            <label
                              htmlFor="quantity"
                              className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                            >
                              Qty
                            </label>
                            <select
                              onChange={(e) => handleQuantity(e, product)}
                              value={product.quantity}
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                          </p>

                          <div className="flex">
                            <Modal
                              title={`Delete ${product.product.title}`}
                              message="Are you sure you want to delete this cart item?"
                              dangerOption="Delete"
                              cancelOption="Cancel"
                              cancelAction={() => setShowModal(null)}
                              dangerAction={(e) => handleRemove(e, product.id)}
                              showModal={showModal === product.id}
                            ></Modal>
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={(e) => setShowModal(product.id)}
                            >
                              Remove
                            </button>
                          </div>
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
                <p>${totalAmount}</p>
              </div>
              <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                <p>Total Items in Cart</p>
                <p>{totalItems} items</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6">
                <Link
                  to="/checkout"
                  href="#"
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Checkout
                </Link>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or
                  <Link to="/">
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500 ml-2"
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h2 className="ml-12 mt-12 text-4xl font-bold tracking-tight text-gray-900">
          Cart is Empty
        </h2>
      )}
    </>
  );
}
