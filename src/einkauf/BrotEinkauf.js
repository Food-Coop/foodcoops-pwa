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

    // Format the total price to two decimal places and replace comma with period
    const formattedTotalBrotPrice = totalBrotPrice.toFixed(2).replace('.', ',');

    //mit last deadline
    useEffect(() => {
        const fetchBrotBestellung = async () => {
            try {
                let person_id = keycloak.tokenParsed.preferred_username;
                const response = await api.readBrotBestellungProPerson(person_id);
                const data = await response.json();
                if (data && data._embedded && data._embedded.brotBestellungRepresentationList) {
                    setBrotBestellung(data._embedded.brotBestellungRepresentationList);
                    console.log(brotBestellung);
                } else {
                    setBrotBestellung([]);
                    console.log(brotBestellung);
                }
            } catch (error) {
                console.error('Error fetching brotBestellung:', error);
            }
        };
        

        fetchBrotBestellung();
    }, []);

    useEffect(() => {
        if (props.onPriceChange) {
          props.onPriceChange(formattedTotalBrotPrice);
        }
      }, [formattedTotalBrotPrice]);

    //TODO: reset data
    return (
        <div>
            <BTable striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Bestellmenge</th>
                        <th>Preis in €</th>
                        <th>genommene Menge</th>
                    </tr>
                </thead>
                <tbody>
                    {brotBestellung.map((order, index) => (
                        <tr key={order.id}>
                            <td>{order.brotbestand.name}</td>
                            <td>{order.bestellmenge}</td>
                            <td>{order.brotbestand.preis}</td>
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
            <h5 id="preis">Brot-Preis: {formattedTotalBrotPrice} €</h5>
        </div>
    );
}
