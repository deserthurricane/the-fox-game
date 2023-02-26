import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Input } from '../../components';
import { ScreenContext } from "../../store/ScreenProvider";
import { UserContext } from "../../store/UserProvider";
import './styles.css';

/**
 * Login page container
 */
export function LoginContainer() {
  const [editMode, setEditMode] = useState<boolean | null>(null);
  const [name, setName] = useState<string>('');

  const { setScreen } = useContext(ScreenContext);
  const { user: savedUser, setUser } = useContext(UserContext);

  const hideInput = useCallback(() => {
    if (name.length > 0) {
      setEditMode(false);
    }
  }, [name]);

  const goToGamePage = useCallback(() => {
    setScreen('game');
    setUser(name);
  }, [name, setScreen, setUser]);

  useEffect(() => {
    setEditMode(!savedUser);
    
    if (savedUser) {
      setName(savedUser);
    }
  }, [savedUser]);

  if (editMode === null) {
    return null;
  }

  return (
    <>
      {editMode ? (
        <Input
          name="name"
          label="Name"
          value={name}
          autoFocus={true}
          autoComplete="off"
          onChange={setName}
          onBlur={hideInput}
        />
      ) : (
        <span className="name_wrapper">
          Hello&nbsp;
          <span className="name" onClick={() => setEditMode(true)}>
            {name}
          </span>
        </span>
      )}
      <Button 
        className="play_button"
        text="PLAY!"
        disabled={name.length === 0}
        onClick={goToGamePage}
      />
    </>
  )
}