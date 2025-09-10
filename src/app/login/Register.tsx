"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";

interface RegisterProps {
  onBack: () => void;
  onLoginClick: () => void;
}

export default function Register({ onBack, onLoginClick }: RegisterProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await signUp.email({
        name: firstName + " " + lastName,
        email,
        password,
        callbackURL: "/dashboard",
      });
      
      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else if (data) {
        toast.success("Account created successfully!");
      }
      
      console.log("my data", data);
      console.log("error", error);
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-sm w-96 space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 flex items-center cursor-pointer"
          >
            ← Back
          </button>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Register with email</h1>
          <p className="text-gray-600 text-sm">Register using your email address.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 bg-gray-100 border-0 rounded mt-1"
                placeholder="First Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 bg-gray-100 border-0 rounded mt-1"
                placeholder="Last Name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 bg-gray-100 border-0 rounded mt-1"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 bg-gray-100 border-0 rounded pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-10 bg-blue-700 hover:bg-blue-800 text-white font-medium mt-6 rounded-full cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading && <Spinner className="w-4 h-4" />}
              <span>{isLoading ? "Creating account..." : "Create my account"}</span>
            </div>
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button 
            onClick={onLoginClick}
            className="text-gray-900 hover:text-gray-700 hover:underline font-semibold cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
