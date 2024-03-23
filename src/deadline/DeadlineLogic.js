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
            let n = 7;
            let datum = new Date();
            let heute = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
            switch(lastDeadline.weekday) {
                case "Montag":
                    if(heute.getDay() == 1){
                        n = n + 1 - 7;
                    }
                    else{
                        n = n + 1;
                    }
                    break;
                case "Dienstag":
                    if(heute.getDay() == 2){
                        n = n + 2 - 7;
                    }
                    else{
                        n = n + 2;
                    }
                    break;
                case "Mittwoch":
                    if(heute.getDay() < 3){
                        n = n + 3 - 7;
                    }
                    else{
                        n = n + 3;
                    }
                    break;
                case "Donnerstag":
                    if(heute.getDay() < 4){
                        n = n + 4 - 7;
                    }
                    else{
                        n = n + 4;
                    }
                    break;
                case "Freitag":
                    if(heute.getDay() < 5){
                        n = n + 5 - 7;
                    }
                    else{
                        n = n + 5;
                    }
                    break;
                case "Samstag":
                    if(heute.getDay() < 6){
                        n = n + 6 - 7;
                    }
                    else{
                        n = n + 6;
                    }
                    break;
                case "Sonntag":
                    if(heute.getDay() < 7){
                        n = n + 7 - 7;
                    }
                    else{
                        n = n + 7;
                    }
                    break;
            }
            let timeNow = datum.getHours() + ":" + datum.getMinutes() + ":" + datum.getSeconds()
         
            let wochentag = datum.getDay();
            if(wochentag == 1){wochentag = "Montag";}
            else if(wochentag == 2){wochentag = "Dienstag";}
            else if(wochentag == 3){wochentag = "Mittwoch";}
            else if(wochentag == 4){wochentag = "Donnerstag";}
            else if(wochentag == 5){wochentag = "Freitag";}
            else if(wochentag == 6){wochentag = "Samstag";}
            else{wochentag = "Sonntag";}
            
            if(lastDeadline.time < timeNow && lastDeadline.weekday == wochentag){
                n = n + 7;
            }
            var deadline = new Date(heute.setDate(heute.getDate()-heute.getDay() + n));
            
            let date = deadline;
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            
            const timeString = lastDeadline.time;
            const parsedTime = new Date(`2000-01-01T${timeString}`);
            const formattedTime = parsedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            date = "Deadline: " + day + "." + month + "." + year + " " + formattedTime + " Uhr";
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
