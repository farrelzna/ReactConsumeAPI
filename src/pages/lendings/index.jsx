import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constant';
import Modal from '../../components/modal';

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
        <>
        {
            alert != "" ? (
                <div className='alert alert-success'>
                    {alert}
                </div>
            ) : ""
        }
            <div className='row my-3'>
                {
                    stuffs.map((item, index) => (
                        <div className='col-4 mx-2 card text-center' key={index}>
                            <h5>{item.name}</h5>
                            <p>Total Available : {item.stuff_stock ? item.stuff_stock.total_available : 0}</p>
                            <button className='btn btn-outline-primary' disabled={!(item.stuff_stock && item.stuff_stock.total_available)} onClick={handleBtn(item.id)}>
                                {item.stuff_stock && item.stuff_stock.total_available ? 'select' : 'stock not available'}
                            </button>
                        </div>
                    ))
                }
            </div>

           <Modal
                   isOpen={isModalOpen}
                   onClose={() => setIsModalOpen(false)}
                   title="Add Lending"
                 >
                     {Object.keys(error || {}).length > 0 && (
                       <ol className="alert alert-danger shadow-sm">
                         {Object.entries(error || {}).map(([key, value]) => (
                           <li key={key}>
                             {typeof value === "string" || typeof value === "number"
                               ? value
                               : JSON.stringify(value)}
                           </li>
                         ))}
                         <li>
                           {typeof error.message === "string"
                             ? error.message
                             : JSON.stringify(error.message || "An error occurred.")}
                         </li>
                       </ol>
                     )}
                <form onSubmit={handleFormSubmit}>
                    <div className='form-group'>
                        <label className='form-label'>Name <span className='text-danger'>*</span></label>
                        <input className='form-control' type='text' onChange={(e) => setFormModal({...formModal, name: e.target.value})} />
                    </div>
                    <div className='form-group mt-2'>
                        <label className='form-label'>total stuff <span className='text-danger'>*</span></label>
                        <input className='form-control' type='number' onChange={(e) => setFormModal({...formModal, total_stuff: e.target.value})} />
                    </div>
                    <div className='form-group'>
                        <label className='form-label'>note <span className='text-danger'>*</span></label>
                        <input className='form-control' type='text' onChange={(e) => setFormModal({...formModal, note: e.target.value})} />
                    </div>
                    <button type='submit' className='btn btn-primary mt-3'>proccess</button>
                </form>
            </Modal>
        </>
    );
}