import axios from "axios";
const URL = "/api/v1/order";

export const createOrder = async (item) => {
  const { data } = await axios.post(URL, item);

  return { data };
};
export const updateOrder = async (item) => {
  const { data } = await axios.patch(URL + `/${item.id}`, item);

  return { data };
};

export const getAllOrders = async (sort, pagination) => {
  let queryString = "";
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  const response = await axios.get(URL + "?" + queryString);
  const totalOrder = await response.headers.get("X-Total-Count");

  return {
    data: {
      orders: response.data,
      totalOrder: +totalOrder,
    },
  };
};
