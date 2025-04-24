import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import AlertSnackbar from "../../components/AlertSnackbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

    const [formInbound, setFormInbound] = useState({
        stuff_id: "",
        stuffName: "", // Add this to show item name in modal
        total: "",
        proof_file: null,
        error: null
    });

    const [isModalInboundOpen, setIsModalInboundOpen] = useState(false);

    // Add these new states after your existing states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    // Add this pagination component
    const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
        const pageNumbers = Math.ceil(totalItems / itemsPerPage);

        return (
            <nav className="d-flex justify-content-end p-3">
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                    </li>
                    {[...Array(pageNumbers)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => onPageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === pageNumbers ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === pageNumbers}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    // Add this pagination helper function
    const paginate = (items) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return items.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Update the calculatePercentage function to be more flexible
    const calculatePercentage = (value, total) => {
        if (!total) return 0;
        return Math.min(Math.round((value / total) * 100), 100);
    };

    // Update the StatsCard component to handle percentage values
    const StatsCard = ({ icon, color, title, value, maxValue, isPercentage }) => {
        const percentage = calculatePercentage(value, maxValue);

        return (
            <div className="col-xl-3 col-sm-6">
                <div className="card bg-gradient shadow-sm border-0">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <div className="d-flex align-items-center">
                                <div className={`rounded-circle bg-${color} bg-opacity-10 p-2 me-3`}>
                                    <i className={`bi ${icon} fs-4 text-${color}`}></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 text-muted">{title}</h6>
                                    <h4 className="mb-0 fw-bold">
                                        {isPercentage ? `${value}%` : value.toLocaleString()}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className={`progress bg-${color} bg-opacity-10`} style={{ height: "4px" }}>
                            <div
                                className={`progress-bar bg-${color}`}
                                style={{ width: `${percentage}%` }}
                                title={`${percentage}% of ${maxValue.toLocaleString()}`}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Calculate the totals
    const totalItems = stuff.length;
    const totalStock = filteredStuff.reduce((total, item) =>
        total + (item.stuff_stock?.total_available || 0), 0);
    const totalDefec = filteredStuff.reduce((total, item) =>
        total + (item.stuff_stock?.total_defec || 0), 0);
    const grandTotal = totalStock + totalDefec;

    // Calculate stock health percentage
    const stockHealthPercentage = totalStock + totalDefec > 0
        ? Math.round((totalStock / (totalStock + totalDefec)) * 100)
        : 0;

    const navigate = useNavigate();

    // Export to Excel function
    function exportExcel() {
        // Create a new workbook and add the worksheet
        const formattedData = stuff.map((item, index) => ({
            No: index + 1,
            Name: item.name,
            Type: item.type,
            TotalAvailable: item.stuff_stock ? item.stuff_stock.total_available : 0,
            TotalDefec: item.stuff_stock ? item.stuff_stock.total_defec : 0,
            CreatedAt: new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                // hour12: false
            }).format(new Date(item.created_at))
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        })
        saveAs(file, "data_stuffs.xlsx");
    }

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
        axios.get(`${API_URL}/stuffs`)
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
        axios.post(API_URL + "/stuffs", formModal)
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
        axios.delete(`${API_URL}/stuffs/${deleteModal.stuffId}`)
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

    function handleInboundBtn(item) {
        setFormInbound({
            stuff_id: item.id,
            stuffName: item.name,
            total: "",
            proof_file: null,
            error: null
        });
        setIsModalInboundOpen(true);
    }

    function handleInboundSubmit(e) {
        e.preventDefault();

        // Validation
        if (!formInbound.total || !formInbound.proof_file) {
            setFormInbound(prev => ({
                ...prev,
                error: "Total items and proof image are required"
            }));
            return;
        }

        const data = new FormData();
        data.append("stuff_id", formInbound.stuff_id);
        data.append("total", formInbound.total);
        data.append("proof_file", formInbound.proof_file);

        axios.post(API_URL + "/inbound-stuffs", data)
            .then(res => {
                setIsModalInboundOpen(false);
                setFormInbound({
                    stuff_id: "",
                    stuffName: "",
                    total: "",
                    proof_file: null,
                    error: null
                });
                setAlert({
                    message: "Stock added successfully!",
                    severity: "success"
                });
                fetchData();
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    navigate("/login");
                    return;
                }
                setFormInbound(prev => ({
                    ...prev,
                    error: err.response?.data?.message || "Failed to add stock"
                }));
            });
    }

    // Use in your JSX
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

            <div className="container">

                {/* Replace your existing stats cards with this */}
                <div className="row mb-4 g-3">
                    <StatsCard
                        icon="bi-box"
                        color="primary"
                        title="Total Items"
                        value={totalItems}
                        maxValue={grandTotal}
                    />
                    <StatsCard
                        icon="bi-boxes"
                        color="success"
                        title="Total Stock"
                        value={totalStock}
                        maxValue={grandTotal}
                    />
                    <StatsCard
                        icon="bi-exclamation-triangle"
                        color="danger"
                        title="Total Defec"
                        value={totalDefec}
                        maxValue={grandTotal}
                    />
                    <StatsCard
                        icon="bi-heart"
                        color="info"
                        title="Stock Health"
                        value={stockHealthPercentage}
                        maxValue={100}
                        isPercentage={true} // Add this prop
                    />
                </div>

                <div className="card border-0 shadow-sm">
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
                                className="btn btn-dark btn-sm px-3 d-flex justify-content-center align-items-center gap-2"
                                onClick={() => setIsModalOpen(true)}
                                style={{ width: "200px" }}
                            >
                                <i className="bi bi-plus-lg"></i>
                                <span>Add Items</span>
                            </button>
                            <button
                                className="btn btn-outline-dark btn-sm px-3 d-flex justify-content-center align-items-center gap-2"
                                onClick={exportExcel}
                                style={{ width: "200px" }}
                            >
                                <i className="bi bi-plus-lg"></i>
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
                                        <th className="py-3 px-4">Items</th>
                                        <th className="py-3 px-4">Type</th>
                                        <th className="py-3 px-4">Stock Available</th>
                                        <th className="py-3 px-4">Stock Defective</th>
                                        <th className="py-3 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStuff.length > 0 ? (
                                        paginate(filteredStuff).map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="py-3 px-4">
                                                    {((currentPage - 1) * itemsPerPage) + index + 1}
                                                </td>
                                                <td className="py-3 px-4 fw-semibold">{item.name}</td>
                                                <td className="py-3 px-4 fw-semibold" >{item.type}</td>
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
                                                            className="btn btn-soft-dark btn-outline-dark btn-sm px-3"
                                                            onClick={() => handleInboundBtn(item)} // Changed from value.id to item.id
                                                        >
                                                            <i className="bi bi-plus-lg me-1"></i>
                                                            Add Stock
                                                        </button>
                                                        <button
                                                            className="btn btn-soft-dark btn-outline-dark btn-sm px-3"
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
                                            <td colSpan={6} className="text-center py-4 text-muted">
                                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                                No data found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {filteredStuff.length > 0 && (
                            <Pagination
                                totalItems={filteredStuff.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
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

            <Modal
                isOpen={isModalInboundOpen}
                onclose={() => {
                    setIsModalInboundOpen(false);
                    setFormInbound({
                        stuff_id: "",
                        stuffName: "",
                        total: "",
                        proof_file: null,
                        error: null
                    });
                }}
                title={`Add Stock - ${formInbound.stuffName}`}
            >
                <form onSubmit={handleInboundSubmit} className="needs-validation" noValidate>
                    {formInbound.error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>{formInbound.error}</div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Total Items <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-control ${formInbound.error && !formInbound.total ? 'is-invalid' : ''}`}
                            value={formInbound.total}
                            onChange={(e) => setFormInbound(prev => ({
                                ...prev,
                                total: e.target.value,
                                error: null
                            }))}
                            placeholder="Enter total items"
                            min="1"
                            required
                        />
                        {formInbound.error && !formInbound.total && (
                            <div className="invalid-feedback">Total items is required</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Proof Image <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            className={`form-control ${formInbound.error && !formInbound.proof_file ? 'is-invalid' : ''}`}
                            onChange={(e) => setFormInbound(prev => ({
                                ...prev,
                                proof_file: e.target.files[0],
                                error: null
                            }))}
                            accept="image/*"
                            required
                        />
                        {formInbound.error && !formInbound.proof_file && (
                            <div className="invalid-feedback">Proof image is required</div>
                        )}
                        <small className="text-muted">
                            Supported formats: JPG, PNG, GIF (max 2MB)
                        </small>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setIsModalInboundOpen(false);
                                setFormInbound({
                                    stuff_id: "",
                                    stuffName: "",
                                    total: "",
                                    proof_file: null,
                                    error: null
                                });
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={!formInbound.total || !formInbound.proof_file}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Add Stock
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}