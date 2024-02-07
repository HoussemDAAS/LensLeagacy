import React from "react";
import { Routes, Route } from "react-router-dom";
import "./globals.css";
import SigninForm from "./_auth/SigninForm";
import { Home } from "./_root/pages";
import SignupForm from "./_auth/SignupForm";
import Authlayout from "./_auth/Authlayout";
import RouteLayout from "./_root/pages/RouteLayout";

import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<Authlayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
        {/*  private routes*/}
        <Route element={<RouteLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
