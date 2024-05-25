import React, { useState, useEffect } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import DataViewWrapper from './DataViewWrapper';
import TaskSubmissionForm from "./TaskSubmissionForm.jsx";
import './MyTabs.css';
import {useAccount} from "wagmi";



const MyTabs = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const { address, isConnected } = useAccount();

    const tabs = [
        { label: 'Task Board', listType: "board", icon: 'pi pi-fw pi-home', apiEndpoint: 'http://0.0.0.0:8000/api/board/list/' },
        { label: 'My tasks', listType: "clientBoard", icon: 'pi pi-fw pi-user', apiEndpoint: 'http://0.0.0.0:8000/api/board/client/'+address},
        { label: 'My jobs', listType: "executorBoard", icon: 'pi pi-fw pi-briefcase', apiEndpoint: 'http://0.0.0.0:8000/api/board/executor/'+address },
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
