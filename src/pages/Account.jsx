// src/pages/Account.jsx
import { useState } from "react";
import {
  registerRequest,
  resendOtpRequest,
  verifyOtpRequest,
  loginRequest,
} from "../services/auth";

export default function AccountPage() {
  const [mode, setMode] = useState("login"); // 'login' or 'register' or 'verify'
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [message, setMessage] = useState("");

  // REGISTER SUBMIT
  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    try {
      const data = await registerRequest(registerForm);
      setMessage(data.message || "Registered.");
      setOtpEmail(registerForm.email);
      setMode("verify");

      // dev-only: show debugOtp in console
      if (data.debugOtp) {
        console.log("DEBUG OTP:", data.debugOtp);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Register failed");
    }
  }

  // RESEND OTP
  async function handleResend() {
    setMessage("");
    try {
      const data = await resendOtpRequest(otpEmail);
      setMessage(data.message || "OTP resent");
      if (data.debugOtp) {
        console.log("DEBUG OTP:", data.debugOtp);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Resend failed");
    }
  }

  // VERIFY OTP
  async function handleVerify(e) {
    e.preventDefault();
    setMessage("");
    try {
      const data = await verifyOtpRequest({ email: otpEmail, otp });
      setMessage("Email verified & logged in");

      // save token for later requests
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // TODO: store user in context/state if you have one
      setMode("login"); // or redirect to /account/profile etc.
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Verification failed");
    }
  }

  // LOGIN
  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    try {
      const data = await loginRequest(loginForm);
      setMessage("Logged in");

      if (data.token) localStorage.setItem("token", data.token);
      // TODO: store user in context/state
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          className={`pb-2 ${
            mode === "login" ? "border-b-2 border-black font-semibold" : ""
          }`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={`pb-2 ${
            mode === "register" ? "border-b-2 border-black font-semibold" : ""
          }`}
          onClick={() => setMode("register")}
        >
          Create account
        </button>
      </div>

      {message && (
        <div className="mb-4 text-sm text-amber-700 bg-amber-50 p-3 rounded">
          {message}
        </div>
      )}

      {mode === "register" && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={registerForm.phone}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, phone: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
              required
            />
          </div>
          <button className="w-full bg-black text-white py-2 rounded">
            Create account
          </button>
        </form>
      )}

      {mode === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-gray-600">
            We sent a 6-digit code to{" "}
            <span className="font-semibold">{otpEmail}</span>.
          </p>
          <input
            className="w-full border rounded px-3 py-2 tracking-[0.3em] text-center"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="w-full bg-black text-white py-2 rounded">
            Verify
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="w-full mt-1 text-sm text-gray-600 underline"
          >
            Resend code
          </button>
        </form>
      )}

      {mode === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              required
            />
          </div>
          <button className="w-full bg-black text-white py-2 rounded">
            Login
          </button>
        </form>
      )}
    </div>
  );
}
