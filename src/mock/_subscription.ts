/* eslint-disable @typescript-eslint/no-unused-vars */
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

// Function to initialize home plans
const initHomePlans = (t: TFunction) => {
  const _homePlans = [
    {
      license: 'Free trial',
      commons: [t('subscription.free-trial-card.first'), t('subscription.free-trial-card.second'), t('subscription.free-trial-card.third')],
      options: [
        t('subscription.free-trial-card.options.first'),
        t('subscription.free-trial-card.options.second'),
        t('subscription.free-trial-card.options.third')
      ],
      price: 0,
      buttonState: true, // Ensure this property is consistent across both arrays
    },
    {
      license: t('subscription.essential-card.license-name'),
      commons: [
        t('subscription.essential-card.commons.first'),
        t('subscription.essential-card.commons.second'),
        t('subscription.essential-card.commons.third')
      ],
      options: [
        t('subscription.essential-card.options.first'),
        t('subscription.essential-card.options.second'),
        t('subscription.essential-card.options.third')
      ],
      price: 10,
      priceId: 'price_1PQ5jP07SwzennMJmoNpav0v',
      buttonState: true,
    },
    {
      license: t('subscription.enterprise-card.license-name'),
      commons: [
        t('subscription.enterprise-card.commons.first'),
        t('subscription.enterprise-card.commons.second'),
        t('subscription.enterprise-card.commons.third')
      ],
      options: [
        t('subscription.essential-card.options.first'),
        t('subscription.enterprise-card.options.second'),
        t('subscription.enterprise-card.options.third'),
        t('subscription.enterprise-card.options.fourth')
      ],
      price: 200,
      buttonState: true,
    },
  ];

  const _homePlansYearly = [
    {
      license: 'Free trial',
      commons: [t('subscription.free-trial-card.first'), t('subscription.free-trial-card.second'), t('subscription.free-trial-card.third')],
      options: [
        t('subscription.free-trial-card.options.first'),
        t('subscription.free-trial-card.options.second'),
        t('subscription.free-trial-card.options.third')
      ],
      price: 0,
      buttonState: true,
    },
    {
      license: t('subscription.essential-card.license-name'),
      commons: [
        t('subscription.essential-card.commons.first'),
        t('subscription.essential-card.commons.second'),
        t('subscription.essential-card.commons.third')
      ],
      options: [
        t('subscription.essential-card.options.first'),
        t('subscription.essential-card.options.second'),
        t('subscription.essential-card.options.third')
      ],
      price: 100,
      priceId: 'price_1PQ6h307SwzennMJYuwRTiUd',
      buttonState: true,
    },
    {
      license: t('subscription.enterprise-card.license-name'),
      commons: [
        t('subscription.enterprise-card.commons.first'),
        t('subscription.enterprise-card.commons.second'),
        t('subscription.enterprise-card.commons.third')
      ],
      options: [
        t('subscription.essential-card.options.first'),
        t('subscription.enterprise-card.options.second'),
        t('subscription.enterprise-card.options.third'),
        t('subscription.enterprise-card.options.fourth')
      ],
      price: 2000,
      buttonState: true,
    },
  ];

  return { _homePlans, _homePlansYearly };
};

export default initHomePlans;
