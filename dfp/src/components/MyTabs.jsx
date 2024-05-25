import React, { useState, useEffect } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import DataViewWrapper from './DataViewWrapper';
import TaskSubmissionForm from "./TaskSubmissionForm.jsx";
import './MyTabs.css';  // Import the CSS file

const MyTabs = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [refresh, setRefresh] = useState(false);

    const tabs = [
        { label: 'Task Board', listType: "board", icon: 'pi pi-fw pi-home', apiEndpoint: 'http://0.0.0.0:8000/api/board/list/' },
        { label: 'My tasks', listType: "clientBoard", icon: 'pi pi-fw pi-user', apiEndpoint: 'http://0.0.0.0:8000/api/board/client/0x1311Cf43001af2a65D3B8222d0C3C14FdaA'},
        { label: 'My jobs', listType: "executorBoard", icon: 'pi pi-fw pi-briefcase', apiEndpoint: 'http://0.0.0.0:8000/api/board/executor/0x1311Cf43001af2a65D3B8222d0C3C14Fd0000' },
    ];

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    useEffect(() => {
        // This effect is triggered whenever refresh state changes
    }, [refresh]);

    return (
        <div>
            <TabMenu
                model={tabs}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
            />
            <div className="tab-content">
                {(tabs[activeIndex].listType == "clientBoard" || tabs[activeIndex].listType == "board") &&
                    <div className="task-submission-form">
                        <TaskSubmissionForm onTaskSubmit={handleRefresh} />
                    </div>
                }
                <DataViewWrapper apiEndpoint={tabs[activeIndex].apiEndpoint} refresh={refresh} listType={tabs[activeIndex].listType}/>
            </div>
        </div>
    );
};

export default MyTabs;
