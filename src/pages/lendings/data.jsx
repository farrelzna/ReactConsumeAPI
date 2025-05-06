import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AlertSnackbar from "../../components/AlertSnackbar";

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

    const filteredLendings = lendings.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="container ">
            <AlertSnackbar 
                alert={alert}
                severity="success"
                onClose={() => setAlert("")}
            />

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark">Lending History</h5>
                    <div className="d-flex gap-2">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light border-0">
                                <i className="bi bi-search"></i>
                            </span>
                            <input 
                                type="text"
                                className="form-control form-control-sm bg-light border-0"
                                placeholder="Search lendings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    className="btn btn-light border-0"
                                    onClick={() => setSearchTerm('')}
                                    type="button"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </div>
                        <button 
                            className="btn btn-outline-dark btn-sm px-3 d-flex justify-content-center align-items-center gap-2"
                            onClick={exportExcel}
                            style={{ width: "250px" }}
                        >
                            <i className="bi bi-file-earmark-excel"></i>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 px-4">#</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Stuff Name</th>
                                    <th className="py-3 px-4">Total</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLendings.length > 0 ? (
                                    filteredLendings.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-3 px-4">{index + 1}</td>
                                            <td className="py-3 px-4 fw-semibold">{item.name}</td>
                                            <td className="py-3 px-4">{item.stuff?.name}</td>
                                            <td className="py-3 px-4">
                                                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2" style={{ width: "100px" }}>
                                                    {item.total_stuff}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">{new Date(item.created_at).toLocaleDateString("id-ID", { dateStyle: 'long' })}</td>
                                            <td className="py-3 px-4">
                                                {item.restoration ? (
                                                    <button
                                                        className="btn btn-soft-info btn-sm px-3"
                                                        onClick={() => handleBtnDetail(item)}
                                                    >
                                                        <i className="bi bi-info-circle me-1"></i>
                                                        Detail
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-soft-primary btn-sm px-3"
                                                        onClick={() => handleBtnCreate(item)}
                                                    >
                                                        <i className="bi bi-plus-lg me-1"></i>
                                                        Create
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-muted">
                                            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Update Modal Styles */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Create Restoration"
            >
                <form onSubmit={handleSubmitForm} className="needs-validation" noValidate>
                    {error && Object.keys(error).length > 0 && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>
                                {error.data && Object.entries(error.data).length > 0 ? (
                                    <ul className="mb-0">
                                        {Object.entries(error.data).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    error.message || "An unexpected error occurred."
                                )}
                            </div>
                        </div>
                    )}

                    <div className="alert alert-info d-flex align-items-center mb-4">
                        <i className="bi bi-info-circle me-2"></i>
                        <div>
                            Lending <b>{detailLending.name}</b> with total stuff <b>{detailLending.total_stuff}</b>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Total Good Stuff <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-control ${error && !formModal.total_good_stuff ? 'is-invalid' : ''}`}
                            onChange={(e) => setFormModal({ ...formModal, total_good_stuff: e.target.value })}
                            placeholder="Enter total good stuff"
                            required
                        />
                        {error && !formModal.total_good_stuff && (
                            <div className="invalid-feedback">Total good stuff is required</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Total Defective Stuff <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-control ${error && !formModal.total_defec_stuff ? 'is-invalid' : ''}`}
                            onChange={(e) => setFormModal({ ...formModal, total_defec_stuff: e.target.value })}
                            placeholder="Enter total defective stuff"
                            required
                        />
                        {error && !formModal.total_defec_stuff && (
                            <div className="invalid-feedback">Total defective stuff is required</div>
                        )}
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button 
                            type="button" 
                            className="btn btn-light px-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary px-4"
                            disabled={!formModal.total_good_stuff || !formModal.total_defec_stuff}
                        >
                            <i className="bi bi-check-lg me-2"></i>
                            Create
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal 
                isOpen={isModalOpenDetail} 
                onClose={() => setIsModalOpenDetail(false)} 
                title="Restoration Details"
            >
                <div className="list-group list-group-flush">
                    <div className="list-group-item px-0">
                        <small className="text-muted d-block mb-1">Date of Restoration</small>
                        <span className="fw-semibold">
                            {new Date(detailLending.created_at).toLocaleDateString("id-ID", { dateStyle: 'long' })}
                        </span>
                    </div>
                    <div className="list-group-item px-0">
                        <small className="text-muted d-block mb-1">Total Items Lent</small>
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                            {detailLending.total_stuff}
                        </span>
                    </div>
                    <div className="list-group-item px-0">
                        <small className="text-muted d-block mb-1">Total Good Items Returned</small>
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                            {detailLending.restoration?.total_good_stuff}
                        </span>
                    </div>
                    <div className="list-group-item px-0">
                        <small className="text-muted d-block mb-1">Total Defective Items</small>
                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">
                            {detailLending.restoration?.total_defec_stuff}
                        </span>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button 
                            type="button" 
                            className="btn btn-light px-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}