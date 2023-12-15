import axios from "axios";
const URL = "/api/v1";

export const getProducts = async () => {
  const response = await axios.get(URL + "/products");

  return response.data;
};
export const addProducts = async (product) => {
  const { data } = await axios.post(URL + "/products", product);

  return { data };
};
export const updateProduct = async (product) => {
  const { data } = await axios.patch(URL + "/products/" + product.id, product);

  return { data };
};
export const getProductById = async (id) => {
  const { data } = await axios.get(URL + "/products/" + id);

  return { data };
};

export const getProductsByFilters = async (filter, sort, pagination, admin) => {
  // filter= {"category":["smartphone","laptops"]}
  //sort ={_sort:"price,_order="desc"}
  //TODO: on server we will support multi value
  //pagination={_page:1, _limit=10}

  let queryString = "";
  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length >= 1) {
      const lastCategoryValue = categoryValues[categoryValues.length - 1];
      queryString += `${key}=${lastCategoryValue}&`;
    }
  }

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }
  if (admin) {
    queryString += "admin=true";
  }
  const response = await axios.get(URL + "/products?" + queryString);
  const totalItems = await response.headers.get("X-Total-Count");

  return {
    data: {
      products: response.data,
      totalItems,
    },
  };
};

export const getCategories = async () => {
  const { data } = await axios.get(URL + "/category");

  return { data };
};
export const getBrands = async () => {
  const { data } = await axios.get(URL + "/brand");

  return { data };
};
