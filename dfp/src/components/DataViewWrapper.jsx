import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { Panel } from 'primereact/panel';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './DataViewWrapper.css';
import { useAccount, useBalance } from "wagmi";


const DataViewWrapper = ({ apiEndpoint, refresh, listType, onTaskAccept}) => {
    const [items, setItems] = useState([]);
    const [layout, setLayout] = useState('list');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visible, setVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const { address, isConnected } = useAccount();

    const showConfirm = (item) => {
        setCurrentItem(item);
        setVisible(true);
    };

    const onHide = () => {
        setVisible(false);
        setCurrentItem(null);
    };

    const accept = () => {
        console.log('Accepted', currentItem);
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        executor_address: address,
                        task_id: currentItem.id
                    }
                )
            };
            fetch('http://0.0.0.0:8000/api/task/take/', requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("Task taken");
                    onHide();
                    if (onTaskAccept) {
                        onTaskAccept(); // Notify the parent component
                    }
                });

    };

    const reject = () => {
        // Add your reject logic here
        console.log('Rejected', currentItem);
        onHide();
    };

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

    useEffect(() => {
        fetchData();
    }, [apiEndpoint, refresh]);

const itemTemplate = (item) => {
    return (
        <div className="p-col-12 item-container" key={item.id}>
            <Panel header={
                <div className="header-content">
                    <span className="nickname">{item.task_title}</span>
                </div>
            } className="item-panel">
                <div className="p-grid">
                    <div className="culo-text"><strong>Description:</strong></div>
                    <div className="p-col-12 p-md-12">
                        <ScrollPanel
                            style={{ width: '100%', height: '100px', border: '1px solid #ccc', padding: '10px' }}
                            className="scroll-panel">
                            <div className="left-align">
                                {item.task_description}
                            </div>
                        </ScrollPanel>
                    </div>
                    <div className="p-col-12 p-md-12 item-footer">
                        <div className="p-col-6 p-md-6">
                            <strong>Requested price:</strong> {item.price} ◈
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
                    <div className="p-col-12 p-md-12 item-footer">
                        <div className="p-col-12 p-md-12" style={{ textAlign: 'left', marginTop: '10px' }}>
                            <strong>Minimum required reputation Score:</strong> 8.8
                        </div>
                        {listType === 'board' && (
                            <div style={{ padding: '10px' }}>
                                <Button label="Take the job" icon="pi pi-plus" id={"confirm" + item.id} onClick={() => showConfirm(item)} />
                            </div>
                        )}
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
        <div style={{ width: '100%', margin: '0 auto' }}>
            <DataView value={items} layout={layout} itemTemplate={itemTemplate} />
            <ConfirmDialog
                visible={visible}
                onHide={onHide}
                message="Are you sure you want to proceed?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={accept}
                reject={reject}
            />
        </div>
    );
};

export default DataViewWrapper;
