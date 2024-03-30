import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import { useKeycloak } from "@react-keycloak/web";
import BTable from "react-bootstrap/Table";

export function BrotEinkauf(props) {
    const [brotBestellung, setBrotBestellung] = useState([]);
    const api = useApi();
    const { keycloak } = useKeycloak();
    const [totalBrotPrice, setTotalBrotPrice] = useState(0);

    const handleChange = (e, orderPrice, orderIndex) => {
        const quantity = e.target.value;
        const updatedBrotBestellung = brotBestellung.map((order, index) => {
            if (index === orderIndex) {
                return { ...order, genommeneMenge: quantity };
            }
            return order;
        });

        setBrotBestellung(updatedBrotBestellung);

        const newTotalBrotPrice = updatedBrotBestellung.reduce((total, order) => {
            const orderQuantity = order.genommeneMenge || 0;
            return total + orderQuantity * order.brotbestand.preis;
        }, 0);

        setTotalBrotPrice(newTotalBrotPrice);
    };

    useEffect(() => {
        const fetchBrotBestellung = async () => {
            try {
                let person_id = keycloak.tokenParsed.preferred_username;
                const response = await api.readBrotBestellungProPerson(person_id);
                const data = await response.json();
                if (data && data._embedded && data._embedded.brotBestellungRepresentationList) {
                    setBrotBestellung(data._embedded.brotBestellungRepresentationList);
                } else {
                    setBrotBestellung([]);
                }
            } catch (error) {
                console.error('Error fetching brotBestellung:', error);
            }
        };
        

        fetchBrotBestellung();
    }, []);

    useEffect(() => {
        if (props.onPriceChange) {
          props.onPriceChange(totalBrotPrice);
        }
      }, [totalBrotPrice]);

    return (
        <div>
            <BTable striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Preis in €</th>
                        <th>Bestellmenge</th>
                        <th>genommene Menge</th>
                    </tr>
                </thead>
                <tbody>
                    {brotBestellung.map((order, index) => (
                        <tr key={order.id}>
                            <td>{order.brotbestand.name}</td>
                            <td>{order.brotbestand.preis}</td>
                            <td>{order.bestellmenge}</td>
                            <td>
                                <input 
                                    type="number" 
                                    min="0" 
                                    step={1} 
                                    onChange={e => handleChange(e, order.brotbestand.preis, index)} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </BTable>
        </div>
    );
}
