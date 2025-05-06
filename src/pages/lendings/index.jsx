import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constant';
import Modal from '../../components/Modal';
import { HiCube, HiCheck, HiX, HiExclamationCircle, HiUser, HiClipboardList } from 'react-icons/hi';

export default function Lendings() {
    const [stuffs, setStuffs] = useState([]);
    const [error, setError] = useState({});
    const [alert, setAlert] = useState('');

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({
        stuff_id: '',
        name: '',
        total_stuff: 0,
        note: '',
    });

    useEffect(() => {
        fetchLendings();
    }, []);

    function fetchLendings() {
        axios.get(API_URL + '/stuffs')
            .then((response) => {
                setStuffs(response.data.data);
            })
            .catch((error) => {
                if(error.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    navigate('/login');
                } 
                setError(error.response?.data || {});
            });
    }
    function handleBtn(stuffid) {
        return () => {
            setFormModal({...formModal, stuff_id: stuffid});
            setIsModalOpen(true);
        };
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        axios.post(API_URL + '/lendings', formModal)
        .then((res) => {
            setIsModalOpen(false);
            setFormModal({ stuff_id: "", name: "", total_stuff: 0, note: "" });
            setAlert('success add new lending');
            fetchLendings();
            setTimeout(() => {
                setAlert('');
            }, 3000);
        })
        .catch((err) => {
            if(err.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                navigate('/login');
            }
            setError(err.response?.data || {});
        });
    }

    return (
        <div className="container-fluid p-4">
            {alert && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <HiCheck className="me-2" /> {alert}
                    <button type="button" className="btn-close" onClick={() => setAlert('')}></button>
                </div>
            )}

            <div className="row mb-4">
                <div className="col">
                    <h4 className="mb-3">Available Items</h4>
                    <p className="text-muted">Select an item to create a new lending request</p>
                </div>
            </div>

            <div className="row g-4">
                {stuffs.map((item, index) => (
                    <div className="col-12 col-md-6 col-lg-4" key={index}>
                        <div className="card h-100 border-0 shadow-sm hover-shadow">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-3 p-3 me-3">
                                        <a href={item.proof_file} target="_blank"><HiCube size={24} /></a>
                                    </div>
                                    <div>
                                        <h5 className="card-title mb-1">{item.name}</h5>
                                        <span className="badge bg-light text-dark">{item.type}</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Available Stock</span>
                                        <span className="fw-bold">
                                            {item.stuff_stock?.total_available || 0}
                                        </span>
                                    </div>
                                    <div className="progress" style={{ height: "6px" }}>
                                        <div 
                                            className="progress-bar bg-success" 
                                            style={{ 
                                                width: `${(item.stuff_stock?.total_available / (item.stuff_stock?.total_available + item.stuff_stock?.total_defec || 1)) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <button 
                                    className={`btn ${item.stuff_stock?.total_available ? 'btn-primary' : 'btn-outline-secondary'} w-100`}
                                    disabled={!item.stuff_stock?.total_available}
                                    onClick={handleBtn(item.id)}
                                >
                                    {item.stuff_stock?.total_available ? (
                                        <>
                                            <HiCheck className="me-2" />
                                            Create Lending Request
                                        </>
                                    ) : (
                                        <>
                                            <HiX className="me-2" />
                                            Out of Stock
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <LendingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                formData={formModal}
                setFormData={setFormModal}
                error={error}
            />
        </div>
    );
}

const LendingModal = ({ isOpen, onClose, onSubmit, formData, setFormData, error }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Lending Request">
            <div className="modal-body p-4">
                {error && Object.keys(error).length > 0 && (
                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                        <div className="d-flex align-items-center">
                            <HiExclamationCircle size={20} className="me-2" />
                            <div className="flex-grow-1">
                                {Object.entries(error).map(([key, value]) => (
                                    <div key={key}>
                                        {typeof value === "string" ? value : JSON.stringify(value)}
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="btn-close" onClick={onClose}>x</button>
                        </div>
                    </div>
                )}

                <form onSubmit={onSubmit} className="lending-form">
                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Full Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                                <HiUser className="text-muted" />
                            </span>
                            <input 
                                type="text"
                                className="form-control border-0 bg-light py-2"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Quantity <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                                <HiCube className="text-muted" />
                            </span>
                            <input 
                                type="number"
                                min="1"
                                className="form-control border-0 bg-light py-2"
                                placeholder="Enter quantity"
                                value={formData.total_stuff}
                                onChange={(e) => setFormData({...formData, total_stuff: e.target.value})}
                            />
                        </div>
                        <small className="text-muted">Available stock: {/* Add available stock number here */}</small>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Note <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0" style={{ height: "80px" }}>
                                <HiClipboardList className="text-muted" />
                            </span>
                            <textarea 
                                className="form-control border-0 bg-light py-2"
                                rows="3"
                                placeholder="Add a note about this lending"
                                value={formData.note}
                                onChange={(e) => setFormData({...formData, note: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button 
                            type="button" 
                            className="btn btn-light px-4"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary px-4"
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}