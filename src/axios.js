import axios from "axios";
const baseURL =
  "http://103.99.205.192:8008/mirrors/Dr_Mirror/public/patientApp/";

export const instancetoken = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const instance = axios.create({
  baseURL: baseURL,
});
