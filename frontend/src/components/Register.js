import { Link } from 'react-router-dom';
import { useForm } from '../hooks/useForm';

export const Register = ({ onRegistration }) => {
  
  const { values, handleChange } = useForm({ email: '', password: '' });

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onRegistration(values.email, values.password);
  };
  return (
    <section className="register">
      <div className="register__container">
        <p className="register__title">Регистрация</p>
        <form
          className="register__form"
          name="sign-up-form"
          onSubmit={handleSubmit}
        >
          <input
            name="email"
            className="register__input"
            type="email"
            required
            placeholder="Email"
            minLength="2"
            maxLength="30"
            autoComplete="username"
            value={values.email}
            onChange={handleChange}
          />
          <input
            name="password"
            className="register__input"
            type="password"
            required
            placeholder="Пароль"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
          />
          <button className="register__submit-btn" type="submit">
            Зарегистрироваться
          </button>
        </form>
        <p className="register__subtitle">
          Уже зарегистрированы?{' '}
          <Link to="/sign-in" className="register__link">
            Войти
          </Link>
        </p>
      </div>
    </section>
  );
};
