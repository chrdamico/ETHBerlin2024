import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Panel } from 'primereact/panel';
import { ScrollPanel } from 'primereact/scrollpanel';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './DataViewExample.css';

const DataViewExample = () => {
    const [items, setItems] = useState([]);
    const [layout, setLayout] = useState('list');

    useEffect(() => {
        const fetchData = () => {
            const data = [
                {
                    nickname: 'Item 1',
                    description: 'Description for Item 1',
                    price: 100,
                    deadline: new Date(),
                    bonus_payment_date: new Date(),
                    crypto_address: '0x123456789abcdef',
                    reputation_score: 4.5
                },
                {
                    nickname: 'Item 2',
                    description: 'Description for Item 2',
                    price: 200,
                    deadline: new Date(),
                    bonus_payment_date: new Date(),
                    crypto_address: '0xabcdef123456789',
                    reputation_score: 3.8
                },
                // ... other items
            ];
            setItems(data);
        };
        fetchData();
    }, []);

    const itemTemplate = (item) => {
        return (
            <div className="p-col-12 item-container">
                <Panel header={
                    <div className="header-content">
                        <span className="nickname">{item.nickname}</span></div>

                } className="item-panel">
                    <div className="p-grid">
                        <div className="p-col-12 p-md-12">
                            <strong>Description:</strong>
                            <ScrollPanel
                                style={{width: '100%', height: '100px', border: '1px solid #ccc', padding: '10px'}}>
                                <div className="left-align">
                                    {item.description}
                                </div>
                            </ScrollPanel>
                        </div>

                        <div className="p-col-12 p-md-12 item-footer">
                            <div className="p-col-6 p-md-6">
                                <strong>Price:</strong> ${item.price}
                            </div>
                            <div className="p-col-6 p-md-6">
                                <strong>Crypto Address:</strong> {item.crypto_address}
                            </div>
                        </div>
                        <div className="p-col-12 p-md-12 item-footer">
                            <div className="p-col-6 p-md-6">
                                <strong>Deadline:</strong> {item.deadline.toLocaleString()}
                            </div>
                            <div className="p-col-6 p-md-6">
                                <strong>Bonus Payment Date:</strong> {item.bonus_payment_date.toLocaleString()}
                            </div>
                        </div>

                        <div className="p-col-12 p-md-12" style={{textAlign: 'left', marginTop: '10px'}}>
                            <strong>Reputation Score:</strong> {item.reputation_score}
                        </div>
                    </div>
                </Panel>
            </div>
        );
    };

    return (
        <div style={{width: '130%', margin: '0 auto'}}>
            <DataView value={items} layout={layout} itemTemplate={itemTemplate}/>
        </div>
    );
};

export default DataViewExample;
