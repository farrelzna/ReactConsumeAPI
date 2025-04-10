import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";

export default function StuffIndex() {
    const [stuff, setStuffs] = useState([]);
    const [err, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${API_URL}/stuffs`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
            })
            .then((res) => {
                setStuffs(res.data.data);
            })
            .catch((error) => {
                setError(error.message || "Terjadi kesalahan saat memuat data.");
            });
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Daftar Barang</h4>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => navigate("/stuffs/create")}
                            >
                                Tambah Barang
                            </button>
                        </div>
                        <div className="card-body">
                            {err && <p className="text-danger">{err}</p>}
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th rowSpan={2}>#</th>
                                        <th rowSpan={2}>Nama Barang</th>
                                        <th colSpan={2} className="text-center">Stock</th>
                                        <th rowSpan={2}>Aksi</th>
                                    </tr>
                                    <tr>
                                        <th>Tersedia</th>
                                        <th>Rusak</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stuff.length > 0 ? (
                                        stuff.map((value, index) => (
                                            <tr key={value.id}>
                                                <td>{index + 1}</td>
                                                <td>{value.name}</td>
                                                <td>{value.stuff_stock ? value.stuff_stock.total_available : "-"}</td>
                                                <td>{value.stuff_stock ? (value.stuff_stock.defec || value.stuff_stock.total_defec || "-") : "-"}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => navigate(`/stuffs/${value.id}/edit`)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center">Data barang tidak tersedia.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
