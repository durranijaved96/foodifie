
// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { _mock } from "../mock/_mock";

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: 'your-user-id',
    displayName: 'Waqas Durrani',
    email: 'admin@foodifie.com',
    password: 'passwordIaa23@#',
    phoneNumber: 'your-phone-number',
    country: 'Your Country',
    address: 'Your Address',
    state: 'Your State',
    city: 'Your City',
    zipCode: 'Your Zip Code',
    about: 'About you...',
    role: 'user',
    isPublic: true,
  };

  return { user };
}
