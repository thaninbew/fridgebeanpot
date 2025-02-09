import { IoMdArrowDropright } from "react-icons/io";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const { error } = await signIn({ email, password });
      if (error) throw error;
      navigate("/fridge");
    } catch (err) {
      setError("Failed to sign in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen items-center">
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ top: "15vh", width: "60vw" }}
      >
        <div className="flex flex-col items-start animate-contentSlideUp">
          <h1 className="text-black text-[15vw] font-semibold mb-5">fridge.</h1>
          <div className="mt-[33vh] animate-fadeOutUp">
            <div className="text-black font-normal text-[30px]">Hungry?</div>
            <div className="text-black text-[18px] font-light">
              Find local restaurants near you.
            </div>
          </div>
        </div>
      </div>

      <div className="w-screen h-[82vh] flex items-center justify-center animate-contentSlideUp">
        <img src="/bean-fridge.svg" alt="Logo" className="w-[50vw] h-[50vh]" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-screen h-[44vh] bg-[#ffc964] rounded-tl-[30px] rounded-tr-[30px] animate-slideUp">
        <div className="w-[80vw] mx-auto">
          <div className="mt-10 mb-7 text-left text-4xl font-bold ml-3">
            Log In
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-center font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-center mb-5 w-full h-[50px] bg-[#f8f5ec] rounded-[56px] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.96)]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center mb-5 w-full h-[50px] bg-[#f8f5ec] rounded-[56px] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.96)]"
              required
            />

            <div className="w-[80vw] flex justify-between items-center mt-1">
              <div className="flex flex-col justify-left h-[55px] float-start ml-2">
                <Link
                  to="/"
                  className="text-[#c55810] font-medium text-[16px] hover:underline"
                >
                  Forgot Password
                </Link>
                <Link
                  to="/signup"
                  className="text-[#c55810] font-medium text-[16px] hover:underline"
                >
                  Sign Up
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-[25vw] h-[55px] bg-[#ffdc90] rounded-[50px] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]
                   active:shadow-[inset_0px_1px_0px_rgba(0,0,0,1)] border border-black
                   transition-shadow duration-150 transform active:translate-y-1 flex items-center justify-center
                   disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-black font-bold text-[28px] flex items-center ml-2">
                  GO <IoMdArrowDropright />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}