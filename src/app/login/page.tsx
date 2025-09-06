"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import Login from "./Login";
import Register from "./Register";
import { signIn, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<'main' | 'login' | 'register'>('main');
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  // Show loading while checking session
  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-900">Loading...</div>
      </div>
    )
  }

  // Don't render if user is authenticated (will redirect)
  if (session?.user) {
    return null
  }

  const handleGoogleLogin = async () => {
    signIn.social({ provider: "google" });
  };

  const handleEmailLogin = () => {
    setCurrentView('login');
  };

  const handleRegister = () => {
    setCurrentView('register');
  };

  const handleBack = () => {
    setCurrentView('main');
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  if (currentView === 'login') {
    return <Login onBack={handleBack} onRegisterClick={handleRegister} />;
  }

  if (currentView === 'register') {
    return <Register onBack={handleBack} onLoginClick={handleLoginClick} />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-sm w-96 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Continue with an account</h1>
          <p className="text-gray-600 text-sm">You must log in or register to continue.</p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleGoogleLogin}
            variant="outline" 
            className="w-full h-10 border-0 border-t-2 border-gray-300 bg-white hover:bg-gray-50 rounded-full cursor-pointer"
          >
            <div className="flex items-center justify-center gap-3">
              <FcGoogle size={20} />
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </div>
          </Button>
          
          <Button 
            onClick={handleEmailLogin}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer rounded-full"
          >
            <div className="flex items-center justify-center gap-5">
              <MdEmail size={20} color="white"/>
              <span className="text-white font-medium">Login with Email</span>
            </div>
          </Button>
        </div>
        
        <div className="pt-4">
          <button 
            onClick={handleRegister}
            className="text-gray-600 underline text-sm hover:text-gray-700 font-semibold cursor-pointer"
          >
            New User? Create New Account
          </button>
        </div>
        
        <div className="text-xs text-gray-600 pt-2">
          By continuing, you agree to our{" "}
          <button className="underline hover:text-gray-700">Privacy Policy</button>
          {" "}and{" "}
          <button className="underline hover:text-gray-700">T&Cs</button>
        </div>
      </div>
    </div>
  );
}
