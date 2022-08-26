import axios from 'axios';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useLogin } from '../react-query-hooks/auth-hooks';
import styles from '../styles/modules/Button.module.scss';
import inputStyles from '../styles/modules/Input.module.scss';

const Login: FC = () => {
  const [email, setEmail] = useState('sam@gmail.com');
  const [password, setPassword] = useState('');
  const { mutate } = useLogin();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <main className="auth">
      <div className="container">
        <form className="form-container" onSubmit={handleSubmit}>
          <div className={inputStyles.inputGroup}>
            <div className="top-message">
              <label>Email</label>
            </div>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className={inputStyles.inputGroup}>
            <div className="top-message">
              <label>Email</label>
            </div>
            <div className="input-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button className={styles.button} onClick={handleSubmit}>
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
