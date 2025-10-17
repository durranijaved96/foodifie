export function useNavData() {
  const navConfig = [
    {
      subheader: 'Home',
      items: [
        {
          title: 'My Dashboard',
          path: '/dashboard/home',
        },
        
      ],
    },
    {
      subheader: 'Overview',
      items: [
        {
          title: 'Projects',
          path: '/app/dashboard',
        },
        {
          title: 'Subscriptions',
          path: '/dashboard/subscription',
        },
      ],
    },
    {
      subheader: 'Imprint',
      items: [
        {
          title: 'Imprint / Impressum',
          path: 'https://imprint-impressum/',
        },
        {
          title: 'Privacy policy',
          path: 'https://app-privacy-policy/',
        },
      ],
    },
  ];

  return navConfig;
}
