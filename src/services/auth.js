// src/services/auth.js
import { api } from "./axios";

// REGISTER (creates user + sends OTP)
export async function registerRequest({ name, email, phone, password }) {
  const res = await api.post("/auth/register", {
    name,
    email,
    phone,
    password,
  });
  return res.data; // { success, message, debugOtp? }
}

// RESEND OTP
export async function resendOtpRequest(email) {
  const res = await api.post("/auth/send-otp", { email });
  return res.data;
}

// VERIFY OTP
export async function verifyOtpRequest({ email, otp }) {
  const res = await api.post("/auth/verify-otp", { email, otp });
  return res.data; // { success, token, user }
}

// LOGIN
export async function loginRequest({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { token, user }
}
