import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import AlertSnackbar from "../../components/AlertSnackbar";

export default function StuffIndex() {
    const [stuff, setStuffs] = useState([]);
    const [error, setError] = useState([]);
    const [alert, setAlert] = useState({ message: null, severity: "success" });
    const [search, setSearch] = useState("");
    const [filteredStuff, setFilteredStuff] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState(null);
    const [formModal, setFormModal] = useState({
        name: '',
        type: ''
    });

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        stuffId: null,
        stuffName: '',
        error: null
    });

    const [editModal, setEditModal] = useState({
        isOpen: false,
        stuffId: null,
        error: null,
        data: {
            name: '',
            type: ''
        }
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = stuff.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredStuff(filtered);
    }, [search, stuff]);

    function fetchData() {
        axios.get(`${API_URL}/stuffs`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
        })
            .then((res) => {
                setStuffs(res.data.data);
            })
            .catch(err => {
                if (err.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setError(err.response.data);
            });
    }

    function handleSubmitModal(e) {
        e.preventDefault();
        axios.post(API_URL + "/stuffs", formModal, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        })
            .then(res => {
                setIsModalOpen(false);
                setModalError(null);
                setAlert({ message: "Success add new data Stuff", severity: "success" });
                fetchData();
            })
            .catch(err => {
                if (err.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setModalError(err.response.data);
                setAlert({ message: "Failed to add new data Stuff", severity: "error" });
            });
    }

    function handleDelete(stuffId, stuffName) {
        setDeleteModal({
            isOpen: true,
            stuffId,
            stuffName,
            error: null
        });
    }

    function handleConfirmDelete() {
        axios.delete(`${API_URL}/stuffs/${deleteModal.stuffId}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        })
            .then(res => {
                setDeleteModal({
                    isOpen: false,
                    stuffId: null,
                    stuffName: '',
                    error: null
                });
                setAlert({ message: "Successfully deleted stuff", severity: "success" });
                fetchData();
            })
            .catch(err => {
                if (err.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setDeleteModal(prev => ({
                    ...prev,
                    error: err.response.data
                }));
            });
    }

    function handleEdit(item) {
        console.log("Editing item:", item); // Debug log
        setEditModal({
            isOpen: true,
            stuffId: item.id,
            error: null,
            data: {
                name: item.name,
                type: item.type
            }
        });
    }

    function handleSubmitEdit(e) {
        e.preventDefault();
        console.log("Submitting edit:", editModal); // Debug log

        const { name, type } = editModal.data;

        // Validation
        if (!name.trim() || !type.trim()) {
            setEditModal(prev => ({
                ...prev,
                error: { message: "Name and Type are required" }
            }));
            return;
        }

        // Send PATCH request instead of PUT
        axios({
            method: 'patch',
            url: `${API_URL}/stuffs/${editModal.stuffId}`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                name: name.trim(),
                type: type.trim()
            }
        })
        .then(response => {
            console.log("Edit success:", response); // Debug log
            
            // Reset modal state
            setEditModal({
                isOpen: false,
                stuffId: null,
                error: null,
                data: { name: '', type: '' }
            });

            // Show success alert
            setAlert({
                message: "Item updated successfully",
                severity: "success"
            });

            // Refresh data
            fetchData();
        })
        .catch(error => {
            console.error("Edit error:", error.response || error); // Debug log

            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setEditModal(prev => ({
                ...prev,
                error: error.response?.data || { 
                    message: "Failed to update item. Please try again." 
                }
            }));

            setAlert({
                message: "Failed to update item",
                severity: "error"
            });
        });
    }

    function handleChangeEditField(field, value) {
        setEditModal(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [field]: value
            }
        }));
    }

    return (
        <>
            <AlertSnackbar
                alert={alert}
                errors={modalError || deleteModal.error || editModal.error}
                onClose={() => {
                    setAlert({ message: null, severity: "success" });
                    setModalError(null);
                    setDeleteModal(prev => ({ ...prev, error: null }));
                    setEditModal(prev => ({ ...prev, error: null }));
                }}
            />

            <div className="container mt-5">

                <div className="row mb-4 g-3">
                    <div className="col-xl-3 col-sm-6">
                        <div className="card bg-gradient shadow-lg border-0">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                            <i className="bi bi-box fs-4 text-primary"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 text-muted">Total Items</h6>
                                            <h4 className="mb-0 fw-bold">{stuff.length}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress bg-primary bg-opacity-10" style={{ height: "4px" }}>
                                    <div className="progress-bar bg-primary" style={{ width: "70%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                        <div className="card bg-gradient shadow-lg border-0">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                                            <i className="bi bi-boxes fs-4 text-success"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 text-muted">Total Stock</h6>
                                            <h4 className="mb-0 fw-bold">
                                                {filteredStuff.reduce((total, item) => total + (item.stuff_stock?.total_available || 0), 0)}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress bg-success bg-opacity-10" style={{ height: "4px" }}>
                                    <div className="progress-bar bg-success" style={{ width: "65%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                        <div className="card bg-gradient shadow-lg border-0">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-danger bg-opacity-10 p-2 me-3">
                                            <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 text-muted">Total Defec</h6>
                                            <h4 className="mb-0 fw-bold">
                                                {filteredStuff.reduce((total, item) => total + (item.stuff_stock?.total_defec || 0), 0)}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress bg-danger bg-opacity-10" style={{ height: "4px" }}>
                                    <div className="progress-bar bg-danger" style={{ width: "45%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                        <div className="card bg-gradient shadow-lg border-0">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-info bg-opacity-10 p-2 me-3">
                                            <i className="bi bi-graph-up fs-4 text-info"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 text-muted">Grand Total</h6>
                                            <h4 className="mb-0 fw-bold">
                                                {filteredStuff.reduce((total, item) =>
                                                    total + ((item.stuff_stock?.total_available || 0) + (item.stuff_stock?.total_defec || 0)), 0
                                                )}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress bg-info bg-opacity-10" style={{ height: "4px" }}>
                                    <div className="progress-bar bg-info" style={{ width: "80%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-lg">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold text-dark">List of Items</h5>
                        <div className="d-flex gap-2">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-light border-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control form-control-sm bg-light border-0"
                                    placeholder="Cari barang..."
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-2"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <i className="bi bi-plus-lg"></i>
                                <span>Tambah</span>
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="py-3 px-4">#</th>
                                        <th className="py-3 px-4">Nama Barang</th>
                                        <th className="py-3 px-4">Stok</th>
                                        <th className="py-3 px-4">Rusak</th>
                                        <th className="py-3 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStuff.length > 0 ? (
                                        filteredStuff.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4 fw-semibold">{item.name}</td>
                                                <td className="py-3 px-4">
                                                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                                                        {item.stuff_stock?.total_available || 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`badge ${item.stuff_stock?.total_defec <= 3
                                                        ? 'bg-danger bg-opacity-10 text-danger'
                                                        : 'bg-warning bg-opacity-10 text-warning'
                                                        } px-3 py-2`}>
                                                        {item.stuff_stock?.total_defec || 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button
                                                            className="btn btn-soft-success btn-outline-success btn-sm px-3"
                                                            onClick={() => navigate(`/stuffs/${item.id}/add`)}
                                                        >
                                                            <i className="bi bi-plus-lg me-1"></i>
                                                            Add Stock
                                                        </button>
                                                        <button
                                                            className="btn btn-soft-warning btn-outline-warning btn-sm px-3"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <i className="bi bi-pencil me-1"></i>
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-soft-danger btn-outline-danger btn-sm px-3"
                                                            onClick={() => handleDelete(item.id, item.name)}
                                                        >
                                                            <i className="bi bi-trash me-1"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4 text-muted">
                                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                                Tidak ada data ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onclose={() => setIsModalOpen(false)} title="Add new Stuff">
                <form onSubmit={handleSubmitModal}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter stuff name"
                            onChange={(e) => setFormModal({ ...formModal, name: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Type <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            onChange={(e) => setFormModal({ ...formModal, type: e.target.value })}
                        >
                            <option value="">Select type</option>
                            <option value="HTL/KLN">HTL/KLN</option>
                            <option value="Lab">Lab</option>
                            <option value="Sarpras">Sarpras</option>
                        </select>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <i className="bi bi-plus-lg me-2"></i>
                            Add Stuff
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={deleteModal.isOpen}
                onclose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                title="Delete Confirmation"
            >
                <p>Are you sure you want to delete stuff: <strong>{deleteModal.stuffName}</strong>?</p>

                <div className="d-flex gap-2 justify-content-end">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleConfirmDelete}
                    >
                        Delete
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={editModal.isOpen}
                onclose={() => {
                    setEditModal({
                        isOpen: false,
                        stuffId: null,
                        error: null,
                        data: { name: '', type: '' }
                    });
                    // Clear any existing alerts
                    setAlert({ message: null, severity: "success" });
                }}
                title="Edit Item"
            >
                <form onSubmit={handleSubmitEdit} className="needs-validation" noValidate>
                    {/* Error Alert */}
                    {editModal.error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>
                                {editModal.error.message || "An error occurred"}
                            </div>
                        </div>
                    )}

                    {/* Name Field */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${editModal.error && !editModal.data.name ? 'is-invalid' : ''}`}
                            value={editModal.data.name}
                            onChange={(e) => setEditModal(prev => ({
                                ...prev,
                                error: null, // Clear error on change
                                data: { ...prev.data, name: e.target.value }
                            }))}
                            placeholder="Enter item name"
                            required
                        />
                        {editModal.error && !editModal.data.name && (
                            <div className="invalid-feedback">Name is required</div>
                        )}
                    </div>

                    {/* Type Field */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Type <span className="text-danger">*</span>
                        </label>
                        <select
                            className={`form-select ${editModal.error && !editModal.data.type ? 'is-invalid' : ''}`}
                            value={editModal.data.type}
                            onChange={(e) => setEditModal(prev => ({
                                ...prev,
                                error: null, // Clear error on change
                                data: { ...prev.data, type: e.target.value }
                            }))}
                            required
                        >
                            <option value="">Select type</option>
                            <option value="HTL/KLN">HTL/KLN</option>
                            <option value="Lab">Lab</option>
                            <option value="Sarpras">Sarpras</option>
                        </select>
                        {editModal.error && !editModal.data.type && (
                            <div className="invalid-feedback">Type is required</div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setEditModal({
                                    isOpen: false,
                                    stuffId: null,
                                    error: null,
                                    data: { name: '', type: '' }
                                });
                                setAlert({ message: null, severity: "success" });
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-warning"
                            disabled={!editModal.data.name || !editModal.data.type}
                        >
                            <i className="bi bi-check-lg me-2"></i>
                            Update
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}