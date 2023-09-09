import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.svg';

export function Header({
  paths,
  headerInfo,
  onSignOut,
  onBurgerClick,
  isOpenMenu,
}) {
  const { login, registration } = paths;

  const { pathname } = useLocation();

  const handleClickSignOut = () => {
    onSignOut();
  };
  return (
    <>
      {headerInfo && (
        <div className={`header__menu ${isOpenMenu && 'header__menu_open'}`}>
          <p className="header__email header__email_type_burger-menu">
            {headerInfo?.email}
          </p>
          <Link
            to={login}
            className="header__link"
            onClick={headerInfo ? handleClickSignOut : ''}
          >
            Выйти
          </Link>
        </div>
      )}
      <header className="header">
        <div className="header__container">
          <img className="logo" src={logo} alt="Логотип Место" />
          <div className="header__userinfo">
            {headerInfo?.email && (
              <p className="header__email header__email_type_classic-menu">
                {headerInfo?.email}
              </p>
            )}
            {pathname === login ? (
              <Link
                to={registration}
                className="header__link header__link_type_classic-menu"
              >
                Регистрация
              </Link>
            ) : (
              ''
            )}
            {pathname === registration ? (
              <Link
                to={login}
                className="header__link header__link_type_classic-menu"
              >
                Войти
              </Link>
            ) : (
              ''
            )}
            {headerInfo ? (
              <Link
                role="button"
                to={login}
                onClick={headerInfo ? handleClickSignOut : ''}
                className="header__link header__link_active"
              >
                Выйти
              </Link>
            ) : (
              ''
            )}
            {headerInfo && (
              <button
                className={`header__burger-btn ${
                  isOpenMenu && `header__burger-btn_active`
                }`}
                onClick={onBurgerClick}
              />
            )}
          </div>
        </div>
      </header>
    </>
  );
}
