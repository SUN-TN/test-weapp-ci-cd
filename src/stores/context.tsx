import { createContext, useContext } from 'react';

import AuthStore from '@/stores/Auth';
import UserStore from '@/stores/User';

export type StoresProps = {
  authStore: AuthStore;
  userStore: UserStore;
}
export const context = {
  authStore: new AuthStore(),
  userStore: new UserStore(),
};

const StoresContext = createContext<StoresProps>(context);

export const useAppContext = () => useContext(StoresContext);

export default StoresContext;
