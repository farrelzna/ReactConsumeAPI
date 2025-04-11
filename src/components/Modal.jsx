import React from 'react';

export default function Modal({ isOpen, onclose, title, children }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-semibold">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onclose}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body pt-3">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}