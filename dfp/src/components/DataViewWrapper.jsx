import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { Panel } from 'primereact/panel';
import { ScrollPanel } from 'primereact/scrollpanel';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './DataViewWrapper.css';

const DataViewWrapper = ({ apiEndpoint }) => {
    const [items, setItems] = useState([]);
    const [layout, setLayout] = useState('list');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setItems(data["items"] || []);
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [apiEndpoint]);

    const itemTemplate = (item) => {
        return (
            <div className="p-col-12 item-container">
                <Panel header={<div className="header-content"><span className="nickname">{item.requester_address}</span></div>} className="item-panel">
                    <div className="p-grid">
                        <div className="p-col-12 p-md-12">
                            <strong>Description:</strong>
                            <ScrollPanel style={{ width: '100%', height: '100px', border: '1px solid #ccc', padding: '10px' }}>
                                <div className="left-align">
                                    {item.task_description}
                                </div>
                            </ScrollPanel>
                        </div>
                        <div className="p-col-12 p-md-12 item-footer">
                            <div className="p-col-6 p-md-6">
                                <strong>Price:</strong> 100
                            </div>
                            <div className="p-col-6 p-md-6">
                                <strong>Crypto Address:</strong> {item.requester_address}
                            </div>
                        </div>
                        <div className="p-col-12 p-md-12 item-footer">
                            <div className="p-col-6 p-md-6">
                                <strong>Deadline:</strong> {new Date(item.deadline).toLocaleString()}
                            </div>
                            <div className="p-col-6 p-md-6">
                                <strong>Bonus Payment Date:</strong> {new Date(item.bonus_date).toLocaleString()}
                            </div>
                        </div>
                        <div className="p-col-12 p-md-12" style={{ textAlign: 'left', marginTop: '10px' }}>
                            <strong>Reputation Score:</strong> 8.8
                        </div>
                    </div>
                </Panel>
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div style={{ width: '130%', margin: '0 auto' }}>
            <DataView value={items} layout={layout} itemTemplate={itemTemplate} />
        </div>
    );
};

export default DataViewWrapper;
