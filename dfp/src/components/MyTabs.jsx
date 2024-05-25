import React, {useState} from 'react';
import {TabMenu} from 'primereact/tabmenu';
import DataViewWrapper from './DataViewWrapper';

const MyTabs = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabs = [
        { label: 'Task Board', type: "board", icon: 'pi pi-fw pi-home', apiEndpoint: 'http://0.0.0.0:8000/api/board/list/' },
        { label: 'My tasks', type: "clientBoard", icon: 'pi pi-fw pi-calendar', apiEndpoint: 'http://0.0.0.0:8000/api/board/client/0x1311Cf43001af2a65D3B8222d0C3C14FdaA'},
        { label: 'My jobs', type: "executorBoard", icon: 'pi pi-fw pi-user', apiEndpoint: 'http://0.0.0.0:8000/api/board/executor/0x1311Cf43001af2a65D3B8222d0C3C14daA00000' },
    ];

    return (
        <div>
            <TabMenu
                model={tabs}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
            />
            <div className="tab-content">
                <DataViewWrapper apiEndpoint={tabs[activeIndex].apiEndpoint} />
            </div>
        </div>
    );
};

export default MyTabs;
