import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../services/firebase"
import { useNavigate } from "react-router-dom"

import logo from "../../assets/logo-sj.png"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/admin/dashboard")
    } catch (err) {
      setError("Email o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#271b1a] px-4">

      {/* CARD */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-[#644951] p-6 rounded-xl shadow-lg space-y-4
                   animate-[fadeIn_0.4s_ease-out]"
      >

        {/* LOGO */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Santa Julia"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* TITULO */}
        <h2 className="text-2xl font-bold text-[#ffecb8] text-center">
          Bienvenido
        </h2>

        <p className="text-sm text-[#fed0d2] text-center">
          Iniciá sesión para continuar
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500 text-white text-sm p-2 rounded text-center">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-[#271b1a] text-white placeholder-[#af8c99]
                     outline-none focus:ring-2 focus:ring-[#ffb1f2]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-[#271b1a] text-white placeholder-[#af8c99]
                     outline-none focus:ring-2 focus:ring-[#ffb1f2]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BOTÓN */}
        <button
          disabled={loading}
          className="w-full p-3 rounded bg-[#ffb1f2] text-[#271b1a] font-bold
                     hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

      </form>

      {/* ANIMACIÓN CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>

    </div>
  )
}