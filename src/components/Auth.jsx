// src/components/Auth.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../Firebase/api_util";
import { EmailIcon, PasswordIcon, OrderlyBrandIcon } from "../assets/icons/icons";
import { handleToast, handleWarning } from "./alerts";
import { useDispatch } from "react-redux";
import { setAdmin } from "../features/slices/adminReducer";
import Button from "./Button";
import FormInput from "./FormInput";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [verificationPending, setVerificationPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setVerificationPending(false);
    setLoading(true);

    try {
      const userCredential = await api.auth.login(email, password, rememberMe);
      const user = userCredential.user;

      if (!user.emailVerified) {
        handleWarning();
        setVerificationPending(true);
        await api.auth.logout();
        return;
      }

      dispatch(setAdmin({ id: user.uid }));
      sessionStorage.setItem("internal-nav", "true");
      navigate("/home");
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        default:
          setError(err.message || "Failed to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await api.auth.loginWithGoogle();
      const user = result.user;
      dispatch(setAdmin({ id: user.uid }));
      sessionStorage.setItem("internal-nav", "true");
      navigate("/home");
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      await api.auth.resetPassword(email);
      setError("");
      handleToast("Password reset link sent to your email!");
    } catch (err) {
      setError(err.message || "Could not send reset email.");
    }
  };

  const handleResendVerification = async () => {
    try {
      await api.auth.resendVerification(email, password);
      handleToast("Verification email resent!");
    } catch (err) {
      setError(err.message || "Could not resend email.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6">
      <div className="card w-full max-w-md bg-white rounded-3xl p-8 border border-base-200 shadow-sm animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-3">
            <OrderlyBrandIcon className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-base-content">
            Welcome Back
          </h1>
          <p className="font-body text-xs text-neutral mt-1">
            Sign in to manage and join group food orders
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-center">
            <p className="text-xs font-medium text-error">{error}</p>
          </div>
        )}

        {verificationPending && (
          <div className="mb-4 text-center">
            <button
              type="button"
              className="text-xs text-primary font-semibold hover:underline"
              onClick={handleResendVerification}
            >
              Resend verification email
            </button>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <FormInput
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<EmailIcon className="w-4 h-4 text-neutral" />}
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<PasswordIcon className="w-4 h-4 text-neutral" />}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-xs rounded-md"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-neutral font-medium">Remember me</span>
            </label>

            <button
              type="button"
              className="text-primary font-semibold hover:underline"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 rounded-xl text-sm font-bold shadow-xs mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="divider text-xs text-neutral/70 font-body my-5 uppercase tracking-wider">
          OR
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-2 border-base-300 hover:bg-base-200"
        >
          <span className="font-bold text-sm text-primary">G</span> Continue with Google
        </button>

        <p className="text-center text-xs text-neutral mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
