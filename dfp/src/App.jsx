import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import TaskSubmissionForm from "./components/TaskSubmissionForm.jsx";

function App() {
  return (
      <TaskSubmissionForm />
  );
}

export default App;
