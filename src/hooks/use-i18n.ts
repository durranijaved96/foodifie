/* eslint-disable @typescript-eslint/no-unused-vars */

import { useTranslation } from 'react-i18next';


export function useI18n() {
    const { t, i18n } = useTranslation();

    return {t, i18n};
}