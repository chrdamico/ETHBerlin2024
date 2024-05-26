import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import "./TaskSubmissionForm.css"; // Import the custom CSS file
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useAccount } from "wagmi"; // this is important for the icons
import { readAllowance } from "../hooks/readFnc";

const TaskSubmissionForm = ({ onTaskSubmit }) => {
  const [taskName, setTaskName] = useState("");
  const [deadlineDate, setDeadlineDate] = useState(null);
  const [bonusDate, setBonusDate] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [prize, setPrize] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const { address, isConnected } = useAccount();

  const handleSubmit = () => {
    setSubmitted(true);

    if (
      taskName &&
      deadlineDate &&
      bonusDate &&
      taskDescription &&
      prize !== null
    ) {
      const {
        data: allowance,
        error: allowanceError,
        isLoading: isAllowanceLoading,
      } = readAllowance(address);
      
      console.log("here:")
      console.log(allowanceError);
      console.log(allowance);

      const taskData = {
        taskName,
        deadlineDate,
        bonusDate,
        taskDescription,
        prize,
      };
      console.log(taskData);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester_address: address,
          task_description: taskDescription,
          task_title: taskName,
          price: prize,
          chain_task_id: 798432,
          deadline: deadlineDate,
          bonus_date: bonusDate,
        }),
      };
      fetch("http://localhost:8000/api/task/create/", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Task created");
          setIsDialogVisible(false); // Close the dialog on successful submission
          if (onTaskSubmit) {
            onTaskSubmit(); // Notify the parent component
          }
        });
    }
  };

  const isFieldValid = (field) => !field && submitted;
  const minDate = new Date(); // Today's date

  const renderDialog = () => (
    <Dialog
      header="Request a new task"
      visible={isDialogVisible}
      style={{ width: "50vw" }}
      onHide={() => setIsDialogVisible(false)}
    >
      <div className="p-fluid">
        <div className="p-field">
          <label
            htmlFor="taskName"
            className={classNames({ "p-error": isFieldValid(taskName) })}
          >
            Task Name
          </label>
          <InputText
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className={classNames({ "p-invalid": isFieldValid(taskName) })}
          />
          {isFieldValid(taskName) && (
            <small className="p-error">Task Name is required.</small>
          )}
        </div>
        <div className="p-field">
          <label
            htmlFor="taskDescription"
            className={classNames({ "p-error": isFieldValid(taskDescription) })}
          >
            Task Description
          </label>
          <InputTextarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows={5}
            className={classNames({
              "p-invalid": isFieldValid(taskDescription),
            })}
          />
          {isFieldValid(taskDescription) && (
            <small className="p-error">Task Description is required.</small>
          )}
        </div>
        <div className="p-field">
          <label
            htmlFor="deadlineDate"
            className={classNames({ "p-error": isFieldValid(deadlineDate) })}
          >
            Deadline Date
          </label>
          <Calendar
            id="deadlineDate"
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.value)}
            showIcon
            minDate={minDate}
            view="date"
            touchUI={false}
            className={classNames({ "p-invalid": isFieldValid(deadlineDate) })}
          />
          {isFieldValid(deadlineDate) && (
            <small className="p-error">Deadline Date is required.</small>
          )}
        </div>
        <div className="p-field">
          <label
            htmlFor="bonusDate"
            className={classNames({ "p-error": isFieldValid(bonusDate) })}
          >
            Bonus Date
          </label>
          <Calendar
            id="bonusDate"
            value={bonusDate}
            onChange={(e) => setBonusDate(e.value)}
            showIcon
            minDate={minDate}
            view="date"
            touchUI={false}
            className={classNames({ "p-invalid": isFieldValid(bonusDate) })}
          />
          {isFieldValid(bonusDate) && (
            <small className="p-error">Bonus Date is required.</small>
          )}
        </div>

        <div className="p-field">
          <label
            htmlFor="prize"
            className={classNames({ "p-error": isFieldValid(prize) })}
          >
            Offered money (◈)
          </label>
          <InputNumber
            id="prize"
            value={prize}
            onValueChange={(e) => setPrize(e.value)}
            mode="decimal"
            className={classNames({ "p-invalid": isFieldValid(prize) })}
          />
          {isFieldValid(prize) && (
            <small className="p-error">Prize is required.</small>
          )}
        </div>
        <Button label="Submit" onClick={handleSubmit} />
      </div>
    </Dialog>
  );

  return (
    <div>
      <Button
        label="Request a new task"
        onClick={() => setIsDialogVisible(true)}
      />
      {renderDialog()}
    </div>
  );
};

export default TaskSubmissionForm;
