import { ReactNode } from "react";

interface Account {
    role: ReactNode;
    displayName: string;
    email: string;
    photoURL: string;
  }
  
  const account: Account = {
    displayName: 'Waqas Durrani',
    email: 'durranijaved96@gmail.com',
    photoURL: '/images/avatars/avatar_default.jpg',
    role: undefined
  };
  
  export default account;
  