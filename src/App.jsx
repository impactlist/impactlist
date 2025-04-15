import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import DonorDetail from './components/DonorDetail';
import RecipientDetail from './components/RecipientDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donor/:donorName" element={<DonorDetail />} />
        <Route path="/recipient/:recipientName" element={<RecipientDetail />} />
      </Routes>
    </Router>
  );
}

export default App;