import { useState, useEffect } from 'react';

const useKeyPress = callback => {
    const [keyPressed, setKeyPressed] = useState();
    useEffect(() => {

        const downHandler = ({ key }) => {
            //check for different keystroke
            if (keyPressed !== key) {
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