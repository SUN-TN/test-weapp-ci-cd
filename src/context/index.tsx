import { createContext, useContext } from 'react';

import AuthStore from '@/stores/Auth';
import UserStore from '@/stores/User';

export type AppContextProps = {
  authStore: AuthStore;
  userStore: UserStore;
}
export const context = {
  authStore: new AuthStore(),
  userStore: new UserStore(),
};

const AppContext = createContext<AppContextProps>(context);

export const useAppContext = () => useContext(AppContext);

export default AppContext;
