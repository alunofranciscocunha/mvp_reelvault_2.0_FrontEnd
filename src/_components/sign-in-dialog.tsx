import { useState } from "react";
import { Button } from "./ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";

const SignInDialog = ({ onLoginSuccess }: { onLoginSuccess?: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      if (onLoginSuccess) onLoginSuccess();
      window.location.reload(); // Força reload para atualizar sidebar e página
    } catch (err: unknown) {
      setError("Usuario ou senha inválidos");
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Erro ao criar conta");
      }
      toast.success("Conta criada com sucesso! Faça login.");
      setIsRegister(false);
      setUsername("");
      setPassword("");
    } catch (err: unknown) {
      setError("Erro ao criar conta");
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isRegister ? "Criar conta" : "Faça login na plataforma"}</DialogTitle>
        <DialogDescription>
          {isRegister ? "Preencha os campos para criar sua conta." : "Conecte-se usando seu usuário e senha."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-2 mt-4">
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-2 py-1"
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <div className="flex gap-2 mt-2">
          {isRegister ? (
            <Button
              variant="secondary"
              className="font-bold flex-1"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar conta"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="font-bold flex-1"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Login"}
            </Button>
          )}
          <Button
            variant="destructive"
            className="gap-1 font-bold flex-1"
            onClick={() => {
              setIsRegister(false);
              setUsername("");
              setPassword("");
              setError(null);
            }}
          >
            Cancelar
          </Button>
        </div>
        <div className="mt-2 text-center">
          {isRegister ? (
            <span className="text-sm">Já tem conta?{' '}
              <a className="text-blue-500 cursor-pointer underline" onClick={() => setIsRegister(false)}>Fazer login</a>
            </span>
          ) : (
            <span className="text-sm">Não tem conta?{' '}
              <a className="text-blue-500 cursor-pointer underline" onClick={() => setIsRegister(true)}>Criar conta</a>
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default SignInDialog;