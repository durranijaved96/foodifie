/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Stack,
  Typography,
  Button,
  DialogContent,
  Dialog,
  styled,
} from "@mui/material";
import Iconify from "../../../components/iconify/Iconify";
import AccountPopover from "./AccountPopOver";
import LanguagePopover from "./Language";
import { HelpOutline } from "@mui/icons-material";
import i18n from "../../../i18n";
import { supabase } from "../../../supabase";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { t, use } from "i18next";

const StyledRoot = AppBar;
const StyledToolbar = Toolbar;

interface HeaderProps {
  onOpenNav?: () => void;
}

const StyledImageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

const StyledAvatar = styled("div")(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
}));
const Header: React.FC<HeaderProps> = ({ onOpenNav }) => {
  const navigate = useNavigate();

  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    planName: string | null;
    daysLeft: number | null;
    status: string | null;
  }>({ planName: null, daysLeft: null, status: null });

  const [isTrialExpiredDialogOpen, setIsTrialExpiredDialogOpen] =
    useState(false);
  const [
    isEssentialPlanExpiredDialogOpen,
    setIsEssentialPlanExpiredDialogOpen,
  ] = useState(false);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        if (!supabase) {
          console.error("Supabase is not initialized.");
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching user session:", error.message);
          return;
        }

        if (!data || !data.session || !data.session.user) {
          console.error("User session not available.");
          return;
        }

        const authId = data.session.user.id;
        const userId = await getUserIdFromAuthId(authId);
        if (!userId) {
          console.error("Failed to fetch user ID.");
          return;
        }

        const tenantId = await getTenantId(userId);
        if (!tenantId) {
          console.error("Failed to fetch tenant ID.");
          return;
        }

        const userPlanInfo = await getUserPlanInfo(tenantId);
        if (!userPlanInfo) {
          console.error("Failed to fetch user's plan information.");
          return;
        }

        setSubscriptionStatus(userPlanInfo);

        if (
          (userPlanInfo.planName === "Free Trial" ||
            userPlanInfo.planName === "Essential" ||
            userPlanInfo.planName === "Enterprise") &&
          userPlanInfo.daysLeft === 0
        ) {
          if (userPlanInfo.planName === "Free Trial") {
            setIsTrialExpiredDialogOpen(true);
          } else {
            setIsEssentialPlanExpiredDialogOpen(true);
          }
        }
      } catch (error: any) {
        console.error("Error fetching subscription status:", error.message);
      }
    };

    fetchSubscriptionStatus();
    const intervalId = setInterval(fetchSubscriptionStatus, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getTenantId = async (userId: string) => {
    try {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }

      const { data } = await supabase
        .from("TenantUser")
        .select("tenant_id")
        .eq("user", userId)
        .single();

      return data?.tenant_id || null;
    } catch (error: any) {
      console.error("Error fetching tenant ID:", error.message);
      return null;
    }
  };

  const getUserIdFromAuthId = async (authId: string) => {
    try {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }

      const { data } = await supabase
        .from("User")
        .select("user_id")
        .eq("auth_id", authId)
        .single();

      return data?.user_id || null;
    } catch (error: any) {
      console.error("Error fetching user ID:", error.message);
      return null;
    }
  };

  const getUserPlanInfo = async (tenantId: string) => {
    try {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }

      const { data } = await supabase
        .from("TenantPlan")
        .select("plan_id, end_date, updated_at")
        .eq("tenant_id", tenantId)
        .single();

      if (!data || !data.plan_id) {
        console.error("Plan details not found.");
        return { planName: null, daysLeft: null, status: null };
      }

      const planName = await getPlanName(data.plan_id);
      const daysLeft = calculateDaysLeft(data.end_date);
      const status = data.updated_at;

      return { planName, daysLeft, status };
    } catch (error: any) {
      console.error("Error fetching user's plan info:", error.message);
      return { planName: null, daysLeft: null, status: null };
    }
  };

  const getPlanName = async (planId: string) => {
    try {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }

      const { data } = await supabase
        .from("Plan")
        .select("name")
        .eq("id", planId)
        .single();

      return data?.name || null;
    } catch (error: any) {
      console.error("Error fetching plan name:", error.message);
      return null;
    }
  };

  const calculateDaysLeft = (endDate: string | null) => {
    try {
      if (!endDate) return null;

      const endDateTime = new Date(endDate);
      const currentDateTimeUtc = new Date();
      const difference = endDateTime.getTime() - currentDateTimeUtc.getTime();
      const differenceInDays = Math.ceil(difference / (1000 * 3600 * 24));

      return differenceInDays >= 0 ? differenceInDays : 0;
    } catch (error: any) {
      console.error("Error calculating days left:", error.message);
      return null;
    }
  };

  const handleHelpClick = () => {
    window.open("https://de/faq/", "_blank");
  };
  const handleCloseTrialExpiredDialog = () => {
    setIsTrialExpiredDialogOpen(false);
    setIsEssentialPlanExpiredDialogOpen(false);
  };
  const handleUpgradeClick = () => {
    navigate("/dashboard/subscription");
    setIsTrialExpiredDialogOpen(false); // Automatically close the dialog
  };

  return (
    <>
      <StyledRoot
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          boxShadow: "none",
          backgroundColor: "transparent",
          zIndex: 999,
        }}
      >
        <StyledToolbar>
          

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" alignItems="center" spacing={1}>
            <LanguagePopover />
            <IconButton onClick={handleHelpClick} sx={{ color: "#637381" }}>
              <HelpOutline />
            </IconButton>
            <AccountPopover />
          </Stack>

          <IconButton
            onClick={onOpenNav}
            sx={{ color: "#637381", display: { lg: "none" } }}
          >
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
        </StyledToolbar>
      </StyledRoot>

      <Dialog
        open={isTrialExpiredDialogOpen}
        onClose={handleCloseTrialExpiredDialog}
      >
        <IconButton
          onClick={handleCloseTrialExpiredDialog}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#000", // Set the color of the icon
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent
          sx={{
            alignItems: "center",
            gap: "24px",
            padding: "32px 64px",
            borderRadius: "4px",
            border: "1px #E0E0E0",
            background: "var(--primary-contrast, #FFF)",
          }}
        >
          {/* SVG placed on top left */}
          <StyledImageContainer>
            <StyledAvatar>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                style={{ width: "40px", height: "40px", flexShrink: 0 }}
              >
                <path
                  d="M20.0002 3.33337C10.8002 3.33337 3.3335 10.8 3.3335 20C3.3335 29.2 10.8002 36.6667 20.0002 36.6667C29.2002 36.6667 36.6668 29.2 36.6668 20C36.6668 10.8 29.2002 3.33337 20.0002 3.33337ZM21.6668 28.3334H18.3335V25H21.6668V28.3334ZM21.6668 21.6667H18.3335V11.6667H21.6668V21.6667Z"
                  fill="#4F536E"
                />
              </svg>
            </StyledAvatar>
          </StyledImageContainer>

          <Typography
            variant="h4"
            sx={{
              color: "var(--Text-Primary, #212B36)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "36px",
              alignSelf: "center",
              fontStyle: "normal",
            }}
          >
            {t("header.header-dialog-trial-expired")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              width: "350px",
              color: "var(--Text-Secondary, #637381)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "22px",
            }}
          >
            <br />
            {t("header.header-dialog-trial-text")}{" "}
            <span
              style={{
                color: "var(--secondary-dark, #4F536E)",
                fontFamily: "Public Sans sans-serif",
                fontSize: 14,
                fontWeight: 700,
                fontStyle: "normal",
              }}
            >
              {t("header.discount-label")}
            </span>
          </Typography>
          <br />

          <LoadingButton
            //disabled={disabled} // Disable button if card is disabled
            size="medium" // Adjust button size to medium
            type="submit"
            variant="contained"
            onClick={() => handleUpgradeClick()} // Corrected onClick handler
            style={{
              fontFamily: "Public Sans, sans-serif",
              fontSize: "15px",
              fontStyle: "normal",
              fontWeight: 700,
              borderRadius: 8,
              backgroundColor: "#00A5AA",
              color: "white",
              width: "100%",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            {t("header.upgrade-button-label")}
          </LoadingButton>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEssentialPlanExpiredDialogOpen}
        onClose={handleCloseTrialExpiredDialog}
      >
        <IconButton
          onClick={handleCloseTrialExpiredDialog}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#000", // Set the color of the icon
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent
          sx={{
            alignItems: "center",
            gap: "24px",
            padding: "32px 64px",
            borderRadius: "4px",
            border: "1px #E0E0E0",
            background: "var(--primary-contrast, #FFF)",
          }}
        >
          {/* SVG placed on top left */}
          <StyledImageContainer>
            <StyledAvatar>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                style={{ width: "40px", height: "40px", flexShrink: 0 }}
              >
                <path
                  d="M20.0002 3.33337C10.8002 3.33337 3.3335 10.8 3.3335 20C3.3335 29.2 10.8002 36.6667 20.0002 36.6667C29.2002 36.6667 36.6668 29.2 36.6668 20C36.6668 10.8 29.2002 3.33337 20.0002 3.33337ZM21.6668 28.3334H18.3335V25H21.6668V28.3334ZM21.6668 21.6667H18.3335V11.6667H21.6668V21.6667Z"
                  fill="#4F536E"
                />
              </svg>
            </StyledAvatar>
          </StyledImageContainer>

          <Typography
            variant="h4"
            sx={{
              color: "var(--Text-Primary, #212B36)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "36px",
              alignSelf: "center",
              fontStyle: "normal",
            }}
          >
            {t("header.subscription-expired-dialog")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              width: "350px",
              color: "var(--Text-Secondary, #637381)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "22px",
            }}
          >
            <br />
            {t("header.subscription-expired-text")}{" "}
          </Typography>
          <br />

          <LoadingButton
            size="medium" // Adjust button size to medium
            type="submit"
            variant="contained"
            onClick={() => setIsEssentialPlanExpiredDialogOpen(false)} // Corrected onClick handler
            style={{
              fontFamily: "Public Sans, sans-serif",
              fontSize: "15px",
              fontStyle: "normal",
              fontWeight: 700,
              borderRadius: 8,
              backgroundColor: "#00A5AA",
              color: "white",
              width: "100%",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            {t("header.subscription-expired-button")}
          </LoadingButton>
        </DialogContent>
      </Dialog>
    </>
  );
};

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default Header;
