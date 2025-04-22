import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import AlertSnackbar from "../../components/AlertSnackbar";

export default function InboundIndex() {
    const [stuff, setStuffs] = useState([]);
    const [error, setError] = useState([]);
    const [modalError, setModalError] = useState(null);
    const [alert, setAlert] = useState({ message: null, severity: "success" });
    const [search, setSearch] = useState("");
    const [filteredStuff, setFilteredStuff] = useState([]);

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        inboundId: null,
        stuffName: '',
        error: null
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = stuff.filter((item) =>
            item.stuff.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredStuff(filtered);
    }, [search, stuff]);

    function fetchData() {
        axios.get(`${API_URL}/inbound-stuffs`)
            .then((res) => {
                setStuffs(res.data.data);
                console.log(res.data.data);
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

    function handleDelete(inboundId, stuffName) {
        setDeleteModal({
            isOpen: true,
            inboundId, // Changed from InboundStuffId
            stuffName, // Will show the stuff name in modal
            error: null
        });
    }

    function handleConfirmDelete() {
        axios.delete(`${API_URL}/inbound-stuffs/${deleteModal.inboundId}`, {
        })
            .then(res => {
                setDeleteModal({
                    isOpen: false,
                    inboundId: null,
                    stuffName: '',
                    error: null
                });
                setAlert({ 
                    message: "Successfully deleted inbound record", 
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
                setDeleteModal(prev => ({
                    ...prev,
                    error: err.response?.data || { message: "Failed to delete inbound record" }
                }));
            });
    }

    const paginate = (items) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return items.slice(indexOfFirstItem, indexOfLastItem);
    };

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

    return (
        <>
            <AlertSnackbar
                alert={alert}
                errors={deleteModal.error}
                onClose={() => {
                    setAlert({ message: null, severity: "success" });
                    setModalError(null);
                    setDeleteModal(prev => ({ ...prev, error: null }));
                }}
            />

            <div className="container mt-5">

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
                                        <th className="py-3 px-4">Stock Available (New Item)</th>
                                        <th className="py-3 px-4">Proof File</th>
                                        <th className="py-3 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(filteredStuff).length > 0 ? (
                                        paginate(filteredStuff).map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4 fw-semibold">{item.stuff.name}</td>
                                                <td className="py-3 px-4 fw-semibold" >{item.stuff.type}</td>
                                                <td className="py-3 px-4">
                                                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                                                        {item.total}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 border-1">
                                                    <a href={item.proof_file} ><img src={item.proof_file} alt="" style={{ width: "100px", height: "100px" }} /></a>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button
                                                            className="btn btn-soft-danger btn-outline-danger btn-sm px-3"
                                                            onClick={() => handleDelete(item.id, item.stuff.name)} // Changed to use stuff.name
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
                    <Pagination
                        totalItems={filteredStuff.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            <Modal
                isOpen={deleteModal.isOpen}
                onclose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                title="Delete Confirmation"
            >
                <p>Are you sure you want to delete inbound record for: <strong>{deleteModal.stuffName}</strong>?</p>
                
                {deleteModal.error && (
                    <div className="alert alert-danger">
                        {deleteModal.error.message}
                    </div>
                )}

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
        </>
    );
}