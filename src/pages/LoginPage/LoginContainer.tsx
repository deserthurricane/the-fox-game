import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Input } from '../../components';
import { ScreenContext } from "../../store/ScreenProvider";
import { UserContext } from "../../store/UserProvider";
import './styles.css';

export function LoginContainer() {
  const [editMode, setEditMode] = useState<boolean | null>(null);
  const [name, setName] = useState<string>('');

  const { setScreen } = useContext(ScreenContext);
  const { user, setUser } = useContext(UserContext);

  const hideInput = useCallback(() => {
    if (name.length > 0) {
      setEditMode(false);
    }
  }, [name]);

  const goToGamePage = useCallback(() => {
    if (typeof setScreen === 'function') {
      setScreen('game');
      setUser({
        name,
      })
    }
  }, [name, setScreen, setUser]);

  useEffect(() => {
    setEditMode(!user.name);
    
    if (user.name) {
      setName(user.name);
    }
  }, [user.name]);

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
        text="PLAY!"
        disabled={name.length === 0}
        onClick={goToGamePage}
      />
    </>
  )
}