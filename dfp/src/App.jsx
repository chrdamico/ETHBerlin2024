import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import MyTabs from "./components/MyTabs.jsx";
import {PrimeReactProvider} from "primereact/api";
import {Web3ModalProvider} from "./components/Web3ModalProvider.jsx"; // Ensure correct path to MyTabs.jsx

function App() {
  return (
      <Web3ModalProvider>
    <PrimeReactProvider>
        <div>
            <w3m-button />
            <MyTabs />
        </div>
    </PrimeReactProvider>
      </Web3ModalProvider>
  );
}

export default App;
