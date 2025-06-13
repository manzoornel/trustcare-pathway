import axios from "axios";
const baseURL = "https://clinictrial.grandissolutions.in/patientApp/";

export const instancetoken = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const instance = axios.create({
  baseURL: baseURL,
});
