import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router";
import AuthVerify from "@/helper/jwtVerify";

export default function LoginUser() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (AuthVerify()) {
      navigate("/student-spreadsheet");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    const formData = {
      username,
      password,
    };

    try {
      const res = await fetch(`/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/student-spreadsheet");
      console.log("Login Successful:", data);
    } catch (error) {
      console.error("Login Error:", error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full p-5 h-screen flex flex-col items-center gap-10">
      <div className="logo">
        <img
          src="/kartavya_logo.png"
          alt="kartavya logo"
          className="h-[200px] object-cover"
        ></img>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[450px] border shadow-lg rounded-lg p-5"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="username" className="block font-medium mb-2">
            Username
          </label>
          <Input
            required
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              required
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            >
              {passwordVisible ? <EyeIcon /> : <EyeOffIcon />}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          disabled={pending}
          type="submit"
          className={`w-full p-2 mt-4 font-semibold rounded-md focus:outline-none focus:ring-2 ${
            pending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {pending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
