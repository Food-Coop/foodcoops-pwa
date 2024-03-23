import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';

export function DeadlineLogic() {
    const [isLoadingDeadline, setIsLoadingDeadline] = useState(true);
    const [lastDeadline, setLastDeadline] = useState(null);

    const api = useApi();

    useEffect(() => {
        api.readLastDeadline()
            .then(r => r.json())
            .then(r => {
                setLastDeadline(r);
                setIsLoadingDeadline(false);
            });
    }, []);

    const getDeadline = () => {
        if (isLoadingDeadline) {
            return (
                <div className="spinner-border" role="status" style={{ margin: "5rem" }}>
                    <span className="sr-only">Loading...</span>
                </div>
            );
        } else {

            const dateString = lastDeadline.datum;
            let date = new Date(dateString); 
            const day = String(date.getDate()).padStart(2, '0'); 
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${day}.${month}.${year}`;

            
            const timeString = lastDeadline.time;
            const [hours, minutes, _] = timeString.split(":");
            const formattedTime = `${hours}:${minutes}`;

            date = "Deadline: " + formattedDate + " " + formattedTime + " Uhr";
            return (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    border: '1px solid #f5c6cb', 
                    borderRadius: '4px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    fontSize: '20px',
                    marginTop: '10px',
                    marginBottom: '10px'
                }}>
                    {date}
                </div>
            );
        }
    };

    return getDeadline();
}