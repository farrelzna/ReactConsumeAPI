import React from "react";

export default function Profile() {
    return (
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="row d-flex justify-content-between">
                <div className="col-md-3 border-right shadow-sm">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <img
                            className="rounded-circle"
                            width="150px"
                            src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                        />
                        <span className="font-weight-bold">Jeiden cn</span>
                        <span className="text-black-50">jeidencn@example.com</span>
                        <span className="text-muted">Role: Walmart Bag</span>
                        <span className="text-success fw-bold">Status: Active</span>
                    </div>
                </div>
                <div className="col-md-8 border-right shadow-sm d-flex justify-content-center">
                    <div className="p-2 py-5">
                        <div className="align-items-center">
                            <h4 className="mb-">Profile Details</h4>
                        </div>
                        <div className="row mt-5">
                            <div className="col-md-6">
                                <p><strong>User ID:</strong> #12345</p>
                                <p><strong>Username:</strong> Edogaru</p>
                                <p><strong>Email:</strong> edogaru@mail.com.my</p>
                                <p><strong>Phone:</strong> +62 812 3456 7890</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Role:</strong> Admin</p>
                                <p><strong>Status:</strong> Active</p>
                                <p><strong>Join Date:</strong> 12 Jan 2022</p>
                                <p><strong>Address:</strong> Jl. Mawar No. 10, Jakarta</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 