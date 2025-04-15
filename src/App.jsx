import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import DonorDetail from './components/DonorDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donor/:donorName" element={<DonorDetail />} />
      </Routes>
    </Router>
  );
}

export default App;