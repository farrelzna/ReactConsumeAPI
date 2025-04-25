import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import AlertSnackbar from "../../components/AlertSnackbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';


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

    const paginate = (items) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return items.slice(indexOfFirstItem, indexOfLastItem);
    };

    const calculatePercentage = (value, total) => {
        if (!total) return 0;
        return Math.min(Math.round((value / total) * 100), 100);
    };
    const StatsCard = ({ icon, color, title, value, maxValue, isPercentage }) => {
        const percentage = calculatePercentage(value, maxValue);

        return (
            <div className="col-xl-3 col-sm-6">
                <div className="card bg-gradient shadow-sm border-0">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <div className="d-flex align-items-center">
                                <div className={`rounded-circle bg-${color} bg-opacity-10 me-3`} style={{ padding: "10px 15px 10px 15px" }}>
                                    <i className={`bi ${icon} text-${color}`}></i>
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
    const totalInbound = filteredStuff.reduce((total, item) => 
        total + (item.total || 0), 0
    ); // New calculation for total inbound
    const totalDefec = filteredStuff.reduce((total, item) =>
        total + (item.stuff_stock?.total_defec || 0), 0);
    const grandTotal = totalInbound + totalDefec;

    // Calculate stock health percentage
    const stockHealthPercentage = totalInbound + totalDefec > 0
        ? Math.round((totalInbound / (totalInbound + totalDefec)) * 100)
        : 0;


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

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = stuff.filter((item) => 
            item.stuff.name.toLowerCase().includes(search.toLowerCase()) ||
            item.stuff.type.toLowerCase().includes(search.toLowerCase())
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

    function exportExcel() {
        // Create a new workbook and add the worksheet
        const formattedData = stuff.map((item, index) => ({
            No: index + 1,
            Name: item.stuff.name,
            Type: item.stuff.type,
            TotalAvailable: item.stuff_stock ? item.stuff_stock.total_available : 0,
            ProofFile: item.proof_file,
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
        saveAs(file, "data_inbound-stuffs.xlsx");
    }

    const [isChartOpen, setIsChartOpen] = useState(true);

    // Update the chartData object
    const chartData = {
        labels: filteredStuff.map(item => item.stuff.name),
        datasets: [
            {
                label: 'Available Stock',
                data: filteredStuff.map(item => item.stuff_stock?.total_available || 0),
                backgroundColor: 'rgba(25, 135, 84, 0.2)',
                borderColor: 'rgb(25, 135, 84)',
                borderWidth: 1
            },
            {
                label: 'Defective Stock',
                data: filteredStuff.map(item => item.stuff_stock?.total_defec || 0),
                backgroundColor: 'rgba(220, 53, 69, 0.2)',
                borderColor: 'rgb(220, 53, 69)',
                borderWidth: 1
            },
            {
                label: 'Inbound Stock',
                data: filteredStuff.map(item => item.total || 0),
                backgroundColor: 'rgba(13, 110, 253, 0.2)',
                borderColor: 'rgb(13, 110, 253)',
                borderWidth: 1
            }
        ]
    };

    // Update the chart options for better visualization
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    usePointStyle: true
                }
            },
            title: {
                display: true,
                text: 'Stock Analysis Comparison',
                padding: 20,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                padding: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 13
                },
                bodyFont: {
                    size: 12
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false
                },
                ticks: {
                    padding: 10
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    padding: 10
                }
            }
        },
        maintainAspectRatio: false,
        barThickness: 30,
        maxBarThickness: 38,
        categoryPercentage: 0.8,
        barPercentage: 0.9
    };

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const sortItems = (items) => {
        if (!sortConfig.key) return items;

        return [...items].sort((a, b) => {
            // Handle nested object properties (stuff.name and stuff.type)
            const aValue = sortConfig.key.includes('.')
                ? sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a)?.toLowerCase()
                : a[sortConfig.key]?.toLowerCase();
            const bValue = sortConfig.key.includes('.')
                ? sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b)?.toLowerCase()
                : b[sortConfig.key]?.toLowerCase();

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <>
            <div className="container">
                <AlertSnackbar
                    alert={alert}
                    errors={deleteModal.error}
                    onClose={() => {
                        setAlert({ message: null, severity: "success" });
                        setModalError(null);
                        setDeleteModal(prev => ({ ...prev, error: null }));
                    }}
                />

                {/* Replace your existing stats cards with this */}
                <div className="row mb-4 g-3">
                    <StatsCard
                        icon="bi-box"
                        color="primary"
                        title="Total Items"
                        value={totalItems}
                        maxValue={totalItems}
                    />
                    <StatsCard
                        icon="bi-boxes"
                        color="success"
                        title="Total Inbounds"
                        value={totalInbound} // Changed from totalStock to totalInbound
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

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white py-3">
                        <button
                            className="d-flex align-items-center justify-content-between w-100 fw-semibold p-0 bg-transparent border-0"
                            type="button"
                            onClick={() => setIsChartOpen(!isChartOpen)}
                            aria-expanded={isChartOpen}
                        >
                            <span>Stock Analysis Chart</span>
                            <ChevronIcon isOpen={isChartOpen} />
                        </button>
                    </div>
                    <div className={`collapse ${isChartOpen ? 'show' : ''}`}>
                        <div className="card-body">
                            <div style={{ height: '400px', width: '100%' }}>
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
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
                                    placeholder="Search by name or type..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        className="btn btn-light border-0"
                                        onClick={() => setSearch('')}
                                        type="button"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                            </div>
                            <button
                                className="btn btn-outline-dark btn-sm px-3 d-flex justify-content-center align-items-center gap-2"
                                onClick={exportExcel}
                                style={{ width: "200px" }}
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
                                        <th
                                            className="py-3 px-4 sortable"
                                            onClick={() => requestSort('stuff.name')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex align-items-center">
                                                Items
                                                <SortIcon 
                                                    direction={sortConfig.key === 'stuff.name' ? sortConfig.direction : null} 
                                                />
                                            </div>
                                        </th>
                                        <th
                                            className="py-3 px-4 sortable"
                                            onClick={() => requestSort('stuff.type')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex align-items-center">
                                                Type
                                                <SortIcon 
                                                    direction={sortConfig.key === 'stuff.type' ? sortConfig.direction : null}
                                                />
                                            </div>
                                        </th>
                                        <th className="py-3 px-4">Stock Available (New Item)</th>
                                        <th className="py-3 px-4">Action</th>
                                        <th className="py-3 px-4">Proof File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(sortItems(filteredStuff)).length > 0 ? (
                                        paginate(sortItems(filteredStuff)).map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4 fw-semibold">{item.stuff.name}</td>
                                                <td className="py-3 px-4 fw-semibold" >{item.stuff.type}</td>
                                                <td className="py-3 px-4">
                                                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2" style={{ width: "150px" }}>
                                                        {item.total}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="py-3 px-4 gap-2">
                                                        <button
                                                            className="btn btn-soft-danger btn-outline-danger btn-sm px-3"
                                                            style={{ width: "150px" }}
                                                            onClick={() => handleDelete(item.id, item.stuff.name)} // Changed to use stuff.name
                                                        >
                                                            <i className="bi bi-trash me-1"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-3 border-1 text-center">
                                                    <a href={item.proof_file} target="_blank"><img src={item.proof_file} alt="" style={{ width: "100px", height: "100px", borderRadius: "5px" }} /></a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4 text-muted">
                                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                                <span className="fw-semibold">No items found</span>
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

            {/* Replace the existing Modal component with this PremiumModal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                title="Delete Confirmation"
                size="sm"
            >
                <div className="text-center mb-4">
                    <div className="bg-danger bg-opacity-10 rounded-circle mx-auto mb-3" style={{ width: 'fit-content', padding: '20px 30px 20px 30px' }}>
                        <i className="bi bi-exclamation-triangle text-danger fs-2"></i>
                    </div>
                    <h5 className="fw-semibold mb-2">Delete Confirmation</h5>
                    <p className="text-muted mb-1">Are you sure you want to delete inbound record:</p>
                    <p className="fw-semibold text-dark mb-0">{deleteModal.stuffName}?</p>
                </div>

                {deleteModal.error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                        <div>{deleteModal.error.message}</div>
                    </div>
                )}

                <div className="d-flex justify-content-center gap-2 mt-4">
                    <button
                        className="btn btn-light px-4"
                        onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger px-4"
                        onClick={handleConfirmDelete}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </ >
    );
}

const ChevronIcon = ({ isOpen }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
            transform: isOpen ? 'rotate(-180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease-in-out'
        }}
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const SortIcon = ({ direction }) => {
    if (!direction) {
        return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-muted ms-1 opacity-50">
                <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
            </svg>
        );
    }
    
    return (
        <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
            className="text-primary ms-1"
            style={{
                transform: direction === 'desc' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease'
            }}
        >
            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
    );
};