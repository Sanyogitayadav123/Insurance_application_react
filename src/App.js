import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignleUser from './components/signleUser';
import InsuranceForm from './components/insuranceForm';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/resume/:id' element={<SignleUser />} />
          <Route path='/' element={<InsuranceForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
