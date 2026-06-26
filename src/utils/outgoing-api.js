import axios from "axios";

const BASE_URL = "https://ievyooeawrzhkemxfswj.supabase.co/";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";


export const outgoing_api = axios.create({
  baseURL: `${BASE_URL}/rest/v1`,
  headers: {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});