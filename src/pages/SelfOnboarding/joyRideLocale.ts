import { useIntl } from 'react-intl';

export const useJoyrideLocale = () => {
   const intl = useIntl();
   return {
      back: intl.formatMessage({ id: 'selfOnboarding.home.previousButton', defaultMessage: 'Previous' }),
      close: intl.formatMessage({ id: 'selfOnboarding.home.finishButton', defaultMessage: 'Finish' }),
      last: intl.formatMessage({ id: 'selfOnboarding.home.finishButton', defaultMessage: 'Finish' }),
      next: intl.formatMessage({ id: 'selfOnboarding.home.nextButton', defaultMessage: 'Next' }),
      skip: intl.formatMessage({ id: 'selfOnboarding.home.skipButton', defaultMessage: 'Skip' }),
   };
};
