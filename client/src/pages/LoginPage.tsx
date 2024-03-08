import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}
