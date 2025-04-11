import React from 'react';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function AlertSnackbar({ alert, onClose, errors }) {
    return (
        <Snackbar
            open={!!alert.message || !!errors}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ 
                vertical: 'bottom',  // Changed from 'top' to 'bottom'
                horizontal: 'right' 
            }}
            sx={{
                mb: 2,  // Add margin bottom
                mr: 2   // Add margin right
            }}
        >
            <Alert 
                onClose={onClose} 
                severity={alert.severity || "error"} 
                variant="filled"
                sx={{ 
                    width: '100%',
                    boxShadow: 3  // Optional: adds shadow for better visibility
                }}
            >
                {alert.message && <AlertTitle>{alert.message}</AlertTitle>}
                {errors && (
                    <div>
                        {Object.entries(errors.data || {}).length > 0 ? (
                            <ul style={{ padding: '0 1rem', margin: 0 }}>
                                {Object.entries(errors.data).map(([key, value]) => (
                                    <li key={key}>{value}</li>
                                ))}
                            </ul>
                        ) : (
                            errors.message
                        )}
                    </div>
                )}
            </Alert>
        </Snackbar>
    );
}