import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiChartBar, HiCube, HiArrowDown, HiUser, HiLogout, HiMenuAlt2 } from 'react-icons/hi';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [collapsed, setCollapsed] = useState(false);
    const [openDropdown, setOpenDropdown] = useState('');

    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? '' : menu);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}>
            {/* Brand Section - Always visible */}
            <div className="sidebar-header">
                <div className="d-flex align-items-center gap-3">
                    <div className="brand-icon">
                        <HiCube size={24} />
                    </div>
                    {!collapsed && (
                        <div className="brand-text">
                            <h5 className="mb-0">Inventaris</h5>
                            <small>Management</small>
                        </div>
                    )}
                </div>
                <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                    <HiMenuAlt2 size={20} />
                </button>
            </div>

            {/* Navigation - Only visible when logged in */}
            {user && (
                <>
                    <div className="sidebar-user">
                        <div className="d-flex align-items-center gap-3">
                            <div className="user-avatar">
                                <HiUser size={20} />
                            </div>
                            {!collapsed && (
                                <div className="user-info">
                                    <h6 className="mb-0">{user.username}</h6>
                                    <span className="user-role rounded-1">{user.role}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-nav">
                        <nav>
                            <Link to="/dashboard" 
                                className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                data-title="Dashboard">
                                <HiChartBar size={20} />
                                {!collapsed && <span>Dashboard</span>}
                            </Link>

                            {user.role === "staff" ? (
                                <div className="nav-group">
                                    <button 
                                        className={`nav-item dropdown-toggle ${openDropdown === 'lending' ? 'active' : ''}`}
                                        onClick={() => toggleDropdown('lending')}
                                        data-title="Lending"
                                    >
                                        <HiCube size={20} />
                                        {!collapsed && (
                                            <>
                                                <span className="flex-grow-1 text-start">Lending</span>
                                                <HiArrowDown 
                                                    size={16} 
                                                    className={`transition-transform ${openDropdown === 'lending' ? 'rotate-180' : ''}`}
                                                />
                                            </>
                                        )}
                                    </button>
                                    <div className={`nav-submenu ${openDropdown === 'lending' ? 'show' : ''}`}>
                                        <Link to="staff/lendings" className="nav-subitem">
                                            <HiArrowDown size={18} />
                                            {!collapsed && <span>New</span>}
                                        </Link>
                                        <Link to="staff/lendings/data" className="nav-subitem">
                                            <HiCube size={18} />
                                            {!collapsed && <span>Data</span>}
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link to="/admin/stuffs" 
                                        className={`nav-item ${location.pathname === '/dashboard/stuffs' ? 'active' : ''}`}>
                                        <HiCube size={20} />
                                        {!collapsed && <span>Items</span>}
                                    </Link>
                                    <Link to="/admin/inbound" 
                                        className={`nav-item ${location.pathname === '/dashboard/inbound' ? 'active' : ''}`}>
                                        <HiArrowDown size={20} />
                                        {!collapsed && <span>Inbound</span>}
                                    </Link>
                                </>
                            )}

                            <Link to="/profile" 
                                className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                                <HiUser size={20} />
                                {!collapsed && <span>Profile</span>}
                            </Link>
                        </nav>
                    </div>

                    {/* Logout button - Only visible when logged in */}
                    <div className="sidebar-footer">
                        <button className="btn-logout" onClick={handleLogout}>
                            <HiLogout size={20} />
                            {!collapsed && <span>Logout</span>}
                        </button>
                    </div>
                </>
            )}

            {/* Login link - Only visible when not logged in */}
            {!user && (
                <div className="sidebar-footer">
                    <Link to="/login" className="btn-login">
                        <HiUser size={20} />
                        {!collapsed && <span>Login</span>}
                    </Link>
                </div>
            )}
        </div>
    );
}