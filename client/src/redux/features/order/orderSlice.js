import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrder, getAllOrders, updateOrder } from "./orderService";
const initialState = {
  status: "",
  orders: [],
  currentOrder: {},
  totalOrders: 0,
};

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (order) => {
    const response = await createOrder(order);
    return response.data;
  }
);
export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async (order) => {
    const response = await updateOrder(order);
    return response.data;
  }
);
export const fetchAllOrdersAsync = createAsyncThunk(
  "order/fetchAllOrders",
  async ({ sort, pagination }) => {
    const response = await getAllOrders(sort, pagination);
    return response.data;
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrder;
        state.currentOrder = null;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.orders.findIndex(
          (item) => item.id === action.payload.id
        );
        state.orders[index] = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;

export const selectOrders = (state) => state.order.orders;
export const selectOrderStatus = (state) => state.order.status;
export const selectTotalOrders = (state) => state.order.totalOrders;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export default orderSlice.reducer;
