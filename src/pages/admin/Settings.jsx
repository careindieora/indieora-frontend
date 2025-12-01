import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../services/settings";
import { toast } from "react-hot-toast";

export default function AdminSettings() {
  const [form, setForm] = useState({
    logo: "",
    headerTitle: "",
    headerSubtitle: "",
    themeColor: "",
  });

  useEffect(() => {
    getSettings().then((res) => {
      if (res) setForm(res);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveSettings = async () => {
    const ok = await updateSettings(form);
    if (ok) toast.success("Settings saved!");
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Website Settings</h1>

      {/* Logo */}
      <div>
        <label className="font-medium">Logo URL</label>
        <input
          type="text"
          name="logo"
          value={form.logo}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Header Title */}
      <div>
        <label className="font-medium">Header Title</label>
        <input
          type="text"
          name="headerTitle"
          value={form.headerTitle}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Header Subtitle */}
      <div>
        <label className="font-medium">Header Subtitle</label>
        <input
          type="text"
          name="headerSubtitle"
          value={form.headerSubtitle}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Color */}
      <div>
        <label className="font-medium">Theme Color</label>
        <input
          type="color"
          name="themeColor"
          value={form.themeColor}
          onChange={handleChange}
          className="border p-2 rounded h-10 w-20"
        />
      </div>

      <button
        onClick={saveSettings}
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        Save Settings
      </button>
    </div>
  );
}
