import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import { useKeycloak } from "@react-keycloak/web";
import BTable from "react-bootstrap/Table";

export function FrischEinkauf(props) {
    const [frischBestellung, setFrischBestellung] = useState([]);
    const api = useApi();
    const { keycloak } = useKeycloak();
    const [totalFrischPrice, setTotalFrischPrice] = useState(0);

    const handleChange = (e, orderPrice, orderIndex) => {
        const quantity = e.target.value;
        const updatedFrischBestellung = frischBestellung.map((order, index) => {
            if (index === orderIndex) {
                return { ...order, genommeneMenge: quantity };
            }
            return order;
        });

        setFrischBestellung(updatedFrischBestellung);

        const newTotalFrischPrice = updatedFrischBestellung.reduce((total, order) => {
            const orderQuantity = order.genommeneMenge || 0;
            return total + orderQuantity * order.frischbestand.preis;
        }, 0);

        setTotalFrischPrice(newTotalFrischPrice);
    };
      

    const getStepValue = (einheit) => {
        const lowerCaseEinheit = einheit.toLowerCase();
        if (lowerCaseEinheit === 'kg') {
            return 0.2;
        } else {
            return 1;
        }
    };

    useEffect(() => {
        const fetchFrischBestellung = async () => {
            try {
                let person_id = keycloak.tokenParsed.preferred_username;
                const response = await api.readFrischBestellungProPerson(person_id);
                const data = await response.json();
                console.log("data: " + JSON.stringify(data));
                setFrischBestellung(data._embedded.frischBestellungRepresentationList);
            } catch (error) {
                console.error('Error fetching frischBestellung:', error);
            }
        };

        fetchFrischBestellung();
    }, []);

    useEffect(() => {
        if (props.onPriceChange) {
          props.onPriceChange(totalFrischPrice);
        }
      }, [totalFrischPrice]);

    return (
        <div>
            <BTable striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Preis in €</th>
                        <th>Gebindegröße</th>
                        <th>Bestellmenge</th>
                        <th>genommene Menge</th>
                        <th>Einheit</th>
                    </tr>
                </thead>
                <tbody>
                    {frischBestellung.map((order, index) => (
                        <tr key={order.id}>
                            <td>{order.frischbestand.name}</td>
                            <td>{order.frischbestand.preis}</td>
                            <td>{order.frischbestand.gebindegroesse}</td>
                            <td>{order.bestellmenge}</td>
                            <td>
                                <input 
                                    type="number" 
                                    min="0" 
                                    step={getStepValue(order.frischbestand.einheit.name)} 
                                    onChange={e => handleChange(e, order.frischbestand.preis, index)} 
                                />
                            </td>
                            <td>{order.frischbestand.einheit.name}</td>
                        </tr>
                    ))}
                </tbody>
            </BTable>
        </div>
    );
}
