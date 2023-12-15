import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  deleteItemFromCart,
  fetchCartByUserId,
  resetCart,
  updateCart,
} from "./cartService";

const initialState = {
  status: "",
  items: [],
};

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (item) => {
    const response = await addToCart(item);
    return response.data;
  }
);
export const fetchCartProductsAsync = createAsyncThunk(
  "cart/fetchCartProducts",
  async () => {
    const response = await fetchCartByUserId();
    return response.data;
  }
);
export const updateProductAsync = createAsyncThunk(
  "cart/updateProduct",
  async (update) => {
    const response = await updateCart(update);
    return response.data;
  }
);
export const deleteCartProductAsync = createAsyncThunk(
  "cart/deleteCartProduct",
  async (id) => {
    const response = await deleteItemFromCart(id);
    return response.data;
  }
);
export const resetCartAsync = createAsyncThunk("cart/resetCart", async () => {
  const response = await resetCart();
  return response.status;
});

export const cartSlice = createSlice({
  name: "cart",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.items.push(action.payload);
      })
      .addCase(fetchCartProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items[index] = action.payload;
      })
      .addCase(deleteCartProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCartProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items.splice(index, 1);
      })
      .addCase(resetCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetCartAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = [];
      });
  },
});

export const selectItems = (state) => state.cart.items;
export const selectStatus = (state) => state.cart.status;
export default cartSlice.reducer;
