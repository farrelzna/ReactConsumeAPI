import React from "react";

export default function Profile() {
    return (
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-3 border-right shadow-sm">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <img
                            className="rounded-circle mt-5"
                            width="150px"
                            src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                        />
                        <span className="font-weight-bold">Edogaru</span>
                        <span className="text-black-50">edogaru@mail.com.my</span>
                        <span className="text-muted">Role: Admin</span>
                        <span className="text-success">Status: Active</span>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="p-3 py-5">
                        <h4 className="mb-3">Profile Details</h4>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Username:</strong> Edogaru</p>
                                <p><strong>Email:</strong> edogaru@mail.com.my</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Role:</strong> Admin</p>
                                <p><strong>Status:</strong> Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
