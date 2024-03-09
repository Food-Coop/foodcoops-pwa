import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { useApi } from '../ApiService';
import {useKeycloak} from "@react-keycloak/web";
import { BrotTable } from './BrotTable';
import { deepAssign } from '../util'

export function Brot(){
    const columns = React.useMemo(
        () => [
            {   Header: 'BrotID',
                accessor: 'id'
            },
            {
                Header: 'Brotname',
                accessor: 'name',
            },
            {
                Header: 'Gewicht',
                accessor: 'gewicht',
            },
            {
                Header: 'Preis',
                accessor: 'preis',
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
            }
        ]
    );

    const [brotBestellung, setBrotBestellung] = React.useState([]);
    const [brotBestellungBetweenDatesProPerson, setBrotBestellungBetweenDatesProPerson] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAlsoLoading, setIsAlsoLoading] = React.useState(true);
    const [isAlsoLoading2, setIsAlsoLoading2] = React.useState(true);
    const [isLoadingDeadline, setIsLoadingDeadline] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);
    const [brotBestellungSumme, setBrotBestellungSumme] = React.useState([]);
    const [lastdeadline, setLastDeadline] = React.useState([]);

    const api = useApi();
    const {keycloak} = useKeycloak();

    React.useEffect(
        () => {
            api.readBrotBestellungProProdukt()
                .then((r) => r.json())
                .then((r) => {
                    setBrotBestellungSumme(old => {
                        const n = r?._embedded?.brotBestellungRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsAlsoLoading(false);
                }
            );
            api.readBrotBestand()
                .then((r) => r.json())
                .then((r) => {
                    setData(old => {
                        let n = r?._embedded?.brotBestandRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsLoading(false);
                }
            );
            let person_id = keycloak.tokenParsed.preferred_username;
            api.readBrotBestellungBetweenDatesProPerson(person_id)
                .then((r) => r.json())
                .then((r) => {
                    setBrotBestellungBetweenDatesProPerson(old => {
                        let n = r?._embedded?.brotBestellungRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsAlsoLoading2(false);
                }
            );
            api.readBrotBestellungProPerson(person_id)
                .then(r => r.json())
                .then(r => {
                    setBrotBestellung(old => {
                        const n = r?._embedded?.brotBestellungRepresentationList
                        return n === undefined ? old : n;
                    }
                );
            });
            api.readLastDeadline()
                .then(r => r.json())
                .then(r => {
                    setLastDeadline(old => {
                        const n = r?._embedded?.deadlineRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsLoadingDeadline(false);
                });
        }, [reducerValue]
    )

    const checkAlreadyOrdered = (brotBestandId) =>{
        for(let j = 0; j < brotBestellung.length; j++){
            if(brotBestandId == brotBestellung[j].brotbestand.id){
                return brotBestellung[j].id;
            }
        }
        return null;
    }

    const submitBestellung = () => {
        const result = {};
        let preis = 0;
        for (let i = 0; i < data.length; i++) {
            let produktId = "ProduktId" + i;
            let brotBestandId = document.getElementById(produktId).innerText;
            let personId = keycloak.tokenParsed.preferred_username;
            let datum = new Date();
            let bestellId = "Inputfield" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            console.log(bestellId)
            console.log("1: " + document.getElementById(bestellId));
            //Check if Bestellmenge is valid
            if (bestellmenge == "") {
            } 
            else {
                const {_links, ...supported} = data[i];
                deepAssign("person_id", result, personId);
                deepAssign("brotbestand", result, supported);
                deepAssign("bestellmenge", result, bestellmenge);
                deepAssign("datum", result, datum);

                //Überprüfe ob bereits eine Bestellung in dieser Woche getätigt wurde
                let check = checkAlreadyOrdered(brotBestandId);
                if(check != null){
                    //Bestellung updaten
                    console.log(bestellId)
                    console.log("2: " + bestellmenge <= 10);
                    if (bestellmenge <= 10) {
                        console.log("3: " + bestellmenge);
                        (async function () {
                            const response = await api.updateBrotBestellung(result, check);
                            if(response.ok) {
                                forceUpdate();
                            }
                            else{
                                alert("Das Updaten einer Brotbestellung war aufgrund eines Fehlers nicht erfolgreich. Bitte versuchen Sie es erneut.");
                            }
                        })();
                        
                    }
                    else {
                        let artikel = "ProduktName" + i;
                        let artikelname = document.getElementById(artikel).innerText;
                        if(window.confirm("Möchten Sie wirklich " + bestellmenge + " " + artikelname + " bestellen?")){
                            (async function () {
                                const response = await api.updateBrotBestellung(result, check);
                                if(response.ok) {
                                    forceUpdate();
                                }
                                else{
                                    alert("Das Updaten einer Brotbestellung war aufgrund eines Fehlers nicht erfolgreich. Bitte versuchen Sie es erneut.");
                                }
                            })();
                        }
                        else{
                            alert("Okay, dieses Produkt wird nicht bestellt. Alle anderen schon.");
                        }
                    }
                }

                else{
                    //Neue Bestellung abgeben
                    if (bestellmenge <= 10) {
                        (async function () {
                            const response = await api.createBrotBestellung(result);
                            if(response.ok) {
                                forceUpdate();
                            }
                            else{
                                alert("Das Abgeben einer Brotbestellung war aufgrund eines Fehlers nicht erfolgreich. Bitte versuchen Sie es erneut.");
                            }
                        })();
                    }
                    else {
                        let artikel = "ProduktName" + i;
                        let artikelname = document.getElementById(artikel).innerText;
                        if(window.confirm("Möchten Sie wirklich " + bestellmenge + " " + artikelname + " bestellen?")){
                            (async function () {
                                const response = await api.createBrotBestellung(result);
                                if(response.ok) {
                                    forceUpdate();
                                }
                                else{
                                    alert("Das Abgeben einer Brotbestellung war aufgrund eines Fehlers nicht erfolgreich. Bitte versuchen Sie es erneut.");
                                }
                            })();
                        }
                        else{
                            alert("Okay, dieses Produkt wird nicht bestellt. Alle anderen schon.");
                        }
                    }
                }
                
            }
        }
        forceUpdate();
        document.getElementById("preis").innerHTML = "Preis: " + preis + "€";
        alert("Ihre Bestellung wurde übermittelt. Vielen Dank!");
    };

    const content = () => {
        if (isLoading || isAlsoLoading || isAlsoLoading2) {
            return (
                <div className="spinner-border" role="status" style={{margin: "5rem"}}>
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }

        for(let i = 0; i < data.length; i++){
            for(let j = 0; j < brotBestellungSumme.length; j++){
                if(data[j].id === brotBestellungSumme[j].brotbestand.id){
                    deepAssign("bestellsumme", data[j], brotBestellungSumme[j].bestellmenge);
                }
                else{
                    deepAssign("bestellsumme", data[j], 0);
                } 
            }
            for(let j = 0; j < brotBestellungBetweenDatesProPerson.length; j++){
                if(data[j].id === brotBestellungBetweenDatesProPerson[j].brotbestand.id){
                    deepAssign("bestellmengeAlt", data[j], brotBestellungBetweenDatesProPerson[j].bestellmenge);
                }    
            }
            for(let j = 0; j < brotBestellung.length; j++){
                if(checkAlreadyOrdered(data[j].id)){
                    deepAssign("bestellmengeNeu", data[j], brotBestellung[j].bestellmenge);
                }   
            }
            
        }

        return (
            <BrotTable
                columns={columns}
                data={data}/>
        );
    }

    const getDeadline = () => {
        let n = 7;
        //n = 7 => nächste Deadline, n = 0 => letzte Deadline, n = -7 => vorletzte Deadline, ...
        if (isLoadingDeadline) {
            return (
                <div className="spinner-border" role="status" style={{margin: "5rem"}}>
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }
        else{
            let datum = new Date();
            let heute = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
            switch(lastdeadline[0].weekday) {
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
            
            if(lastdeadline[0].time < timeNow && lastdeadline[0].weekday == wochentag){
                n = n + 7;
            }
            var deadline = new Date(heute.setDate(heute.getDate()-heute.getDay() + n));
            
            let date = deadline;
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            
            const timeString = lastdeadline[0].time;
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
    }


    return(
        <div>
            <div style={{overflowX: "auto", width: "100%"}}>
                {getDeadline()}
                {content()}
                <h4 id = "preis"></h4>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => submitBestellung()}>Submit Bestellung</Button>
            </div>
        </div>
    );
}
