import React, { useEffect, useState } from 'react';

import Close from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { createPortal } from 'react-dom';
import { useIntl } from 'react-intl';
import Joyride from 'react-joyride';
import { useJoyrideLocale } from './joyRideLocale';
import { getJoyrideStyles, onboardingTokens } from './joyRideStyles';

interface HomeSelfOnboardingProps {
   onExit?: () => void;
}
//  Helper to avoid duplication warning
const createStep = (target: string, content: string) => ({ target, content });

const WelcomeContent = ({ onStart, onClose, intl }: { onStart: () => void; onClose: () => void; intl: any }) => (
   <Box
      sx={{
         position: 'fixed',
         top: 0,
         left: 0,
         width: '100vw',
         height: '100vh',
         borderRadius: onboardingTokens.borderRadius,
         backgroundColor: onboardingTokens.overlayBg,
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         zIndex: 2000,
      }}
   >
      <Paper
         component="div"
         elevation={3}
         sx={{
            position: 'relative',
            padding: 4,
            borderRadius: 4,
            maxWidth: onboardingTokens.paperMaxWidth,
            textAlign: 'center',
         }}
      >
         <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
               position: 'absolute',
               right: 8,
               top: 8,
               color: 'grey.500',
            }}
         >
            <Close />
         </IconButton>
         <br />
         <Typography variant="h5" gutterBottom>
            {intl.formatMessage({
               id: 'selfOnboarding.home.welcome',
               defaultMessage: 'Welcome to Your Home Section in Envoria',
            })}
         </Typography>
         <Typography variant="body1" sx={{ mb: 3 }}>
            {intl.formatMessage({
               id: 'selfOnboarding.home.welcomeText',
               defaultMessage: 'This short tour will help you explore the key features of your home section.',
            })}
         </Typography>
         <Button variant="contained" color="primary" sx={{ borderRadius: 2 }} onClick={onStart}>
            {intl.formatMessage({
               id: 'selfOnboarding.home.startButton',
               defaultMessage: 'Start Tour',
            })}
         </Button>
      </Paper>
   </Box>
);
const HomeSelfOnboarding: React.FC<HomeSelfOnboardingProps> = ({ onExit }) => {
   const [startTour, setStartTour] = useState(false);
   const [showWelcome, setShowWelcome] = useState(true);
   const theme = useTheme();
   const intl = useIntl();
   const [mounted, setMounted] = useState(false);

   const homeLocale = useJoyrideLocale();
   useEffect(() => setMounted(true), []);
   const tourSteps = [
      createStep(
         '[data-tour="home-heading"]',
         intl.formatMessage({
            id: 'selfOnboarding.home.tour.homeHeading',
            defaultMessage: 'Your personalized Home dashboard. Everything starts here.',
         })
      ),
      createStep(
         '[data-tour="ticketing-button"]',
         intl.formatMessage({ id: 'selfOnboarding.home.tour.ticketingButton', defaultMessage: 'Need help? Click here to create a support ticket.' })
      ),
      createStep(
         '[data-tour="knowledge-button"]',
         intl.formatMessage({ id: 'selfOnboarding.home.tour.knowledgeButton', defaultMessage: 'Need help? Click here to get to our knowledge hub.' })
      ),
      createStep(
         '[data-tour="widget-button"]',
         intl.formatMessage({
            id: 'selfOnboarding.home.tour.widgetButton',
            defaultMessage: 'Click here to add widgets like Tasks, Notes, or Emissions.',
         })
      ),
      createStep(
         '[data-tour="edit-mode-button"]',
         intl.formatMessage({
            id: 'selfOnboarding.home.tour.editModeButton',
            defaultMessage: 'Switch between view and edit mode for layout customization.',
         })
      ),
      createStep(
         '[data-tour="announcement-slider"]',
         intl.formatMessage({
            id: 'selfOnboarding.home.tour.announcementSlider',
            defaultMessage: 'Stay informed with the latest announcements here.',
         })
      ),
   ];
   return (
      <>
         {showWelcome &&
            mounted &&
            createPortal(
               <WelcomeContent
                  onStart={() => {
                     setShowWelcome(false);
                     setStartTour(true);
                  }}
                  onClose={() => {
                     setShowWelcome(false);
                     onExit?.();
                  }}
                  intl={intl}
               />,
               document.body
            )}

         <Joyride
            run={startTour}
            showProgress={false}
            steps={tourSteps}
            continuous
            showSkipButton
            callback={(data) => {
               const { status } = data;
               const finishedStatuses = ['finished', 'skipped'];

               if (finishedStatuses.includes(status)) {
                  // End of tour
                  onExit?.();
               }
            }}
            styles={getJoyrideStyles(theme)}
            locale={homeLocale}
         />
      </>
   );
};

export default HomeSelfOnboarding;
