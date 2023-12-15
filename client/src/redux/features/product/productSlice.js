import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getBrands,
  getCategories,
  getProducts,
  getProductsByFilters,
  getProductById,
  addProducts,
  updateProduct,
} from "./productService";

const initialState = {
  products: [],
  status: "idle",
  totalItems: 0,
  brands: [],
  categories: [],
  selectedProduct: null,
};

export const fetchAllProductsAsync = createAsyncThunk(
  "product/fetchAllProducts",

  async () => {
    const response = await getProducts();
    return response;
  }
);
export const fetchProductsByIdAsync = createAsyncThunk(
  "product/fetchProductsById",
  async (id) => {
    const response = await getProductById(id);
    return response;
  }
);
export const createProductsAsync = createAsyncThunk(
  "product/createProduct",
  async (product) => {
    const response = await addProducts(product);
    return response;
  }
);
export const updateProductsAsync = createAsyncThunk(
  "product/updateProduct",
  async (product) => {
    const response = await updateProduct(product);
    return response;
  }
);
export const fetchBrandsAsync = createAsyncThunk(
  "product/fetchBrands",
  async () => {
    const response = await getBrands();
    return response;
  }
);
export const fetchCategoriesAsync = createAsyncThunk(
  "product/fetchCategories",
  async () => {
    const response = await getCategories();
    return response;
  }
);
export const fetchProductsByFilterAsync = createAsyncThunk(
  "product/fetchProductsByFilter",
  async ({ filter, sort, pagination, admin }) => {
    try {
      const response = await getProductsByFilters(
        filter,
        sort,
        pagination,
        admin
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload;
      })
      .addCase(fetchProductsByFilterAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFilterAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands = action.payload.data;
      })
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories = action.payload.data;
      })
      .addCase(fetchProductsByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedProduct = action.payload.data;
      })
      .addCase(createProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products.push(action.payload.data);
      })
      .addCase(updateProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        state.products[index] = action.payload.data;
        state.selectedProduct = action.payload.data;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export const selectAllProducts = (state) => state.product.products;
export const selectStatus = (state) => state.product.status;
export const selectATotalItems = (state) => state.product.totalItems;
export const selectBrands = (state) => state.product.brands;
export const selectCategories = (state) => state.product.categories;
export const selectProductById = (state) => state.product.selectedProduct;
export default productSlice.reducer;
