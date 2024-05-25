import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import MyTabs from "./components/MyTabs.jsx";
import {PrimeReactProvider} from "primereact/api"; // Ensure correct path to MyTabs.jsx

function App() {
  return (
    <PrimeReactProvider>
        <div>
            <MyTabs />
        </div>
    </PrimeReactProvider>
  );
}

export default App;
