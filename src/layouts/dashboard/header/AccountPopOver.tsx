/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  Stack,
  //MenuItem,
  Popover,
  Backdrop,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { supabase } from "../../../supabase";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import Loading from "../../../../src/assets/gifs/Loading.gif";
import i18n from "../../../i18n";

const BouncyIconBox = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: "#CCCCCC", // Grey background color
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  color: "#FFFFFF", // White text color
  position: "relative", // Add position relative to allow for positioning the popover
}));
const getUserInitials = (user: User | null) => {
  if (!user || !user.email) return "";

  // Extract the email username before the "@" symbol
  const emailParts = user.email.split("@");
  const username = emailParts[0];

  // Split the username into parts and get the initials
  const nameParts = username.split(".");

  // Initialize initials variable
  let initials = "";

  // Loop through the name parts and get the first character of each
  for (const part of nameParts) {
    if (part.length > 0) {
      initials += part[0].toUpperCase();
    }
  }

  return initials;
};

export default function AccountPopover() {
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null); // Ref for the BouncyIconBox
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error(
            "Error fetching user profile:",
            (error as Error).message
          );
        } else {
          setUserProfile(data?.user || null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", (error as Error).message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    if (supabase) {
      try {
        setIsLoggingOut(true); // Set loading to true before initiating the logout
        const { error } = await supabase.auth.signOut();

        if (error) {
          console.error("Logout failed:", error.message);
        } else {
          console.log("Logout successful");
          navigate("/");
        }
      } finally {
        setIsLoggingOut(false); // Set loading to false regardless of success or failure
        handleClose();
      }
    }
  };

  return (
    <>
      <BouncyIconBox onClick={handleOpen} ref={anchorRef}>
        {/* Check if user profile data is available */}
        {userProfile && (
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              fontFamily: "Public Sans, sans-serif", // Set the font family as needed
              fontWeight: "bold", // Set the font weight to bold
            }}
          >
            {getUserInitials(userProfile)}
          </Typography>
        )}
      </BouncyIconBox>

      {open && (
        <Backdrop
          open={true}
          onClick={handleClose}
          style={{ zIndex: 9999, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <Popover
            open={open}
            anchorEl={anchorRef.current}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                minWidth: 180,
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",

                zIndex: 10000,
                pt: 2,
                position: "absolute", // Set position to absolute to position the popover
                top: anchorRef.current
                  ? anchorRef.current.getBoundingClientRect().bottom
                  : 0, // Position the popover below the BouncyIconBox
                left: anchorRef.current
                  ? anchorRef.current.getBoundingClientRect().left
                  : 0, // Position the popover aligned with the left of the BouncyIconBox
              },
            }}
          >
            <Stack sx={{ p: 1 }}>
              {userProfile && (
                <Box sx={{ my: 0, px: 1.7 }}>
                  <Typography variant="subtitle1" noWrap>
                    {userProfile.email}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ borderColor: "#fff", borderWidth: 1 }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "#000000DE",
                  fontWeight: "fontWeightBold",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Public Sans, sans-serif",
                  fontStyle: "normal",
                  fontSize: "14px",
                }}
              >
                {isLoggingOut ? (
                  <img
                    src={Loading}
                    alt="Loading..."
                    style={{ width: 24, height: 24, marginRight: 10 }}
                  />
                ) : null}
                {isLoggingOut ? 'Logging Out...' : 'Logout'}
              </MenuItem>
            </Stack>
          </Popover>
        </Backdrop>
      )}
    </>
  );
}
