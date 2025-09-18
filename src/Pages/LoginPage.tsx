import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEmptyOrWhitespace = (str) => {
    return !str || str.trim().length === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation with comprehensive empty checks
    if (isEmptyOrWhitespace(formData.email)) {
      newErrors.email = "Email field cannot be empty";
    } else if (formData.email.trim() !== formData.email) {
      newErrors.email = "Email cannot have leading or trailing spaces";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else if (formData.email.length > 254) {
      newErrors.email = "Email address is too long";
    }

    // Password validation with comprehensive empty checks
    if (isEmptyOrWhitespace(formData.password)) {
      newErrors.password = "Password field cannot be empty";
    } else if (formData.password !== formData.password.trim()) {
      newErrors.password = "Password cannot have leading or trailing spaces";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 128) {
      newErrors.password = "Password is too long (max 128 characters)";
    } else if (!/[A-Za-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one letter";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent input of only spaces at the beginning
    let sanitizedValue = value;
    if (name === "email") {
      // Remove leading spaces for email but allow typing
      sanitizedValue = value.replace(/^\s+/, "");
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Real-time validation for better UX
    if (touched[name]) {
      const newErrors = { ...errors };
      
      if (name === "email") {
        if (isEmptyOrWhitespace(sanitizedValue)) {
          newErrors.email = "Email field cannot be empty";
        } else if (sanitizedValue.trim() !== sanitizedValue) {
          newErrors.email = "Email cannot have leading or trailing spaces";
        } else if (!validateEmail(sanitizedValue.trim())) {
          newErrors.email = "Please enter a valid email address";
        } else if (sanitizedValue.length > 254) {
          newErrors.email = "Email address is too long";
        } else {
          delete newErrors.email;
        }
      }
      
      if (name === "password") {
        if (isEmptyOrWhitespace(value)) {
          newErrors.password = "Password field cannot be empty";
        } else if (value !== value.trim()) {
          newErrors.password = "Password cannot have leading or trailing spaces";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        } else if (value.length > 128) {
          newErrors.password = "Password is too long (max 128 characters)";
        } else if (!/[A-Za-z]/.test(value)) {
          newErrors.password = "Password must contain at least one letter";
        } else if (!/\d/.test(value)) {
          newErrors.password = "Password must contain at least one number";
        } else {
          delete newErrors.password;
        }
      }
      
      setErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    
    // Double-check for empty inputs before validation
    if (isEmptyOrWhitespace(formData.email) || isEmptyOrWhitespace(formData.password)) {
      setErrors(prev => ({
        ...prev,
        ...(isEmptyOrWhitespace(formData.email) && { email: "Email field cannot be empty" }),
        ...(isEmptyOrWhitespace(formData.password) && { password: "Password field cannot be empty" })
      }));
      return;
    }

    if (!validateForm()) {
      // Focus on first error field for better UX
      const firstErrorField = errors.email ? 'email' : 'password';
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Final security check before sending to backend
      const loginData = {
        email: formData.email.trim(),
        password: formData.password,
        timestamp: new Date().toISOString(),
        // Add additional security measures if needed
      };
      
      console.log("Login attempt with validated data:", {
        email: loginData.email,
        passwordLength: loginData.password.length,
        timestamp: loginData.timestamp
      });
      
      alert("Login successful! All security checks passed.");
      
      // Clear form on successful login
      setFormData({ email: "", password: "" });
      setTouched({});
      setErrors({});
      
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Please sign in to your account
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || isEmptyOrWhitespace(formData.email) || isEmptyOrWhitespace(formData.password)}
              className={`w-full py-3 px-4 rounded-lg font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isLoading || isEmptyOrWhitespace(formData.email) || isEmptyOrWhitespace(formData.password)
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div> */}
          </div>
        </div>

        {/* <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Your Company Name. All rights reserved.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;