import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import './TaskSubmissionForm.css'; // Import the custom CSS file
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // this is important for the icons


const TaskSubmissionForm = () => {
    const [taskName, setTaskName] = useState('');
    const [deadlineDate, setDeadlineDate] = useState(null);
    const [bonusDate, setBonusDate] = useState(null);
    const [taskDescription, setTaskDescription] = useState('');
    const [prize, setPrize] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        setSubmitted(true);

        if (taskName && deadlineDate && bonusDate && taskDescription && prize !== null) {
            const taskData = {
                taskName,
                deadlineDate,
                bonusDate,
                taskDescription,
                prize
            };
            console.log(taskData);
            // Perform any further actions with taskData
        }
    };

    const isFieldValid = (field) => !field && submitted;
    const minDate = new Date(); // Today's date

    return (
        <Card title="Task Input">
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="taskName" className={classNames({'p-error': isFieldValid(taskName)})}>Task
                        Name</label>
                    <InputText id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)}
                               className={classNames({'p-invalid': isFieldValid(taskName)})}/>
                    {isFieldValid(taskName) && <small className="p-error">Task Name is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="taskDescription" className={classNames({'p-error': isFieldValid(taskDescription)})}>Task
                        Description</label>
                    <InputTextarea id="taskDescription" value={taskDescription}
                                   onChange={(e) => setTaskDescription(e.target.value)} rows={5}
                                   className={classNames({'p-invalid': isFieldValid(taskDescription)})}/>
                    {isFieldValid(taskDescription) && <small className="p-error">Task Description is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="deadlineDate" className={classNames({'p-error': isFieldValid(deadlineDate)})}>Deadline
                        Date</label>
                    <Calendar
                        id="deadlineDate"
                        value={deadlineDate}
                        onChange={(e) => setDeadlineDate(e.value)}
                        showIcon
                        minDate={minDate}
                        view="date"
                        touchUI={false}
                        className={classNames({'p-invalid': isFieldValid(deadlineDate)})}
                    />
                    {isFieldValid(deadlineDate) && <small className="p-error">Deadline Date is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="bonusDate" className={classNames({'p-error': isFieldValid(bonusDate)})}>Bonus
                        Date</label>
                    <Calendar
                        id="bonusDate"
                        value={bonusDate}
                        onChange={(e) => setBonusDate(e.value)}
                        showIcon
                        minDate={minDate}
                        view="date"
                        touchUI={false}
                        className={classNames({'p-invalid': isFieldValid(bonusDate)})}
                    />
                    {isFieldValid(bonusDate) && <small className="p-error">Bonus Date is required.</small>}
                </div>

                <div className="p-field">
                    <label htmlFor="prize" className={classNames({'p-error': isFieldValid(prize)})}>Prize</label>
                    <InputNumber id="prize" value={prize} onValueChange={(e) => setPrize(e.value)} mode="decimal"
                                 className={classNames({'p-invalid': isFieldValid(prize)})}/>
                    {isFieldValid(prize) && <small className="p-error">Prize is required.</small>}
                </div>
                <Button label="Submit" onClick={handleSubmit}/>
            </div>
        </Card>
    );
};

export default TaskSubmissionForm;