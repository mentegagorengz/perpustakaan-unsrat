"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DetailPopup from "@/components/DetailPopup"; // pastikan path sesuai strukturmu
import config from "@/config";


const KoleksiPublikPage = () => {
  const [activeTab, setActiveTab] = useState<"buku" | "penelitian" | "majalah">("buku");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [bukuData, setBukuData] = useState<any[]>([]);
  const [majalahData, setMajalahData] = useState<any[]>([]);
  const [penelitianData, setPenelitianData] = useState<any[]>([]);

  const [totalBuku, setTotalBuku] = useState(0);
  const [totalMajalah, setTotalMajalah] = useState(0);
  const [totalPenelitian, setTotalPenelitian] = useState(0);

  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const fetchBuku = async () => {
    try {
      const res = await fetch(`${config.apiUrl}/book?search=${search}&page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
      });
  
      // Cek dulu response-nya readable atau tidak
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Invalid content-type: ${contentType}`);
      }
  
      const data = await res.json();
      console.log("📦 Data Buku:", data);
      setBukuData(data.data || data.books || []);
      setTotalBuku(data.total || 0);
    } catch (err) {
      console.error("❌ Gagal ambil data buku:", err);
      setBukuData([]); // supaya tidak error render
    }
  };   

  const fetchMajalah = async () => {
    const res = await fetch(`${config.apiUrl}/majalah?search=${search}&page=${page}&limit=${limit}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setMajalahData(data.data || []);
    setTotalMajalah(data.total || 0);
  };

  const fetchPenelitian = async () => {
    try {
      const res = await fetch(`${config.apiUrl}/penelitian?search=${search}&page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setPenelitianData(Array.isArray(data.data) ? data.data : []);
      setTotalPenelitian(data.total || 0);
    } catch (err) {
      console.error("❌ Gagal ambil data penelitian:", err);
      setPenelitianData([]); // supaya tidak error render
    }
  };

  useEffect(() => {
    fetchBuku();
    fetchMajalah();
    fetchPenelitian();
  }, [search]);

  useEffect(() => {
    if (activeTab === "buku") fetchBuku();
    if (activeTab === "majalah") fetchMajalah();
    if (activeTab === "penelitian") fetchPenelitian();
  }, [page]);

  useEffect(() => {
    setSearch("");
    setPage(1);
    if (activeTab === "buku") fetchBuku();
    if (activeTab === "majalah") fetchMajalah();
    if (activeTab === "penelitian") fetchPenelitian();
  }, [activeTab]);

  const totalPages = {
    buku: Math.ceil(totalBuku / limit),
    majalah: Math.ceil(totalMajalah / limit),
    penelitian: Math.ceil(totalPenelitian / limit),
  };

  const renderCard = (item: any) => (
    <div
      key={item.id}
      onClick={() => setSelectedItem(item)}
      className="cursor-pointer bg-white border border-gray-200 shadow-md hover:shadow-lg transition rounded-lg overflow-hidden flex flex-col"
    >
      <div className="w-full h-[220px] flex items-center justify-center bg-gray-50">
        <Image
          src={item.imageUrl || "/images/default-image.png"}
          alt={item.title || "Judul"}
          width={120}
          height={160}
          className="object-contain"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h4 className="font-bold text-sm text-gray-800 line-clamp-2 min-h-[40px]">
          {item.title || "Tanpa Judul"}
        </h4>
        <p className="text-xs text-gray-500 mt-2">
          Penulis: {item.mainAuthor || item.publisher || item.kreator || "-"}
        </p>
        <div className="mt-4 text-right">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            {activeTab.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );

  const renderField = (label: string, value?: string | number) => {
    if (!value) return null;
    return (
      <p className="text-sm text-gray-600">
        <strong>{label}:</strong> {value}
      </p>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">PERPUSTAKAAN UNSRAT</h1>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Cari kata kunci..."
          className="border border-gray-300 px-4 py-2 rounded w-full max-w-md shadow-sm focus:ring focus:outline-none"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-4">
        {["buku", "penelitian", "majalah"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full font-semibold border ${
              activeTab === tab
                ? "bg-red-600 text-white border-red-600"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {activeTab === "buku" && bukuData.map(renderCard)}
        {activeTab === "majalah" && majalahData.map(renderCard)}
        {activeTab === "penelitian" && penelitianData.map(renderCard)}
      </div>

      {/* Pagination */}
      {(activeTab === "buku" || activeTab === "majalah" || activeTab === "penelitian") && (
        <div className="mt-10 flex flex-col items-center gap-4">
          {/* Total Indicator */}
          <p className="text-sm text-gray-600">
            Total {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}:{" "}
            {activeTab === "buku" && totalBuku}
            {activeTab === "majalah" && totalMajalah}
            {activeTab === "penelitian" && totalPenelitian}
          </p>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              ← Sebelumnya
            </button>

            {page > 3 && (
              <>
                <button onClick={() => setPage(1)} className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300">1</button>
                {page > 4 && <span className="px-2">...</span>}
              </>
            )}

            {Array.from({ length: 5 })
              .map((_, i) => page - 2 + i)
              .filter((p) => p > 0 && p <= (totalPages[activeTab] || 1))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 text-sm rounded ${
                    page === p ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}

            {page < (totalPages[activeTab] || 1) - 2 && (
              <>
                {page < (totalPages[activeTab] || 1) - 3 && <span className="px-2">...</span>}
                <button
                  onClick={() => setPage(totalPages[activeTab] || 1)}
                  className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                  {totalPages[activeTab]}
                </button>
              </>
            )}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages[activeTab] || 1))}
              disabled={page === (totalPages[activeTab] || 1)}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {selectedItem && (
        <DetailPopup
          item={selectedItem}
          type={activeTab}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default KoleksiPublikPage;
