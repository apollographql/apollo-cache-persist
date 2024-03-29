import { AppState } from 'react-native';

export default () => (persist: () => void) => {
  let wasActive = true;

  const listener = (state: string) => {
    if (state === 'active') {
      wasActive = true;
    } else if (wasActive) {
      wasActive = false;
      persist();
    }
  };

  const subscription = AppState.addEventListener('change', listener);
  return () => subscription.remove();
};
