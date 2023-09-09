import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { ImagePopup } from './ImagePopup';
import { Login } from './Login';
import { api } from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { Notification } from './Notification';
import { PopupWithConfirmation } from './PopupWithConfirmation';
import { Register } from './Register';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { checkToken, login, registration } from '../utils/Auth';
import { InfoTooltip } from './InfoTooltip';

function App() {
 
  // состояние меню бургер
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);

  //данные для шапки
  const [headerInfo, setHeaderInfo] = React.useState(null);

  // состояние залогинен или нет
  const [loggedIn, setLoggedIn] = React.useState(false);

  // Состояние всплывающего уведомления
  const [notification, setNotification] = React.useState(null);

  // Состояние процесса загрузки на сервер
  const [showLoading, setShowLoading] = React.useState('');

  // Состояние пользовательских данных
  const [currentUser, setCurrentUser] = React.useState(null);

  // Состояние попапов
  const [isInfoPopupOpen, setIsInfoPopupOpen] = React.useState({isOpen: false, isSuccess: false});
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [cardToDelete, setCardToDelete] = React.useState(null);

  // Состояние данных карточек
  const [cards, setCards] = React.useState([]);

  // Состояние попапа с картинкой
  const [selectedCard, setSelectedCard] = React.useState(null);

  const navigate = useNavigate();

  // пути приложения
  const paths = {
    login: '/sign-in',
    registration: '/sign-up',
    main: '/',
  };

  // обратка запроса на авторизацию
  const handleLogin = (email, password) => {
    login(email, password)
      .then((data) => {
        if (data.token) {
          //если токен внутри ответа сохраняем в локальном хранилище
          localStorage.setItem('jwt', data.token);
          api.setToken(localStorage.getItem('jwt'))
          setLoggedIn(true);
          navigate(paths.main, { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setIsInfoPopupOpen({isOpen: true, isSuccess: false});
      });
  };

  // обработка запроса на регистрацию
  const handleRegistration = (email, password) => {
    registration(email, password)
      .then(() => {
        navigate(paths.login, { replace: true });
        setIsInfoPopupOpen({isOpen: true, isSuccess: true});
      })
      .catch((err) => {
        console.log(err);
        setIsInfoPopupOpen({isOpen: true, isSuccess: false});
      });
  };

  // обработка выхода из приложения
  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    api.setToken(null)
    setLoggedIn(false);
    setHeaderInfo(null);
    setCurrentUser(null);
    setCards([]);
    setIsOpenMenu(false);
  };

  // если ширина экрана больше указанной закрываем меню бургер
  React.useEffect(() => {
    const handleChangeWidth = (evt) => {
      if (evt.target.outerWidth >= 767.98) {
        setIsOpenMenu(false);
      }
    };
    if (isOpenMenu) {
      window.addEventListener('resize', handleChangeWidth);
    }
    return () => {
      window.removeEventListener('resize', handleChangeWidth);
    };
  }, [isOpenMenu]);

  // Проверка наличия токена при начальном загрузке приложения
  // достаем токен из хранилища, если токен на месте, отправляем. в случае успеха обратно прилетают данные 
  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      checkToken(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            api.setToken(localStorage.getItem('jwt'))
            navigate(paths.main, { replace: true });
            setHeaderInfo(res);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  // Забираем данные карточек и пользователя при загрузке приложения
  React.useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem('jwt')
      Promise.all([api.getUserInfo(token), api.getInitialCards(token)])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  // Обработчик закрытия крестиком для всех попапов
  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setCardToDelete(null);
    setIsInfoPopupOpen({isOpen: false, isSuccess: false});
  };

  // Обработчики открытия попапов
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };
  const handleCardClick = (link) => {
    setSelectedCard(link);
  };


  const handleClickBurger = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  // всплывающее уведомление
  const showNotification = (message, isSuccess, isActive) => {
    setNotification({ message, isSuccess, isActive });
    setTimeout(
      () => setNotification({ message, isSuccess, isActive: false }),
      2000
    );
  };

  //обработка лайка
  const handleCardLike = React.useCallback(
    (card, myId) => {
      //проверяем есть ли лайк
      const isLiked = card.likes.some((like) => {
        return like === myId;
      });

      //если isLiked вернула true - убираем, false - ставим
      isLiked
        ? api
            .deleteLike(card._id)
            .then((newCardData) => {
              setCards((cardsInState) => {
                return cardsInState.map((cardInState) => {
                  return cardInState._id === card._id
                    ? newCardData
                    : cardInState;
                });
              });
            })
            .catch((err) => console.log(err))
        : api
            .putLike(card._id)
            .then((newCardData) => {
              setCards((cardsInState) => {
                return cardsInState.map((cardInState) => {
                  return cardInState._id === card._id
                    ? newCardData
                    : cardInState;
                });
              });
            })
            .catch((err) => console.log(err));
    },
    [setCards]
  );

  //обработка передачи данных на сервер удаления карточки
  const handleCardDelete = React.useCallback(
    (cardToDelete) => {
      setShowLoading('...');
      api
        .deleteCard(cardToDelete._id)
        .then(() => {
          setCards((state) => {
            return state.filter((cardInState) => {
              return cardInState._id !== cardToDelete._id;
            });
          });
          showNotification('Карточка удалена', true, true);
          closeAllPopups();
        })
        .catch((err) =>
          showNotification(`Карточка не удалена, ${err}`, false, true)
        )
        .finally(() => {
          setShowLoading('');
        });
    },
    [setCards]
  );

  //обработка клика по корзине
  const handleClickDelete = React.useCallback(
    (card) => {
      setCardToDelete(card);
    },
    [setCardToDelete]
  );

  //обработка передачи на сервер обновлению данных пользователя
  const handleUpdateUser = React.useCallback(
    ({ name, about }) => {
      setShowLoading('...');
      api
        .setProfileData({ name, about })
        .then((newUserData) => {
          setCurrentUser(newUserData);
          showNotification('Данные пользователя обновлены', true, true);
          closeAllPopups();
        })
        .catch((err) =>
          showNotification(`Данные не обновлены, ${err}`, false, true)
        )
        .finally(() => {
          setShowLoading('');
        });
    },
    [setCurrentUser]
  );

  //обработка передачи данных на сервер нового аватара
  const handleUpdateAvatar = React.useCallback(
    (avatar) => {
      setShowLoading('...');
      api
        .setUserAvatar(avatar)
        .then((newUserData) => {
          setCurrentUser(newUserData);
          showNotification('Аватар обновлен', true, true);
          closeAllPopups();
        })
        .catch((err) =>
          showNotification(`Аватар не обновлен, ${err}`, false, true)
        )
        .finally(() => {
          setShowLoading('');
        });
    },
    [setCurrentUser]
  );

  //обработка передачи данных на сервер добавления новый карточки
  const handleAddPlaceSubmit = React.useCallback(
    (inputValues) => {
      setShowLoading('...');
      api
        .addNewCard(inputValues)
        .then((newCard) => {
          setCards([newCard, ...cards]);
          showNotification('Новая карточка добавлена', true, true);
          closeAllPopups();
        })
        .catch((err) =>
          showNotification(`Новая карточка не добавлена, ${err}`, false, true)
        )
        .finally(() => {
          setShowLoading('');
        });
    },
    [cards]
  );

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          paths={paths}
          headerInfo={headerInfo}
          onSignOut={handleSignOut}
          onBurgerClick={handleClickBurger}
          isOpenMenu={isOpenMenu}
        />
        <InfoTooltip
          popupState={isInfoPopupOpen}
          onClose={closeAllPopups}
        />
        <Routes>
          <Route
            path="*"
            element={
              loggedIn 
              ? (<Navigate to={paths.main} replace />) 
              : (<Navigate to={paths.login} replace />)
            }
          />
          <Route
            path={paths.login}
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path={paths.registration}
            element={
              <Register redirectPath={paths} onRegistration={handleRegistration} />
            }
          />
          <Route
            path={paths.main}
            element={
              <ProtectedRoute redirectPath={paths.login} loggedIn={loggedIn}>
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onClickDelete={handleClickDelete}
                  cards={cards}
                />
                <Footer />
                <PopupWithConfirmation
                  onClose={closeAllPopups}
                  isOpen={cardToDelete}
                  onLoading={showLoading}
                  onConfirm={handleCardDelete}
                />
                <EditAvatarPopup
                  isOpen={isEditAvatarPopupOpen}
                  onClose={closeAllPopups}
                  onUpdateAvatar={handleUpdateAvatar}
                  onLoading={showLoading}
                />
                <EditProfilePopup
                  isOpen={isEditProfilePopupOpen}
                  onClose={closeAllPopups}
                  onUpdateUser={handleUpdateUser}
                  onLoading={showLoading}
                />
                <AddPlacePopup
                  isOpen={isAddPlacePopupOpen}
                  onClose={closeAllPopups}
                  onAddCard={handleAddPlaceSubmit}
                  onLoading={showLoading}
                />
                <ImagePopup card={selectedCard} onClose={closeAllPopups} />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Notification onAction={notification} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
