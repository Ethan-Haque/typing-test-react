import { useState, useEffect } from 'react';

const useKeyPress = callback => {
    const [keyPressed, setKeyPressed] = useState();
    useEffect(() => {

        const downHandler = (e) => {
            // prevent spacebar scrolling 
            if (e.keyCode === 32) {
                e.preventDefault();
            }
            // check for different keystroke
            if (keyPressed !== e.key) {
                setKeyPressed(e.key);
                callback && callback(e.key);
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