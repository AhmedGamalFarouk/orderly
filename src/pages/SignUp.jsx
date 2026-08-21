import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api } from "../Firebase/api_util";
import { setAdmin } from "../features/slices/adminReducer";
import { EmailIcon, PasswordIcon, OrderlyBrandIcon, CheckIcon, SparklesIcon } from "../assets/icons/icons";
import { handleToast } from "../components/alerts";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isPasswordValid = hasLength && hasUpper && hasLower && hasNumber;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please satisfy all password security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.signUp(email, password);
      await api.auth.logout();
      navigate("/signin");
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const credential = await api.auth.loginWithGoogle();
      dispatch(setAdmin({ id: credential.user.uid }));
      sessionStorage.setItem("internal-nav", "true");
      navigate("/home");
    } catch (err) {
      setError(err.message || "Google sign up failed.");
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
            Create Account
          </h1>
          <p className="font-body text-xs text-neutral mt-1">
            Host group spaces, save favourite menus, and split bills
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-center">
            <p className="text-xs font-medium text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <FormInput
            label="Email Address"
            type="email"
            placeholder="mail@site.com"
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

          {/* Live Password Checklist */}
          {password.length > 0 && (
            <div className="p-3 bg-base-200/40 rounded-xl border border-base-200 text-xs space-y-1 animate-fade-in-up">
              <p className="font-semibold text-neutral text-[11px] mb-1">Password Requirements:</p>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span className={`flex items-center gap-1.5 ${hasLength ? "text-success font-semibold" : "text-neutral/70"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasLength ? "bg-success" : "bg-neutral/40"}`} />
                  8+ characters
                </span>
                <span className={`flex items-center gap-1.5 ${hasUpper ? "text-success font-semibold" : "text-neutral/70"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasUpper ? "bg-success" : "bg-neutral/40"}`} />
                  Uppercase letter
                </span>
                <span className={`flex items-center gap-1.5 ${hasLower ? "text-success font-semibold" : "text-neutral/70"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasLower ? "bg-success" : "bg-neutral/40"}`} />
                  Lowercase letter
                </span>
                <span className={`flex items-center gap-1.5 ${hasNumber ? "text-success font-semibold" : "text-neutral/70"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasNumber ? "bg-success" : "bg-neutral/40"}`} />
                  Number (0-9)
                </span>
              </div>
            </div>
          )}

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<PasswordIcon className="w-4 h-4 text-neutral" />}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 rounded-xl text-sm font-bold shadow-xs mt-2"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="divider text-xs text-neutral/70 font-body my-5 uppercase tracking-wider">
          OR
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="btn btn-outline w-full rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-2 border-base-300 hover:bg-base-200"
          >
            <span className="font-bold text-sm text-primary">G</span> Sign up with Google
          </button>

          <button
            type="button"
            onClick={async () => {
              setError("");
              setLoading(true);
              try {
                const cred = await api.auth.login("ahmedjamal5565@gmail.com", "123456Maz", true);
                dispatch(setAdmin({ id: cred.user.uid }));
                sessionStorage.setItem("internal-nav", "true");
                handleToast("Signed in as Demo User!");
                navigate("/home");
              } catch (err) {
                setError(err.message || "Demo login failed.");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="btn btn-secondary btn-outline w-full rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 border-secondary/40 hover:bg-secondary hover:text-secondary-content"
          >
            <SparklesIcon className="w-4 h-4" /> Skip Auth (Demo Sign In)
          </button>
        </div>

        <p className="text-center text-xs text-neutral mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

