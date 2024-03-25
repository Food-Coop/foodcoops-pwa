import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import BTable from "react-bootstrap/Table";

export function LagerwareEinkauf(props) {
    const [produkt, setProdukt] = useState([]);
    const api = useApi();
    const [totalProduktPrice, setTotalProduktPrice] = useState(0);

    const handleChange = (e, orderPrice, orderIndex) => {
        const quantity = e.target.value;
        const updatedProdukt = produkt.map((order, index) => {
            if (index === orderIndex) {
                return { ...order, genommeneMenge: quantity };
            }
            return order;
        });

        setProdukt(updatedProdukt);

        const newTotalProduktPrice = updatedProdukt.reduce((total, order) => {
            const orderQuantity = order.genommeneMenge || 0;
            return total + orderQuantity * order.preis;
        }, 0);

        setTotalProduktPrice(newTotalProduktPrice);
    };

    // Format the total price to two decimal places and replace comma with period
    const formattedTotalProduktPrice = totalProduktPrice.toFixed(2).replace('.', ',');

    //mit last deadline
    useEffect(() => {
        const fetchProdukt = async () => {
            try {
                const response = await api.readProdukt();
                const data = await response.json();
                setProdukt(data._embedded.produktRepresentationList);
            } catch (error) {
                console.error('Error fetching produkt:', error);
            }
        };

        fetchProdukt();
    }, []);

    useEffect(() => {
        if (props.onPriceChange) {
          props.onPriceChange(formattedTotalProduktPrice);
        }
      }, [formattedTotalProduktPrice]);

    //TODO: reset data
    return (
        <div>
            <BTable striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Preis in €</th>
                        <th>genommene Menge</th>
                    </tr>
                </thead>
                <tbody>
                    {produkt.map((order, index) => (
                        <tr key={order.id}>
                            <td>{order.name}</td>
                            <td>{order.preis}</td>
                            <td>
                                <input 
                                    type="number" 
                                    min="0" 
                                    step={1} 
                                    onChange={e => handleChange(e, order.preis, index)} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </BTable>
            <h5 id="preis">Lagerwaren-Preis: {formattedTotalProduktPrice} €</h5>
        </div>
    );
}
