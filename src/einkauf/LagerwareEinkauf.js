import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import BTable from "react-bootstrap/Table";
import { useSortBy } from "react-table";
import NumberFormatComponent from '../logic/NumberFormatComponent';

export function LagerwareEinkauf(props) {
    const [produkt, setProdukt] = useState([]);
    const api = useApi();
    const [totalProduktPrice, setTotalProduktPrice] = useState(0);
    const NotAvailableColor = '#D3D3D3';

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
          props.onPriceChange(totalProduktPrice);
        }     
      }, [totalProduktPrice]);

    useEffect(() => {
        if (props.handleProdukt) {
            props.handleProdukt(produkt);
        }        
    }, [produkt]);

    return (
        <div>
            <BTable striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Preis in €</th>
                        <th>genommene Menge</th>
                        <th>Einheit</th>
                    </tr>
                </thead>
                <tbody>
                    {produkt.map((order, index) => (
                        <tr key={order.id}>
                            <td style={{ color: order.lagerbestand.istLagerbestand === 0 ? NotAvailableColor : 'inherit' }}>{order.name}</td>
                            <td style={{ color: order.lagerbestand.istLagerbestand === 0 ? NotAvailableColor : 'inherit' }}><NumberFormatComponent value={order.preis} /></td>
                            <td>
                                <input 
                                    type="number" 
                                    min="0" 
                                    step={1} 
                                    onChange={e => handleChange(e, order.preis, index)}
                                    disabled={order.lagerbestand.istLagerbestand === 0}
                                    style={{ color: order.lagerbestand.istLagerbestand === 0 ? NotAvailableColor : 'inherit' }}
                                />
                            </td>
                            <td style={{ color: order.lagerbestand.istLagerbestand === 0 ? NotAvailableColor : 'inherit' }}>{order.lagerbestand.einheit.name}</td>
                        </tr>
                    ))}
                </tbody>
            </BTable>
        </div>
    );
}
