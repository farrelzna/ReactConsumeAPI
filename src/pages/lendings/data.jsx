import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function LendingData() {
    const [lendings, setLendings] = useState([]);
    const [error, setError] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({
        lending_id: "",
        total_good_stuff: 0,
        total_defec_stuff: 0,
    });

    const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
    const [detailLending, setDetailLending] = useState([]);
    const [alert, setAlert] = useState("");

    const navigate = useNavigate();

    function fetchData() {
        axios.get(API_URL + "/lendings")
            .then((res) => setLendings(res.data.data))
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setError(err.response?.data || { message: "An unexpected error occurred." });
            })
    }

    useEffect(() => {
        fetchData()
    }, []);

    function handleBtnCreate(lending) {
        // parameter diatur untuk mengambil seluruh data lending, karena data lending yang diperlukan bukan hanya id, yang lainnya dibutuhkan untuk info modal
        setDetailLending(lending);
        setFormModal({ ...formModal, lending_id: lending.id });
        setIsModalOpen(true);
    }

    function handleBtnDetail(lending) {
        setDetailLending(lending);
        setIsModalOpenDetail(true);
    }

    function handleSubmitForm(e) {
        e.preventDefault();
        axios.post(API_URL + "/restorations", formModal)
            .then((res) => {
                setIsModalOpen(false);
                setFormModal({ lending_id: "", total_good_stuff: 0, total_defec_stuff: 0 });
                setDetailLending([]);
                setAlert("success create restoration!");
                fetchData();
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setError(err.response?.data || { message: "An unexpected error occurred." });
            })
    }

    function exportExcel() {
        // Buat format data (column) apa saja yang akan dibuat pada excel
        const formatedData = lendings.map((value, index) => ({
            No: index + 1,
            Name: value.name,
            StuffName: value.stuff.name,
            TotalStuff: value.total_stuff,
            Date: new Date(value.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            RestorationStatus: value.restoratin ? "returned" : "-",
            RestorationTotalGoodStuff: value.restoration?.total_good_stuff,
            RestorationTotalDefecStuff: value.restoration?.total_defec_stuff,
            DateOfRestoration: new Date(value.restoration?.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
        }));

        // ubah array of object jadi worksheet Excel
        const worksheet = XLSX.utils.json_to_sheet(formatedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        // Simpan file dengan ekstensi .xlsx
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        // unduh dengan nama file
        saveAs(file, "data_lendings.xlsx");
    }

    const filteredLendings = lendings.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {alert && (
                <div className="alert alert-success alert-dismissible fade show mx-4 mt-3" role="alert">
                    {alert}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setAlert("")}
                    ></button>
                </div>
            )}

            <div className="d-flex justify-content-end align-items-center gap-2 my-3">
                <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                    <input className="form-control form-control-sm me-2" type="search" placeholder="Search" aria-label="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button className="btn btn-outline-success btn-sm" type="submit">
                        Search
                    </button>
                </form>
                <button className="btn btn-success btn-sm" onClick={exportExcel}>
                    Export Excel
                </button>
            </div>

            <table className="table table-bordered table-hover table-striped">
                <thead className="table-dark">
                    <tr>
                        <th rowSpan={2}>#</th>
                        <th rowSpan={2}>Name</th>
                        <th colSpan={2}>Stuff</th>
                        <th rowSpan={2}>Date</th>
                        <th rowSpan={2}>Action</th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLendings.length > 0 ? (
                        filteredLendings.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.stuff?.name}</td>
                                <td>{item.total_stuff}</td>
                                <td>{new Date(item.created_at).toLocaleDateString("id-ID", { dateStyle: 'long' })}</td>
                                <td>
                                    {item.restoration ? (
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => handleBtnDetail(item)}
                                        >
                                            Detail Restoration
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleBtnCreate(item)}
                                        >
                                            Create Restoration
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                Data not found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onclose={() => setIsModalOpen(false)} title="Create Restoration">
                {
                    Object.keys(error).length > 0 && (
                        <div className="alert alert-danger">
                            <ul>
                                {
                                    error.data && Object.entries(error.data).length > 0 ? (
                                        Object.entries(error.data).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))
                                    ) : (
                                        <li>{error.message || "An unexpected error occurred."}</li>
                                    )
                                }
                            </ul>
                        </div>
                    )
                }
                <form onSubmit={handleSubmitForm}>
                    <div className="alert alert-info">
                        Lending <b>{detailLending.name}</b> with total stuff <b>{detailLending.total_stuff}</b>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Total Good Stuff</label>
                        <input
                            type="number"
                            className="form-control"
                            onChange={(e) => setFormModal({ ...formModal, total_good_stuff: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Total Defec Stuff</label>
                        <input
                            type="number"
                            className="form-control"
                            onChange={(e) => setFormModal({ ...formModal, total_defec_stuff: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </form>
            </Modal>

            <Modal isOpen={isModalOpenDetail} onclose={() => setIsModalOpenDetail(false)} title="Detail Restoration">
                <ul className="list-group">
                    <li className="list-group-item">
                        <span className="fw-bold">Date of Restoration:</span> {new Date(detailLending.created_at).toLocaleDateString("id-ID", { dateStyle: 'long' })}
                    </li>
                    <li className="list-group-item">
                        <span className="fw-bold">Total Item of Lending:</span> {detailLending.total_stuff}
                    </li>
                    <li className="list-group-item">
                        <span className="fw-bold">Total Good Stuff of Restoration:</span> {detailLending.restoration?.total_good_stuff}
                    </li>
                    <li className="list-group-item">
                        <span className="fw-bold">Total Defec Stuff of Restoration:</span> {detailLending.restoration?.total_defec_stuff}
                    </li>
                </ul>
            </Modal>

        </>
    )
}