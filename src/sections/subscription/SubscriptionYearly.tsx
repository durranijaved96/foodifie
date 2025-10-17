/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Box,
  Divider,
  Button,
  Snackbar,
  StackProps,
  SnackbarContent,
  DialogActions,
  DialogContent,
  Dialog,
  styled,
  IconButton,
  DialogTitle,
} from "@mui/material";
import Iconify from "../../components/iconify/Iconify";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import Label from "../../components/label/label";
import { supabase } from "../../supabase";
import { loadStripe } from "@stripe/stripe-js";
import CloseIcon from "@mui/icons-material/Close";
import i18n from "../../i18n";
import { t } from "i18next";

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

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  color: "#000",
}));

interface PlanCardYearlyProps extends StackProps {
  plan: {
    license: string;
    commons: string[];
    options: string[];
    price: number;
    priceId?: string;
  };
  disabled?: boolean;
  subscriptionStatus?: {
    planName: string | null;
    daysLeft: number | null;
  }; // Add disabled propsas
  userPlanInfo: {
    planName: string | null;
    daysLeft: number | null;
  };
}

const stripePromise = loadStripe(
  "pk_test_51PQ5ga07SwzennMJdPH7xdtU6uskaj4hxS2UMe2TPaO7CSUm9Dsbfw7xcr4q9S9BmfGC9aEnPVzSaYBSagCgAnxa00gPmP8gTd"
);
const PlanCardYearly: React.FC<PlanCardYearlyProps> = ({
  plan,
  sx,
  userPlanInfo,
  disabled = false, // Default value for disabled prop
  ...other
}: PlanCardYearlyProps) => {
  const { license, commons, options, price, priceId } = plan;
  const essential = license === "Essential";
  const enterprise = license === "Enterprise";
  const freeTrial = license === "Free trial";
  const isTrialActivated = license === "Free Trial";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isCurrentPlan = userPlanInfo.planName === license;

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const isMostPopular = license === "Essential";
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<{
    planName: string | null;
    isSubscribed: boolean;
  }>({
    planName: null,
    isSubscribed: false,
  });
  const [isCancelled, setIsCancelled] = useState(false);
  
  const [isActive, setIsActive] = useState<boolean>(false);
  // Fetch user plan information when the component mounts and update currentPlan state
  useEffect(() => {
    const fetchUserPlanInfo = async () => {
      try {
        if (!supabase) {
          console.error("Supabase client is not available.");
          return;
        }
        // Fetch user session
        const { data: authResponse } = await supabase.auth.getUser();
        const authUser = authResponse?.user;

        if (authUser) {
          const authId = authUser.id;

          // Fetch user ID based on auth ID
          const { data: userIdResponse } = await supabase
            .from("User")
            .select("user_id")
            .eq("auth_id", authId)
            .single();

          const userId = userIdResponse?.user_id;

          if (userId) {
            // Fetch user plan information
            const { data: tenantPlan } = await supabase
              .from("TenantPlan")
              .select("plan_name")
              .eq("user_id", userId)
              .single();

            if (tenantPlan) {
              // Update currentPlan state
              setCurrentPlan({
                planName: tenantPlan.plan_name,
                isSubscribed: tenantPlan.plan_name !== "Free trial",
              });
              setIsCancelled(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user plan information:", error);
      }
    };

    fetchUserPlanInfo();
  }, []);

  const getButtonDisabled = () => {
    if (freeTrial) {
      return true; // Disable button for free trial
    }
    return false;
  };
  const getLabel = () => {
    // Check if the plan being rendered matches the user's current plan
    if (subscriptionStatus.planName === plan.license) {
      return (
        <Label
          color="info"
          startIcon={<Iconify icon="eva:star-fill" />}
          sx={{ position: "absolute", top: 15, right: 26 }}
        >
          Current
        </Label>
      );
    }
    // Return null if the current plan does not match the plan being rendered
    return null;
  };
  // State for managing snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isCancellationDisabled, setIsCancellationDisabled] = useState(false);
  const [buttonText, setButtonText] = useState(getButtonText());

  // Use `useEffect` to fetch the user's current plan and update `currentPlan` state
  useEffect(() => {
    const fetchUserPlanInfo = async () => {
      // Implementation for fetching user plan information and updating state
    };
    fetchUserPlanInfo();
  }, []);
  const expirationDate = new Date();
  const now = () => new Date().toISOString();
  const [userId, setUserId] = useState(null);

  const getUserIdFromAuthId = async (authId: string) => {
    if (!supabase) {
      console.error("Supabase client is not available.");
      return null;
    }
    try {
      const { data, error } = await supabase
        .from("User")
        .select("user_id")
        .eq("auth_id", authId)
        .single();
      if (error) {
        console.error("Error fetching user ID:", error.message);
        return null;
      }
      return data?.user_id || null;
    } catch (error: any) {
      console.error("Error fetching user ID:", error.message);
      return null;
    }
  };

  // Fetch current user ID from Supabase when the component mounts

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase client is not available.");
        }
        const { data: authResponse } = await supabase.auth.getUser();
        if (!authResponse) {
          console.error("Auth response is null or undefined.");
          return;
        }

        const authUser = authResponse.user;
        if (!authUser) {
          console.error("No authenticated user found.");
          return;
        }

        //console.log("Auth ID:", authUser.id);

        const fetchedUserId = await getUserIdFromAuthId(authUser.id);
        if (fetchedUserId) {
          setUserId(fetchedUserId);
        } else {
          console.error("Failed to fetch user ID for the given auth ID.");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);
  const getTenantId = async (userId: string) => {
    try {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }

      // Fetch tenant ID from the backend
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
  const getPlanName = async (planId: string) => {
    try {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }

      // Fetch plan name from the backend
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
  const getUserPlanInfo = async (tenantId: string) => {
    try {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }

      // Fetch plan information using tenant ID
      const { data } = await supabase
        .from("TenantPlan")
        .select("plan_id, end_date")
        .eq("tenant_id", tenantId)
        .single();

      if (!data || !data.plan_id) {
        console.error("Plan details not found.");
        return { planName: null, daysLeft: null };
      }

      // Fetch plan name using plan ID
      const planName = await getPlanName(data.plan_id);

      // if end date is not null, calculate days left, else return null

      // Calculate days left until plan expiry
      const daysLeft = calculateDaysLeft(data.end_date);

      return { planName, daysLeft };
    } catch (error: any) {
      console.error("Error fetching user's plan info:", error.message);
      return { planName: null, daysLeft: null };
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    planName: string | null;
    daysLeft: number | null;
  }>({ planName: null, daysLeft: null });
  const [isTrialExpiredDialogOpen, setIsTrialExpiredDialogOpen] =
    useState(false);

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
          const { data: userIdResponse } = await supabase
            .from("User")
            .select("user_id")
            .eq("auth_id", authId)
            .single();
  
          const userId = userIdResponse?.user_id;
  
          if (!userId) {
            console.error("Failed to fetch user ID.");
            return;
          }
  
          const { data: tenantData } = await supabase
            .from("TenantUser")
            .select("tenant_id")
            .eq("user", userId)
            .single();
  
          const tenantId = tenantData?.tenant_id;
  
          if (!tenantId) {
            console.error("Failed to fetch tenant ID.");
            return;
          }
  
          const { data: planData } = await supabase
            .from("TenantPlan")
            .select("plan_id, end_date")
            .eq("tenant_id", tenantId)
            .single();
  
          if (!planData || !planData.plan_id) {
            console.error("Plan details not found.");
            return;
          }
  
          const { data: planNameData } = await supabase
            .from("Plan")
            .select("name")
            .eq("id", planData.plan_id)
            .single();
  
          const planName = planNameData?.name || null;
          const daysLeft = planData.end_date
            ? calculateDaysLeft(planData.end_date)
            : null;
  
          setSubscriptionStatus({ planName, daysLeft });
  
          if (planName === "Essential" && planData.end_date === null) {
            setIsCancelled(false);
            setIsActive(true);
            setButtonText("Cancel Subscription");
          } else if (planName === "Essential" && daysLeft !== null) {
            setIsCancelled(true);
            setIsActive(daysLeft > 0);
            setButtonText(daysLeft > 0 ? "Resubscribe" : "Resubscribe");
          }
        } catch (error: any) {
          console.error("Error fetching subscription status:", error.message);
        }
      };
  
      fetchSubscriptionStatus();
      const intervalId = setInterval(fetchSubscriptionStatus, 5 * 60 * 1000);
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);


    useEffect(() => {
      const isSuccess = window.location.pathname === "/success";
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");
    
      if (!isSuccess || !sessionId) return;
    
      // (Optional) confirm with the backend; if you prefer, you can skip this
      fetch("http://localhost:3001/api/confirm-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then(() => {
          // 💡 Update just the UI — no tenant, no DB
          setSnackbarMessage("Payment successful! Welcome to Essential 🎉");
          setSnackbarOpen(true);
    
          // Mark as "upgraded" locally so the button changes
          setIsCancelled(false); // you're now active, not cancelled
          setSubscriptionStatus({ planName: "Essential", daysLeft: null });
          // If you want to freeze the button label:
          // setButtonText("Cancel Subscription");
        })
        .catch(() => {
          // Even if confirm fails, you can still set local UI if you want:
          setSnackbarMessage("Payment successful!");
          setSnackbarOpen(true);
          setIsCancelled(false);
          setSubscriptionStatus({ planName: "Essential", daysLeft: null });
        });
    }, []);
    
     // Minimal Checkout (no tenant, no webhooks)
     // inside PlanCard
    const handleCheckout = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Failed to load Stripe");
        if (!priceId) throw new Error("No priceId configured for this plan");
    
        //  get Supabase auth user id
        const { data: sessionRes, error: sessionErr } = await supabase!.auth.getSession();
        if (sessionErr || !sessionRes?.session?.user?.id) {
          throw new Error("User session not available");
        }
        const userId = sessionRes.session.user.id; 
    
        // send both priceId and userId (your server requires both)
        const res = await fetch("http://localhost:3001/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, userId }),
        });
    
        const raw = await res.text();
        let data: any = null;
        try { data = JSON.parse(raw); } catch {}
        if (!res.ok) {
          const msg = data?.error || raw?.slice(0, 200) || `HTTP ${res.status}`;
          throw new Error(`Backend error (${res.status}): ${msg}`);
        }
    
        const sessionId = data?.sessionId;
        if (!sessionId) throw new Error(`No sessionId returned. Response: ${raw.slice(0,200)}`);
    
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw error;
    
      } catch (err: any) {
        console.error("Checkout error:", err);
        setSnackbarMessage(`Payment error: ${err.message}`);
        setSnackbarOpen(true);
      }
    };

  // Modify the handleCancelSubscription function
  const handleCancelSubscription = async (authId: string) => {
    try {
      if (!supabase) {
        console.error("Supabase client is not available.");
        return;
      }

      // Get user information
      const { data: authResponse, error: authError } =
        await supabase.auth.getUser();
      if (authError) {
        console.error("Error fetching user session:", authError.message);
        return;
      }

      const authUserID = authResponse.user.id;

      // Get user ID from auth ID
      const { data: userIdData, error: userIdError } = await supabase
        .from("User")
        .select("user_id")
        .eq("auth_id", authUserID)
        .single();

      if (userIdError) {
        console.error("Error fetching user ID:", userIdError.message);
        return;
      }

      const userId = userIdData?.user_id;

      if (!userId) {
        console.error("User ID not found");
        return;
      }

      // Get tenant ID from user ID
      const { data: tenantData, error: tenantError } = await supabase
        .from("TenantUser")
        .select("tenant_id")
        .eq("user", userId)
        .single();

      if (tenantError) {
        console.error("Error fetching tenant ID:", tenantError.message);
        return;
      }

      const tenantId = tenantData?.tenant_id;

      if (!tenantId) {
        console.error("Tenant ID not found");
        return;
      }

      // Get subscription ID from tenant ID
      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("TenantPlan")
          .select("stripe_subscription_id")
          .eq("tenant_id", tenantId)
          .single();

      if (subscriptionError) {
        console.error(
          "Error fetching subscription ID:",
          subscriptionError.message
        );
        return;
      }

      const subscriptionID = subscriptionData?.stripe_subscription_id;

      if (!subscriptionID) {
        console.error("Subscription ID not found");
        return;
      }
      //setIsDialogOpen(true);
      // Cancel subscription
      const stripe = require("stripe")(
        "pk_test_51PQ5ga07SwzennMJdPH7xdtU6uskaj4hxS2UMe2TPaO7CSUm9Dsbfw7xcr4q9S9BmfGC9aEnPVzSaYBSagCgAnxa00gPmP8gTd"
      );

      await stripe.subscriptions.cancel(subscriptionID);

      setButtonText("Upgrade now!");

      //setIsDialogOpen(true);
      // If there were no errors so far, set successful cancellation snackbar message
      setSnackbarMessage(t("subscription.snackbar-success"));;

      setSnackbarOpen(true); // Close the dialog after successful cancellation
      setIsCancellationDisabled(true);
      // 1000 milliseconds (1 second) delay
      // 3000 milliseconds (3 seconds) delay

      // Disable the cancellation button
    } catch (error: any) {
      console.error("Error cancelling subscription:", error.message);

      // Set error snackbar message
      setSnackbarMessage("Subscription is already cancelled");
      setSnackbarOpen(true);
    }
  };
  const handleCancelSubscriptionWrapper = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // Prevent default behavior of the button
    event.preventDefault();
    setIsDialogOpen(true);
    setTimeout(() => {
      handleCloseDialog(); // Close the dialog
    }, 3000);
    setIsCancellationDisabled(true);
    // Retrieve the authId or other necessary data from the event, if needed
    const authId = "some-auth-id"; // Replace with the actual authId retrieval logic

    // Call handleCancelSubscription with the retrieved authId
    await handleCancelSubscription(authId);
  };
  // Define button text based on license type
  function getButtonText() {
    if (disabled) return "Trial activated"; // If disabled, show "Trial activated"
    if (freeTrial) return "Trial activated";
    if (essential) return "Upgrade now!";
    if (enterprise) return "Contact sales";
    return "";
  }
  // Define button color based on license type
  function getButtonColor() {
    if (disabled) return "#E0E0E0"; // Disabled color
    if (freeTrial) return "#212B36"; // Color for free trial button
    if (enterprise) return "var(--Text-Primary, #212B36)"; // Color for contact sales button
    return "#00A5AA"; // Default color for other buttons
  }

  const handleContactSalesClick = () => {
    window.open("https://contact", "_blank");
  };
  // const handleCloseDialog = () => {
  //  setOpenDialog(false);
  // };
  return (
    <Stack
      spacing={5}
      sx={{
        p: 5,
        pt: 10,
        borderRight: "1px solid rgba(145, 158, 171, 0.16)",
        borderLeft: "1px solid rgba(145, 158, 171, 0.16)",
        border: disabled
          ? "2px dotted #E0E0E0"
          : essential
          ? "2px dotted #000"
          : "none",
        ...sx,
        position: "relative",
        boxSizing: "border-box",
      }}
      {...other}
      {...getLabel()}
    >
      {isMostPopular && (
        <Label
          color="info"
          sx={{
            position: "absolute",
            top: 15,
            right: 26,
            backgroundColor: "#32B7BB",
            color: "white",
          }}
        >
          Most Popular
        </Label>
      )}
      {/*{license.toLowerCase() === subscriptionStatus.planName?.toLowerCase() && (
        <Label
          color="info"
          startIcon={<Iconify icon="eva:star-fill" />}
          sx={{
            position: "absolute",
            top: 15,
            right: 26,
          }}
        >
          { i18n.t('subscription.label-current-plan') }
        </Label>
        )} */}

      {/* Status Label */}
      <Box sx={{ position: "absolute", top: 0, right: 0, padding: 1 }}>
        <Typography
          variant="overline"
          sx={{
            color: essential
              ? "var(--primary-main, #637381)"
              : "var(--Text-Secondary, #919EAB)",
            fontFamily: "Public Sans, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: "18px",
            borderRadius: 4,
          }}
        ></Typography>
      </Box>

      <Stack spacing={2} alignItems="center" height={64}>
        <Typography
          variant="overline"
          component="div"
          sx={{
            color: essential
              ? "var(--primary-main, #637381)"
              : "var(--Text-Secondary, #919EAB)",
            fontFamily: "Public Sans, sans-serif",
            fontSize: 12,
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "18px",
          }}
        >
          {i18n.t("subscription.license")}
        </Typography>
        <Box sx={{ position: "relative" }}>
          <Typography
            variant="h4"
            sx={{
              color: essential
                ? "var(--primary-main, #637381)"
                : "var(--Text-Secondary, #919EAB)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: 24,
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "36px",
            }}
          >
            {license}
          </Typography>
          <Box
            sx={{
              left: 0,
              bottom: 4,
              width: 40,
              height: 8,
              position: "absolute",
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                opacity: essential ? 0.48 : enterprise ? 0.8 : 0.2,
                bgcolor: essential
                  ? "var(--primary-main, #00A5AA)"
                  : enterprise
                  ? "var(--primary-dark, #008B8F)"
                  : "var(--primary-dark, #008B8F)", // Updated for Enterprise
              },
            }}
          />
        </Box>
      </Stack>

      <Stack direction="row" spacing={2}>
        {license === "Enterprise" ? (
          <Typography
            variant="h4"
            sx={{
              color: "#000",
              fontFamily: "Public Sans, sans-serif",
              fontSize: 24,
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "36px",
            }}
          >
            €{price}
          </Typography>
        ) : (
          <Typography
            variant="h4"
            sx={{
              color: "var(--Text-Primary, #212B36)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: 24,
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "36px",
            }}
          >
            €{price}
          </Typography>
        )}
      </Stack>

      <Stack spacing={2.5}>
        {commons.map((option) => (
          <Stack key={option} spacing={1} direction="row" alignItems="center">
            <Iconify icon="eva:checkmark-fill" width={16} />
            <Typography
              variant="body2"
              sx={{
                color: "var(--Text-Primary, #212B36)",
                fontFamily: "Public Sans, sans-serif",
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "22px",
              }}
            >
              {option}
            </Typography>
          </Stack>
        ))}

        <Divider sx={{ borderStyle: "dashed" }} />

        {options.map((option, optionIndex) => (
          <Stack spacing={1} direction="row" alignItems="center" key={option}>
            <Iconify icon="eva:checkmark-fill" width={16} />
            <Typography
              variant="body2"
              sx={{
                color: "var(--Text-Primary, #212B36)",
                fontFamily: "Public Sans, sans-serif",
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "22px",
              }}
            >
              {option}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Stack alignItems="flex-end" height={64}>
        {/* Free Trial Card */}

        {
          // Free Trial Card
          license === "Free trial" && (
            <LoadingButton
              disabled // Always disable the button on the Free Trial card
              size="large"
              type="submit"
              variant="outlined"
              sx={{position: "relative", bottom: -20, right: 0,}}
              style={{
                borderRadius: 8,
                width: "100%",
                textTransform: "none",
                boxShadow: "none",
                borderColor:
                  subscriptionStatus.planName === "Enterprise"
                    ? "#E0E0E0"
                    : "#E0E0E0",
                color:
                  subscriptionStatus.planName === "Essential"
                    ? "#E0E0E0"
                    : "#E0E0E0",
              }}
              onClick={handleCheckout}
            >
              {subscriptionStatus.planName === "Enterprise"
                ? t("subscription.btn-trial-expired")
                : subscriptionStatus.planName === "Essential"
                ? t("subscription.btn-trial-expired")
                : t("subscription.btn-trial-active")}
            </LoadingButton>
          )
        }
        {/* Cancellation confirmation dialog */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <IconButton
            onClick={handleCloseDialog}
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
              {i18n.t("subscription.btn-cancel-dialog")}
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
              {i18n.t("subscription.cancellation-dialog-text")}{" "}
              <span
                style={{
                  color: "var(--secondary-dark, #4F536E)",
                  fontFamily: "Public Sans, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  fontStyle: "normal",
                }}
              >
                {i18n.t("subscription.cancellation-dialog-subtext")}
              </span>
            </Typography>
            <br />

            {/* Dialog actions container */}
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-between", // This ensures the buttons are spaced apart
                paddingBottom: "16px", // Optional: Adjust this value for spacing between buttons and bottom of dialog
                paddingRight: "16px", // Optional: Adjust this value for right margin of the buttons
                paddingLeft: "16px", // Optional: Adjust this value for left margin of the buttons
              }}
            >
              {/* Button to cancel the dialog */}
              <Button
                onClick={handleCloseDialog}
                size="small"
                type="submit"
                variant="outlined"
                sx={{
                  fontFamily: "Public Sans, sans-serif",
                  fontSize: "15px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  borderRadius: 2,
                  borderColor: "black", // Black border color
                  color: "black", // Black text color
                  textTransform: "none",
                  width: "auto",
                  padding: "8px 16px", // Adjust padding as needed
                  "&:hover": {
                    backgroundColor: "transparent",
                    borderColor: "black",
                    color: "black", // Keep the text color black on hover
                  },
                  boxShadow: "none",
                }}
              >
                {i18n.t("subscription.btn-cancel-back")}
              </Button>

              {/* Button to confirm cancellation */}
              <Button
                onClick={handleCancelSubscriptionWrapper}
                size="small"
                type="submit"
                variant="contained"
                sx={{
                  fontFamily: "Public Sans, sans-serif",
                  fontSize: "15px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  borderRadius: 2,
                  backgroundColor: "#00A5AA",
                  color: "white",
                  textTransform: "none",
                  width: "auto",
                  padding: "8px 16px", // Adjust padding as needed
                  "&:hover": {
                    backgroundColor: "#32B7BB",
                    color: "white",
                  },
                  boxShadow: "none",
                }}
              >
                {i18n.t("subscription.btn-cancel")}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>

        {/* LoadingButton for Essential */}
        {license === "Essential" && (
          <LoadingButton
            disabled={
              subscriptionStatus.planName === "Enterprise" ||
              (isCancelled && subscriptionStatus.daysLeft !== 0)
            }
            size="large"
            type="submit"
            variant="outlined"
            style={{
              borderRadius: 8,
              borderColor:
                subscriptionStatus.planName === "Enterprise"
                  ? "#E0E0E0"
                  : isCancelled
                  ? "#00A5AA"
                  : subscriptionStatus.planName === "Essential"
                  ? "#919EAB3D"
                  : "#00A5AA",
              color:
                subscriptionStatus.planName === "Enterprise"
                  ? "#919EAB"
                  : isCancelled
                  ? "#00A5AA"
                  : subscriptionStatus.planName === "Essential"
                  ? "#212B36"
                  : "white",
              backgroundColor:
                subscriptionStatus.planName === "Enterprise"
                  ? "transparent"
                  : isCancelled
                  ? "transparent"
                  : subscriptionStatus.planName === "Essential"
                  ? "transparent"
                  : "#00A5AA",
              width: "100%",
              textTransform: "none",
              boxShadow: "none",
            }}
            onClick={
              isCancelled
                ? handleCheckout
                : subscriptionStatus.planName === "Essential"
                ? handleOpenDialog
                : handleCheckout
            }
            sx={{
              "&:hover": {
                backgroundColor: "#32B7BB !important",
              },
              "&:active, &:focus": {
                backgroundColor: "#008B8F !important",
              },
              position: "relative",
              bottom: -20,
              right: 0,
            }}
          >
            {isCancelled
              ? t("subscription.btn-renew-subscription")
              : subscriptionStatus.planName === "Enterprise"
              ? t("subscription.btn-not-available")
              : subscriptionStatus.planName === "Essential"
              ? t("subscription.btn-cancel-subscription")
              : t("subscription.btn-upgrade")}
          </LoadingButton>
        )}

        {license === "Enterprise" && (
          <LoadingButton
            size="large"
            variant="outlined"
            style={{
              borderRadius: 8,
              borderColor: "#212B36",
              backgroundColor: "transparent",
              color: "#212B36",
              width: "100%",
              textTransform: "none",
              boxShadow: "none",
            }}
            sx={{
              "&:hover": {
                backgroundColor: "#32B7BB !important", // Hover state color
              },
              "&:active, &:focus": {
                backgroundColor: "#008B8F !important", // Pressed state color
              },
              position: "relative", bottom: 18, right: 0, 
            }}
            onClick={handleContactSalesClick}
          >
            {i18n.t("subscription.btn-enterprise-subscription")}
          </LoadingButton>
        )}
      </Stack>

      {/* Snackbar component for showing messages */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          style={{
            borderRadius: "8px",
            background: "var(--primary-light, #32B7BB)",
            boxShadow: "0px 8px 16px 0px rgba(145, 158, 171, 0.16)",
            display: "flex",
            width: "420px",
            padding: "4px 0px 4px 4px",
            alignItems: "center",
            gap: "12px",
          }}
          message={
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              {/* Add the success icon on the left */}
              <div style={{ marginRight: "8px" }}>
                <CloseIcon />
              </div>
              {/* Add the cancellation message */}
              <div style={{ flexGrow: 1 }}>{snackbarMessage}</div>
              {/* Add the close icon on the right */}
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSnackbarOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </div>
          }
        />
      </Snackbar>
    </Stack>
  );
};

export default PlanCardYearly;
