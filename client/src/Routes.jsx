import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Taxes from './pages/Taxes';
import Cities from './pages/Cities';
import Weather from './pages/Weather';
const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<Cities />}/>
                <Route path="/tax" element={<Taxes />}/>
                <Route path="/weather" element={<Weather />}/>
            </Routes>
        </Router>
    )
}

export default Routing