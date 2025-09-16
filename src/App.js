import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Input from "./Input";
import Code from "./Code";
import Output from "./Output";
import "./App.css";   

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/input" element={<Input />} />
      <Route path="/code" element={<Code />} />
      <Route path="/output" element={<Output />} />
    </Routes>
  );
}

export default App;
