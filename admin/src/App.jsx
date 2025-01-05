import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './screens/Home'
import Navbar from './components/Navbar'
import AddSpeaker from './screens/AddSpeaker'
import SpeakerList from './components/speakers/SpeakerList'
import TopicsAbstract from './screens/TopicsAbstract'
import AbstractList from './screens/AbstractList'
import ManageDates from './screens/ManageDates'
import Agenda from './screens/Agenda'
import Venue from './screens/Venue'
import ContactList from './screens/ContactList'
import Login from './screens/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Plans from './screens/Plans'
import Accommodations from './screens/Accommodations'
import Guidelines from './screens/Guidelines'
import RegistrationList from './screens/RegistrationList'
import Policy from './screens/policy'

function App() {

  const location = useLocation();

  return (
    <div className='appMain'>

      {location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path='/' element={<Home />} />
        <Route path='/add-speaker' element={<ProtectedRoute><AddSpeaker /></ProtectedRoute>} />
        <Route path='/speaker-list' element={<ProtectedRoute><SpeakerList /> </ProtectedRoute>} />
        <Route path='/abstractTopics' element={<ProtectedRoute><TopicsAbstract /> </ProtectedRoute>} />
        <Route path='/abstractList' element={<ProtectedRoute><AbstractList /> </ProtectedRoute>} />
        <Route path='/guidelines' element={<ProtectedRoute><Guidelines /> </ProtectedRoute>} />
        <Route path='/manageDates' element={<ProtectedRoute><ManageDates /> </ProtectedRoute>} />
        <Route path='/agenda' element={<ProtectedRoute><Agenda /> </ProtectedRoute>} />
        <Route path='/venue' element={<ProtectedRoute><Venue /> </ProtectedRoute>} />
        <Route path='/contactList' element={<ProtectedRoute><ContactList /> </ProtectedRoute>} />
        <Route path='/plans' element={<ProtectedRoute><Plans /> </ProtectedRoute>} />
        <Route path='/accommodations' element={<ProtectedRoute><Accommodations /> </ProtectedRoute>} />
        <Route path='/policy' element={<ProtectedRoute><Policy /> </ProtectedRoute>} />
        <Route path='/registrationList' element={<ProtectedRoute><RegistrationList /> </ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
