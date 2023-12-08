import React, { useState } from 'react';
import {
  BsEyeFill,
  BsEyeSlashFill,
  BsClipboard,
  BsFillPencilFill,
  BsFloppy2Fill,
} from 'react-icons/bs';
import { ImBin } from 'react-icons/im';
import {
  REMOVE_PASSWORD,
  UPDATE_PASSWORD,
} from '../../../constants/renderer/actions';
import { handleFavicon } from '../../utils/handleFavicon';
import './password-item.css';
import Modal from '../Modal.jsx';
const PasswordItem = ({
  id,
  site,
  username,
  password: pass,
  passwordsDispatch,
}) => {
  const [password, setPassword] = useState(pass);
  const [toggled, setToggled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const [pswEditMode, setPswEditMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggle = () => {
    setToggled(!toggled);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRemove = async () => {
    await passwordsDispatch({
      type: REMOVE_PASSWORD,
      payload: {
        id,
      },
    });
  };

  const passwordEditHandler = () => {
    setPswEditMode(true);
    inputRef.current.focus();
  };
  const handleCopyText = (text) => {
    if (text) {
      navigator.clipboard.writeText(text).then(
        () => {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000); // Allows tooltip to show for 3 seconds !
        },
        () => console.log('Error copying the text.')
      );
    }
  };

  const handleModalInput = (e) => {
    setModalInput(e.target.value.trim());
  };

  const savePasswordHandler = (e) => {
    e.preventDefault();
    if (pswEditMode) {
      passwordsDispatch({
        type: UPDATE_PASSWORD,
        payload: {
          id,
          updatedPassword: {
            password: password,
          },
        },
      });
    }
    setPswEditMode(false);
  };
  return (
    <div className='psw-container'>
      <div className='url-container'>
        <div className='url-set'>
          <img className='url__favicon' src={handleFavicon(site)} />
          <p className='url__site'>{site}</p>
        </div>
      </div>
      <div className='user-psw-container'>
        <div className='username-box'>
          <label htmlFor='username-input'>Username</label>
          <div className='username'>
            <input
              type='text'
              id='username-input'
              className='username-input'
              name='username-input'
              value={username}
              disabled
            />
            <button
              className='copy-icon-username'
              onClick={() => handleCopyText(username)}
            >
              <BsClipboard />
            </button>
          </div>
        </div>
        <div className='psw-box'>
          <label htmlFor='psw-input'>Password</label>
          <div className='psw'>
            <input
              id='psw-input'
              className='psw-input'
              type={!toggled ? 'password' : 'text'}
              value={password}
              onChange={!pswEditMode ? null : handleChangePassword}
              disabled={!pswEditMode}
            />
            <button className='visibility-icon' onClick={handleToggle}>
              {!toggled ? <BsEyeFill /> : <BsEyeSlashFill />}
            </button>
            <button
              className='copy-icon-psw'
              onClick={() => handleCopyText(password)}
            >
              <BsClipboard />
            </button>
          </div>
        </div>
      </div>
      <div className='buttons-container'>
        <button
          className='edit-btn'
          onClick={!pswEditMode ? passwordEditHandler : savePasswordHandler}
        >
          {!pswEditMode ? (
            <>
              <span>Edit Password</span>
              <BsFillPencilFill />
            </>
          ) : (
            <>
              <span>Save Password</span>
              <BsFloppy2Fill />
            </>
          )}
        </button>

        <button className='delete-btn' onClick={() => setShowModal(true)}>
          <span>Delete</span>
          <ImBin />
        </button>
      </div>

      {showModal && (
        <Modal
          changeHandler={handleModalInput}
          inputText={modalInput}
          closeModalHandler={() => setShowModal(false)}
          deleteHandler={handleRemove}
        />
      )}
      {showTooltip && (
        <p className='copyTextTooltip'>Text copied to clipboard !</p>
      )}
    </div>
  );
};

export default PasswordItem;
