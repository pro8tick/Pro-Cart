import axios from "axios";
const URL = "/api/v1/cart";

export const addToCart = async (items) => {
  const { data } = await axios.post(URL, items);
  return { data };
};
export const fetchCartByUserId = async () => {
  const { data } = await axios.get(`${URL}`);
  return { data };
};
export const updateCart = async (update) => {
  const { data } = await axios.patch(`${URL}/${update.id}`, update);
  return { data };
};
export const deleteItemFromCart = async (itemId) => {
  await axios.delete(`${URL}/${itemId}`);
  return { data: { id: itemId } };
};
export const resetCart = async () => {
  const res = await fetchCartByUserId();
  const items = res.data;
  for (let item of items) {
    await deleteItemFromCart(item.id);
  }
  return {
    status: "success",
  };
};
