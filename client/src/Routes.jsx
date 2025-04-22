import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Taxes from './pages/Taxes';
import Cities from './pages/Cities';
import Weather from './pages/Weather';
import City from './pages/City'
import Login from './pages/Login'
import Signup from './pages/Signup';
import User from './pages/User'
import Compare from './pages/Compare';
import Questions from './pages/Questions';
import Results from './pages/Results';
const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<Cities />}/>
                <Route path="/city/:id" element={<City />}/>
                <Route path="/tax" element={<Taxes />}/>
                <Route path="/weather" element={<Weather />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/user/:id" element={<User/>}/>
                <Route path="/city/:idA/:idB" element={<Compare/>}/>
                <Route path="/quiz" element={<Questions/>}/>
                <Route path="/results" element={<Results></Results>}/>
            </Routes>
        </Router>
    )
}

export default Routing