import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';

export function DeadlineLogic() {
    const [isLoadingDeadline, setIsLoadingDeadline] = useState(true);
    const [deadline, setDeadline] = useState(new Date(Date.now() + 2 * 60000).toISOString());

    const api = useApi();

    useEffect(() => {
        api.readLastDeadline()
            .then(r => r.json())
            .then(r => {
                setIsLoadingDeadline(false);
                if (r && r.id) {
                    api.readCurrentDeadline(r.id)
                        .then(r => r.json())
                        .then(r => {
                            setDeadline(r);
                        })
                        .catch(error => {
                            console.error('Error fetching deadline:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching last deadline:', error);
            });
    },
    
    []);

    const getDeadline = () => {
        if (isLoadingDeadline || !deadline) {
            return (
                <div className="spinner-border" role="status" style={{ margin: "5rem" }}>
                    <span className="sr-only">Loading...</span>
                </div>
            );
        } else {

            const dateString = deadline;
            const dateObj = new Date(dateString);

            const day = String(dateObj.getDate()).padStart(2, '0'); 
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const formattedDate = `${day}.${month}.${year}`;

            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;

            let date = "Deadline: " + formattedDate + " " + formattedTime + " Uhr";
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