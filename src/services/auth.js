// src/services/auth.js

// --- Get current logged-in user from localStorage ---
export function getUser() {
  try {
    const stored = localStorage.getItem("indieora_user");
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Error parsing user:", err);
    return null;
  }
}

// --- Logout helper: clear localStorage + redirect ---
export function logout() {
  try {
    localStorage.removeItem("indieora_token");
    localStorage.removeItem("token");
    localStorage.removeItem("indieora_user");
  } catch (e) {
    // ignore
  }

  // Frontend account page
  if (typeof window !== "undefined") {
    window.location.href = "/account";
  }
}
