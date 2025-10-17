import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Box, Drawer, Typography, Stack } from "@mui/material";
import Scrollbar from "../../../components/scrollbar/Scrollbar";
import Logo from "../../../assets/images/Logo.png";
import APP_BAR_MOBILE from "../DashboardLayout";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import SvgIcon from "@mui/material/SvgIcon";
import { LinkProps } from "react-router-dom";

import { supabase } from "../../../supabase";
import { NAV } from "../../config-layout";
//import NavToggleButton from "../../_common/nav-toggle-button";
import i18n from "../../../i18n";

// Interface for custom link properties
interface CustomLinkProps extends LinkProps {
  isActive?: boolean; // Define the optional isActive prop
}

// Interface for the Nav component's properties
interface NavProps {
  openNav: boolean;
  onCloseNav: () => void;
}


// Styled components
const StyledLogo = styled("img")(({ theme }) => ({
  width: 130,
  position: "absolute",
  top: -80,
  left: "50%", // Center the logo horizontally
  transform: "translateX(-50%)", // Center the logo horizontally
}));

const StyledAccount = styled(Link)<CustomLinkProps>(({ theme, isActive }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1.5),
  textDecoration: "none",
  color: isActive ? "#008B8F" : "var(--Text-Secondary, #637381)", // Text color change based on active state
  "&:hover": {
    backgroundColor: "rgba(0, 165, 170, 0.1)", // Background color change
    color: "#32B7BB", // Text color on hover
    "& svg": {
      fill: "#32B7BB", // SVG color on hover
    },
  },
  cursor: "pointer",
}));

// Define the navigation icons
const ProjectsIcon = () => (
  <Box sx={{ display: "flex", alignItems: "center", marginRight: "8px" }}>
    <SvgIcon style={{ fill: "var(--Text-Secondary, #637381)" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          opacity="0.32"
          d="M21.1808 16.9703C20.8971 17.6255 20.2225 18 19.5086 18H14.8154C14.8462 17.9145 14.8735 17.8269 14.8971 17.7373C15.1709 16.6974 14.8825 15.639 14.2214 14.8963C14.4654 12.9091 14.6177 10.8733 14.7108 9.26516C14.7569 8.46731 13.7795 8.20081 13.4274 8.91526C12.7178 10.3553 11.8493 12.1958 11.0842 14.041C10.1467 14.3479 9.3768 15.1177 9.10295 16.1576C8.93642 16.7899 8.97782 17.4291 9.18451 18H4.49141C3.77747 18 3.10288 17.6255 2.81918 16.9703C2.29212 15.7533 2 14.4108 2 13C2 7.47715 6.47715 3 12 3C17.5229 3 22 7.47715 22 13C22 14.4108 21.7079 15.7533 21.1808 16.9703Z"
          fill="black"
          fill-opacity="0.38"
        />
        <path
          d="M14.7108 9.26515C14.7569 8.4673 13.7795 8.2008 13.4274 8.91525C12.7178 10.3552 11.8493 12.1958 11.0842 14.041C10.1467 14.3478 9.3768 15.1176 9.10295 16.1575C8.6742 17.7856 9.62375 19.459 11.2238 19.8952C12.8238 20.3315 14.4684 19.3653 14.8971 17.7373C15.1709 16.6974 14.8825 15.639 14.2214 14.8963C14.4654 12.9091 14.6177 10.8732 14.7108 9.26515Z"
          fill="black"
          fill-opacity="0.56"
        />
      </svg>
    </SvgIcon>
  </Box>
);

// Active version of the projects icon
const ProjectsActiveIcon = () => (
  <Box sx={{ display: "flex", alignItems: "center", marginRight: "8px" }}>
    <SvgIcon style={{ fill: "#00A5AA" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          opacity="0.32"
          d="M21.1808 16.9703C20.8971 17.6255 20.2225 18 19.5086 18H14.8154C14.8462 17.9145 14.8735 17.8269 14.8971 17.7373C15.1709 16.6974 14.8825 15.639 14.2214 14.8963C14.4654 12.9091 14.6177 10.8733 14.7108 9.26516C14.7569 8.46731 13.7795 8.20081 13.4274 8.91526C12.7178 10.3553 11.8493 12.1958 11.0842 14.041C10.1467 14.3479 9.3768 15.1177 9.10295 16.1576C8.93642 16.7899 8.97782 17.4291 9.18451 18H4.49141C3.77747 18 3.10288 17.6255 2.81918 16.9703C2.29212 15.7533 2 14.4108 2 13C2 7.47715 6.47715 3 12 3C17.5229 3 22 7.47715 22 13C22 14.4108 21.7079 15.7533 21.1808 16.9703Z"
          fill="#00A5AA"
          fill-opacity="0.5"
        />
        <path
          d="M14.7108 9.26516C14.7569 8.46731 13.7795 8.20081 13.4274 8.91526C12.7178 10.3553 11.8493 12.1958 11.0842 14.041C10.1467 14.3479 9.3768 15.1177 9.10295 16.1576C8.6742 17.7856 9.62375 19.459 11.2238 19.8953C12.8238 20.3315 14.4684 19.3654 14.8971 17.7373C15.1709 16.6974 14.8825 15.639 14.2214 14.8963C14.4654 12.9091 14.6177 10.8733 14.7108 9.26516Z"
          fill="#00A5AA"
        />
      </svg>
    </SvgIcon>
  </Box>
);

// Define the subscription icon
const SubscriptionIcon = () => (
  <SvgIcon
    style={{ fill: "var(--Text-Secondary, #637381)", marginRight: "8px" }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        opacity="0.32"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.9114 8.22695C19.4717 8.5891 17.7718 8.61315 16.3035 8.1646C15.6828 7.97495 15.1988 7.4914 14.9893 6.8771C14.4674 5.34677 14.3385 3.47362 14.722 2.0318C13.9279 2.01186 13.0248 2 12 2C8.51575 2 6.43945 2.13682 5.26285 2.26379C4.39116 2.35785 3.71902 2.94826 3.5558 3.80967C3.30175 5.15055 3 7.65725 3 12C3 16.3428 3.30175 18.8494 3.5558 20.1903C3.71902 21.0518 4.39116 21.6422 5.26285 21.7362C6.43945 21.8631 8.51575 22 12 22C15.4843 22 17.5606 21.8631 18.7372 21.7362C19.6089 21.6422 20.281 21.0518 20.4442 20.1903C20.6982 18.8494 21 16.3428 21 12C21 10.5445 20.9661 9.2952 20.9114 8.22695ZM8 13C7.4477 13 7 12.5523 7 12C7 11.4477 7.4477 11 8 11H12C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13H8ZM8 17.5C7.4477 17.5 7 17.0523 7 16.5C7 15.9477 7.4477 15.5 8 15.5H15C15.5523 15.5 16 15.9477 16 16.5C16 17.0523 15.5523 17.5 15 17.5H8Z"
        fill="#637381"
      />
      <path
        d="M7 16.5C7 17.0523 7.4477 17.5 8 17.5H15C15.5523 17.5 16 17.0523 16 16.5C16 15.9477 15.5523 15.5 15 15.5H8C7.4477 15.5 7 15.9477 7 16.5Z"
        fill="#637381"
      />
      <path
        d="M7 12C7 12.5523 7.4477 13 8 13H12C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11H8C7.4477 11 7 11.4477 7 12Z"
        fill="#637381"
      />
      <path
        d="M20.9114 8.22695C19.4717 8.5891 17.7718 8.61315 16.3036 8.1646C15.6828 7.97495 15.1988 7.4914 14.9893 6.8771C14.4674 5.34675 14.3384 3.47357 14.722 2.03174C14.722 2.03174 15.9461 2.49994 18.1961 4.74994C20.4461 6.99995 20.9114 8.22695 20.9114 8.22695Z"
        fill="#637381"
      />
    </svg>
  </SvgIcon>
);

// Active version of the subscription icon
const SubscriptionActiveIcon = () => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        opacity="0.32"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.9114 8.22695C19.4717 8.5891 17.7718 8.61315 16.3035 8.1646C15.6828 7.97495 15.1988 7.4914 14.9893 6.8771C14.4674 5.34677 14.3385 3.47362 14.722 2.0318C13.9279 2.01186 13.0248 2 12 2C8.51575 2 6.43945 2.13682 5.26285 2.26379C4.39116 2.35785 3.71902 2.94826 3.5558 3.80967C3.30175 5.15055 3 7.65725 3 12C3 16.3428 3.30175 18.8494 3.5558 20.1903C3.71902 21.0518 4.39116 21.6422 5.26285 21.7362C6.43945 21.8631 8.51575 22 12 22C15.4843 22 17.5606 21.8631 18.7372 21.7362C19.6089 21.6422 20.281 21.0518 20.4442 20.1903C20.6982 18.8494 21 16.3428 21 12C21 10.5445 20.9661 9.2952 20.9114 8.22695ZM8 13C7.4477 13 7 12.5523 7 12C7 11.4477 7.4477 11 8 11H12C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13H8ZM8 17.5C7.4477 17.5 7 17.0523 7 16.5C7 15.9477 7.4477 15.5 8 15.5H15C15.5523 15.5 16 15.9477 16 16.5C16 17.0523 15.5523 17.5 15 17.5H8Z"
        fill="#32B7BB"
      />
      <path
        d="M7 16.5C7 17.0523 7.4477 17.5 8 17.5H15C15.5523 17.5 16 17.0523 16 16.5C16 15.9477 15.5523 15.5 15 15.5H8C7.4477 15.5 7 15.9477 7 16.5Z"
        fill="#008B8F"
      />
      <path
        d="M7 12C7 12.5523 7.4477 13 8 13H12C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11H8C7.4477 11 7 11.4477 7 12Z"
        fill="#008B8F"
      />
      <path
        d="M20.9114 8.22695C19.4717 8.5891 17.7718 8.61315 16.3036 8.1646C15.6828 7.97495 15.1988 7.4914 14.9893 6.8771C14.4674 5.34675 14.3384 3.47357 14.722 2.03174C14.722 2.03174 15.9461 2.49994 18.1961 4.74994C20.4461 6.99995 20.9114 8.22695 20.9114 8.22695Z"
        fill="#008B8F"
      />
    </svg>
  </SvgIcon>
);

// Nav component
const Nav: React.FC<NavProps> = ({ openNav, onCloseNav }) => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const navHeight = `calc(100% - ${APP_BAR_MOBILE}px)`;

  // State to store the user's plan information
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const fetchUserPlan = async () => {
    try {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }

      // Fetch the current user
      const { data: authResponse } = await supabase.auth.getUser();
      const authUser = authResponse?.user;

      if (authUser) {
        const authId = authUser.id;

        // Fetch the user ID based on the auth ID
        const { data: userIdResponse } = await supabase
          .from("User")
          .select("user_id")
          .eq("auth_id", authId)
          .single();

        const userId = userIdResponse?.user_id;

        if (userId) {
          // Fetch the tenant ID based on the user ID
          const { data: tenantResponse } = await supabase
            .from("TenantUser")
            .select("tenant_id")
            .eq("user", userId)
            .single();

          const tenantId = tenantResponse?.tenant_id;

          if (tenantId) {
            // Fetch the user's plan information based on the tenant ID
            const { data: tenantPlanResponse } = await supabase
              .from("TenantPlan")
              .select("plan_id")
              .eq("tenant_id", tenantId)
              .single();

            const planId = tenantPlanResponse?.plan_id;

            if (planId) {
              // Fetch the plan name based on the plan ID
              const { data: planResponse } = await supabase
                .from("Plan")
                .select("name")
                .eq("id", planId)
                .single();

              const planName = planResponse?.name;

              // Update the state with the user's plan name
              setUserPlan(planName);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching user plan information:", error.message);
    }
  };

  // Fetch the user's plan information when the component mounts
  useEffect(() => {
    fetchUserPlan();
  }, []);

  // Handle navigation change
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname, openNav, onCloseNav]);

  // Navigation configuration
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
      subheader: i18n.t("sidebar.overview"),
      items: [
        { title: i18n.t("sidebar.projects"), path: "/dashboard/app" },
        // Only show the subscription nav item if the user's plan is not "Beta"
        ...(userPlan !== "Beta"
          ? [
              {
                title: i18n.t("sidebar.subscription"),
                path: "/dashboard/subscription",
              },
            ]
          : []),
      ],
    },
  ];
  // Render content
  const renderContent = (
    <Scrollbar sx={{ height: navHeight }}>
      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{ pt: 5, borderRadius: 2, position: "relative" }}
        >
          <StyledLogo src={Logo} alt="Logo" />
        </Stack>
      </Box>
      <React.Fragment>
        {navConfig.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            <Typography
              variant="overline"
              sx={{
                paddingLeft: 2.5,
                color: "var(--Text-Disabled, #919EAB)",
                fontFamily: "Public Sans, sans-serif",
                fontSize: 11,
                fontStyle: "normal",
                fontWeight: 700,
                left: "15%",
                transform: "translateY(20%)",
              }}
            >
              {section.subheader}
            </Typography>
            {section.items.map((item, itemIndex) => {
              const isActive = pathname === item.path;
              return (
                <Box key={itemIndex} sx={{ paddingLeft: 2.5, marginBottom: 1 }}>
                  <StyledAccount
                    to={item.path}
                    isActive={isActive}
                    sx={{
                      backgroundColor: isActive
                        ? "rgba(0, 165, 170, 0.1)"
                        : "transparent",
                    }}
                  >
                    {item.title === i18n.t("sidebar.projects") &&
                      (isActive ? <ProjectsActiveIcon /> : <ProjectsIcon />)}
                    {item.title === i18n.t("sidebar.subscription") &&
                      (isActive ? (
                        <SubscriptionActiveIcon />
                      ) : (
                        <SubscriptionIcon />
                      ))}
                    <Typography variant="body2">
                      {i18n.t(item.title)}
                    </Typography>
                  </StyledAccount>
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </React.Fragment>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { lg: 0 }, width: { lg: NAV.W_VERTICAL } }}
    >
      {/*<NavToggleButton /> */}
      {isDesktop ? (
        <Stack
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
 );
};

Nav.propTypes = {
  openNav: PropTypes.bool.isRequired,
  onCloseNav: PropTypes.func.isRequired,
};

export default Nav;
