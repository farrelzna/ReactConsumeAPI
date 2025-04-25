import React from 'react';

const PremiumModal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop show">
            <div className={`premium-modal modal fade show d-block`}>
                <div className={`modal-dialog modal-${size} modal-dialog-centered`}>
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header border-0 bg-light px-4 py-3">
                            <h5 className="modal-title fw-semibold">{title}</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose}
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;