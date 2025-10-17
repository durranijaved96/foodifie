import { styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

interface AppSummaryProps {
  color?: string;
  image: string;
  title: string;
  subheader: string;
  sx?: object;
  children?: ReactNode;
}

const StyledImage = styled('img')(({ theme }) => ({
  width: theme.spacing(14), // Slightly larger width
  height: theme.spacing(14), // Slightly larger height
  borderRadius: '50%',
  objectFit: 'cover',
}));

const BouncyCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  height: 160, // Slightly larger height
  overflow: 'hidden',
}));

const AppSummary: React.FC<AppSummaryProps> = ({
  title,
  subheader,
  image,
  color = '#00A5AA',
  sx,
  ...other
}) => {
  return (
    <Link to="/dashboard/app" style={{ textDecoration: 'none' }}>
      <BouncyCard
        sx={{
          py: 2,
          px: 3,
          textAlign: 'center',
          color: '#4F536E', // Text color set to "#4F536E"
          backgroundColor: `rgba(0, 165, 170, 0.2)`,
          backgroundClip: 'padding-box',
          borderRadius: '8px',
          boxShadow: '0px 0px 1px 0px #919EAB inset',
          ...sx,
        }}
        {...other}
      >
        <StyledImage src={image} alt={title} />
        <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
          {subheader}
        </Typography>
      </BouncyCard>
    </Link>
  );
};

AppSummary.propTypes = {
  color: PropTypes.string,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subheader: PropTypes.string.isRequired,
  sx: PropTypes.object
};

export default AppSummary;
