
import { Routes, Route } from "react-router-dom";
import "./globals.css";
import SigninForm from "./_auth/SigninForm";
import { Home, Explore, Saved, AllUsers, CreatePost, EditPost, PostDetails, Profile, UpdateProfile} from "./_root/pages";
import SignupForm from "./_auth/SignupForm";
import Authlayout from "./_auth/Authlayout";
import RouteLayout from "./_root/pages/RouteLayout";

import { Toaster } from "./components/ui/toaster";
import VerifEmail from "./_auth/VerifEmail";


function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<Authlayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/verifemail" element={<VerifEmail />} />
        </Route>
        {/*  private routes*/}
        <Route element={<RouteLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
