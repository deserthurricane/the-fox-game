import { useCallback, useContext, useState } from "react";
import { Button, Input } from '../../components';
import { ScreenContext } from "../../store/ScreenProvider";
import { UserContext } from "../../store/UserProvider";
import './styles.css';

export function LoginContainer() {
  const [editMode, setEditMode] = useState<boolean>(true);
  const [name, setName] = useState<string>('');

  const { setScreen } = useContext(ScreenContext);
  const { setUser } = useContext(UserContext);

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
        <span>
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