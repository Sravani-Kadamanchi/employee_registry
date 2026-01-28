import axios from "axios";

const EmployeeAxiosInstance = axios.create({
  baseURL: "https://express-employees.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default EmployeeAxiosInstance;
