import { useState, useEffect } from 'react';

const useKeyPress = callback => {
    const [keyPressed, setKeyPressed] = useState();
    useEffect(() => {

        const downHandler = ({ key }) => {
            //check for different keystroke and single char key (not CTRL, ESC, etc)
            if (keyPressed !== key && key.length === 1) {
                setKeyPressed(key);
                callback && callback(key);
            }
        };

        const upHandler = () => {
            setKeyPressed(null);
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        //remove listeners on return
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    });
};

export default useKeyPress;