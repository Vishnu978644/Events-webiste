import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaImage, FaCheck, FaEdit } from "react-icons/fa";

const API_URL = "http://localhost:5000/transport";

const WedTransportAdmin = () => {
  const [items, setItems] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransport();
  }, []);

  const fetchTransport = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const fixed = data.map((t) => ({
        _id: t._id,
        url: t.url || "",
        title: t.title || "",
        description: t.description || "",
        price: t.price || "",
        saved: true,
        isSaving: false,
      }));
      setItems(fixed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUrl = () => {
    if (!imageUrl.trim()) return alert("Enter valid URL");
    setItems((prev) => [
      { url: imageUrl.trim(), title: "", description: "", price: "", saved: false, isSaving: false },
      ...prev,
    ]);
    setImageUrl("");
  };

  const handleChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleDelete = async (index) => {
    const item = items[index];
    const old = items;
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (!item._id) return;
    try {
      await fetch(`${API_URL}/${item._id}`, { method: "DELETE" });
    } catch {
      setItems(old);
    }
  };

  const handleSave = async (index) => {
    const item = items[index];
    if (!item.url || !item.title || !item.description || !item.price) return alert("All fields required!");
    setItems((prev) => { const u = [...prev]; u[index].isSaving = true; return u; });
    const body = { url: item.url, title: item.title, description: item.description, price: item.price };
    try {
      let res;
      if (item._id) {
        res = await fetch(`${API_URL}/${item._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      const saved = await res.json();
      setItems((prev) => { const u = [...prev]; u[index] = { ...saved, saved: true, isSaving: false }; return u; });
    } catch {
      setItems((prev) => { const u = [...prev]; u[index].isSaving = false; return u; });
    }
  };

  const handleEdit = (index) => {
    setItems((prev) => { const u = [...prev]; u[index].saved = false; return u; });
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-2xl mt-4">Transport Vehicles ({items.length})</h1>
      {loading && <p className="text-blue-500 mt-2">Loading...</p>}
      <hr className="my-4" />
      <div className="flex items-center gap-2 p-4 border-2 rounded-2xl max-w-lg shadow-md">
        <FaImage className="text-2xl text-gray-500" />
        <input type="url" placeholder="Paste Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-grow border-b-2 py-1 px-2 focus:border-green-500 outline-none" />
        <button onClick={handleAddUrl} disabled={!imageUrl.trim()} className="text-green-500 text-2xl"><FaPlus /></button>
      </div>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-4 mt-4">
        {items.map((item, index) => (
          <div key={item._id || index} className="w-[320px] border-2 rounded-2xl shadow-lg p-2">
            <div className="relative w-full h-[180px] bg-gray-100">
              <img src={item.url} className="w-full h-full object-cover rounded" onError={(e) => { e.target.src = "https://via.placeholder.com/320x180?text=Invalid+Image"; }} />
              <p onClick={() => handleDelete(index)} className="absolute top-2 right-2 cursor-pointer text-red-500 bg-white rounded-full p-1 shadow-md"><FaTrash /></p>
            </div>
            <div className="flex flex-col mt-2 gap-2">
              <input type="text" placeholder="Title" value={item.title} disabled={item.saved || item.isSaving} onChange={(e) => handleChange(index, "title", e.target.value)} className="border px-2 py-1 rounded" />
              <input type="text" placeholder="Description" value={item.description} disabled={item.saved || item.isSaving} onChange={(e) => handleChange(index, "description", e.target.value)} className="border px-2 py-1 rounded" />
              <input type="text" placeholder="Price" value={item.price} disabled={item.saved || item.isSaving} onChange={(e) => handleChange(index, "price", e.target.value)} className="border px-2 py-1 rounded" />
              {!item.saved ? (
                <button onClick={() => handleSave(index)} disabled={!item.url || !item.title || !item.description || !item.price || item.isSaving} className="bg-green-500 text-white py-1 rounded">{item.isSaving ? "Saving..." : <><FaCheck /> Save</>}</button>
              ) : (
                <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white py-1 rounded"><FaEdit /> Edit</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WedTransportAdmin;
