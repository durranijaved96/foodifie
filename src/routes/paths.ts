
const ROOTS = {
    AUTH: '/login',
    DASHBOARD: '/dashboard',
    AUTH_DEMO: '/auth-demo',
  };
  export const paths = {
  dashboard: {
    root: ROOTS.DASHBOARD,
    app: `${ROOTS.DASHBOARD}/app`,
    projects: `${ROOTS.DASHBOARD}/projects`,
    invoice: {
      root: `${ROOTS.DASHBOARD}/projects`,
      new: `${ROOTS.DASHBOARD}/projects/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/projects/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/projects/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/projects/`,
        edit: `${ROOTS.DASHBOARD}/projects/edit`,
      },
    },
    authDemo: {
      classic: {
        login: `${ROOTS.AUTH_DEMO}/classic/login`,
        register: `${ROOTS.AUTH_DEMO}/classic/register`,
        forgotPassword: `${ROOTS.AUTH_DEMO}/resetpassword`,
        newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
        verify: `${ROOTS.AUTH_DEMO}/classic/verify`
      },
      modern: {
        login: `${ROOTS.AUTH_DEMO}/modern/login`,
        register: `${ROOTS.AUTH_DEMO}/modern/register`,
        forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
        newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
        verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
      },
    },
  },
}