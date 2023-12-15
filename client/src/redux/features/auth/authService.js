import axios from "axios";

const URL = "http://localhost:5000/api/v1/order";

const register = async (userData) => {
  return new Promise(async (resolve) => {
    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
};

const login = (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const logout = async () => {
  const response = await axios.get("/api/v1/auth/logout");

  return response.data;
};

const getLoginStatus = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/api/v1/auth/getLoginStatus");
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
};

function getUser() {
  return new Promise(async (resolve) => {
    const response = await fetch("/api/v1/users/getUser");
    const data = await response.json();
    resolve({ data });
  });
}
const updateUser = async (userData) => {
  const response = await axios.patch("/api/v1/users/updateUser", userData);

  return response.data.data;
};

const updatePhoto = async (userData) => {
  const response = await axios.patch("/api/v1/users/updatePhoto", userData);

  return response.data.data;
};

const getUserOrders = async () => {
  const { data } = await axios.get("/api/v1/order/own");

  return { data };
};

const authService = {
  register,
  login,
  logout,
  getLoginStatus,
  getUser,
  updatePhoto,
  updateUser,
  getUserOrders,
};

export default authService;
