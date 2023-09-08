import { useForm } from '../hooks/useForm';


export const Login = ({onLogin}) => {

  const { values, handleChange } = useForm({ email: '', password: '' });

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onLogin(values.email, values.password)
  };
  return (
    <section className="login">
      <div className="login__container">
        <p className="login__title">Вход</p>
        <form
          className="login__form"
          name="sign-in-form"
          onSubmit={handleSubmit}
        >
          <input
            name="email"
            className="login__input"
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
            className="login__input"
            type="password"
            required
            placeholder="Пароль"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
          />
          <button className="login__submit-btn" type="submit">
            Войти
          </button>
        </form>
      </div>
    </section>
  );
};
