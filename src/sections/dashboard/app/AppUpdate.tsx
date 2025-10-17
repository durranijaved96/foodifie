import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Divider, Typography, CardHeader, styled, IconButton } from '@mui/material';
import { fToNow } from '../../../utils/formatTime';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import Logo from '../../../assets/images/Connectivity 01.svg';
import Icon from '../../../assets/images/Logo.png';
import Iconify from '../../../components/iconify/Iconify';
import { Popover, MenuItem } from '@mui/material';
import React, { useState } from 'react'; // Import useState
// ----------------------------------------------------------------------

interface News {
  id: string;
  description: string;
  image: string;
  postedAt: Date;
  title: string;
}

interface AppUpdateProps {
  title: string;
  subheader: string;
  list: News[];
}

const StyledLogo = styled('img')(({ theme }) => ({
  width: 'auto',
  height: 'auto',
  position: 'absolute',
  top: -50,
}));

const BouncyCard = styled(Card)(({ theme }) => ({
  // Add the transition for the hover effect
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)', // Increase the scale on hover to create the bouncy effect
    borderColor: 'rgba(0, 165, 170, 0.2)', // Change the border color on hover
  },
  borderRadius: '12px', // Add rounded edges to the card
  boxShadow: '0px 0px 1px 0px #919EAB inset', // Add the box shadow
  borderColor: 'transparent', // Set the default border color to transparent
  borderWidth: 2, // Set the default border width to 2px
  borderStyle: 'solid', // Set the default border style to solid
}));

const BouncyIconBox = styled(Box)(({ theme }) => ({
  width: 40, // Increase the size of the icon box
  height: 40, // Increase the size of the icon box
  borderRadius: '13%', // Make the icon box circular
  backgroundColor: 'rgba(0, 165, 170, 0.2)', // Set the background color on the sides of the icon
  padding: 8, // Add padding to create space between the icon and the background color
  display: 'flex',
  justifyContent: 'center', // Center the icon horizontally
  alignItems: 'center', // Center the icon vertically
  boxShadow: '0px 0px 10px rgba(0, 165, 170, 0.5)', // Add a subtle shadow effect around the icon
  marginRight: theme.spacing(2),
}));

AppUpdate.propTypes = {
  title: PropTypes.string.isRequired,
  subheader: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      postedAt: PropTypes.instanceOf(Date).isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function AppUpdate({ title, subheader, list, ...other }: AppUpdateProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for popover anchor element

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);
  return (
    <>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        My Projects
      </Typography>
      <BouncyCard {...other}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <BouncyIconBox>
                <Box component="img" alt="Logo Icon" src={Icon} sx={{ width: 40, height: 40, flexShrink: 1 }} />
              </BouncyIconBox>
              <Stack>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {title}
                </Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                  {subheader}
                </Typography>
              </Stack>
              <IconButton
        size="large"
        color="inherit"
        sx={{ opacity: 0.48 }}
        aria-describedby="app-update-menu"
        onClick={handlePopoverOpen} // Open the popover when clicked
      >
        <Iconify icon={'eva:more-vertical-fill'} />
  
      </IconButton> 
      <Popover
        id="app-update-menu"
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose} // Close the popover when clicked outside
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            p: 1,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handlePopoverClose}>
        <Box sx={{ marginRight: 2 }}>
          <Iconify icon={'eva:edit-fill'} />
          </Box>Edit</MenuItem> 
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={handlePopoverClose} sx={{ color: 'error.main' }}>
        <Box sx={{ marginRight: 2 }}>
        <Iconify icon={'eva:trash-2-outline'} />
        </Box>
        Delete</MenuItem>
      </Popover>
            </Stack>
          }
        />

        {/* Centered Image */}
        <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
          <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
            <StyledLogo src={Logo} alt="Logo" />
          </Stack>
        </Box>

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
            {list.map((news) => (
              <AppItem key={news.id} news={news} />
            ))}
          </Stack>
        </Scrollbar>

        <Divider />
      </BouncyCard>
    </>
  );
}

// ----------------------------------------------------------------------

AppItem.propTypes = {
  news: PropTypes.shape({
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    postedAt: PropTypes.instanceOf(Date).isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

interface AppItemProps {
  news: News;
}

function AppItem({ news }: AppItemProps) {
  const { image, title, description, postedAt } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={title}
        src={image}
        sx={{ width: 78, height: 78, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {title}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}sa
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(postedAt)}
      </Typography>
    </Stack>
  );
}
