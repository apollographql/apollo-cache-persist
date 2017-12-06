import { AppState } from 'react-native';

export default () => callback => {
  let wasActive = true;

  const listener = state => {
    console.log(state);
    if (state === 'active') {
      wasActive = true;
    } else if (wasActive) {
      wasActive = false;
      callback();
    }
  };

  AppState.addEventListener('change', listener);
  return () => AppState.removeEventListener('change', listener);
};
