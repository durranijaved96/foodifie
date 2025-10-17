/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { throttle } from "lodash";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Container from "@mui/material/Container";
import Iconify from "../components/iconify/Iconify";
import { useSettingsContext } from "../components/settings/context/settings-context";
import CustomBreadcrumbs from "../components/custom-breadcrumbs/custom-breadcrumbs";
import { Box, Typography } from "@mui/material";
import Stack from "@mui/material/Stack"; // Import Stack component
//import { _homePlans, _homePlansYearly } from "../mock/_others";
import PlanCard from "../sections/subscription/SubscriptionCard";
import { varFade } from "../components/animate/vartiants/fade";
import { m } from "framer-motion";
import PlanCardYearly from "../sections/subscription/SubscriptionYearly";
import { supabase } from "../supabase";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import initHomePlans from "../mock/_subscription";

const TABS = [
  {
    value: "general",
    label: "subscription.tabs-label-monthly",
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
    priceId: "price_1PQ5jP07SwzennMJmoNpav0v",
  },
  {
    value: "billing",
    label: "subscription.tabs-label-yearly",
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
    priceId: "price_1PQ5jP07SwzennMJmoNpav0v",
  },
];

const arrow = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.2147 30.6123C6.71243 22.9891 10.1906 14.9695 17.1738 11.0284C24.2834 7.01748 33.9187 7.08209 41.1519 10.6817C42.6578 11.4331 41.4507 13.5427 39.9511 12.945C33.399 10.3368 25.7611 10.0919 19.3278 13.1729C16.5269 14.4946 14.2131 16.6643 12.7143 19.3746C10.7314 22.9202 11.202 26.5193 11.6878 30.3396C11.8055 31.2586 10.5388 31.3074 10.2147 30.6123Z"
      fill="#00A5AA"
      fillOpacity="0.24"
    />
    <path
      d="M11.8126 39.0341C9.56032 35.9944 6.83856 32.7706 6.01828 28.9795C5.98242 28.8458 5.99937 28.7036 6.0656 28.5821C6.13183 28.4607 6.24226 28.3694 6.374 28.3271C6.50573 28.2849 6.64867 28.295 6.77316 28.3553C6.89765 28.4157 6.99414 28.5216 7.04263 28.6511C8.43444 31.8092 10.4092 34.463 12.553 37.1099C13.8625 35.3195 14.915 33.2716 16.4773 31.7142C16.6164 31.5741 16.8007 31.4879 16.9974 31.471C17.1941 31.4541 17.3905 31.5075 17.5515 31.6218C17.7125 31.736 17.8277 31.9037 17.8767 32.095C17.9257 32.2863 17.9052 32.4887 17.8189 32.6663C16.5996 35.0298 15.0564 37.2116 13.2339 39.1484C13.1391 39.2464 13.0238 39.3222 12.8963 39.3703C12.7688 39.4185 12.6321 39.4378 12.4963 39.4268C12.3604 39.4159 12.2286 39.375 12.1104 39.3071C11.9922 39.2392 11.8905 39.1459 11.8126 39.0341Z"
      fill="#00A5AA"
      fillOpacity="0.24"
    />
  </svg>
);

export default function SubscriptionsPage() {
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("general");
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    planName: string | null;
    daysLeft: number | null;
  }>({ planName: null, daysLeft: null });
  
  const { t } = useTranslation();
  const { _homePlans, _homePlansYearly } = initHomePlans(t);

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const fetchSubscriptionStatus = useCallback(
    throttle(async () => {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching user session:", error.message);
          return;
        }

        const authId = data?.session?.user?.id;
        if (!authId) {
          console.error("User session not available.");
          return;
        }

        const userId = await getUserIdFromAuthId(authId);
        const tenantId = await getTenantId(userId);
        const userPlanInfo = await getUserPlanInfo(tenantId);

        if (userPlanInfo) {
          setSubscriptionStatus(userPlanInfo);
        } else {
          setSubscriptionStatus({ planName: null, daysLeft: null });
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    }, 5000),
    []
  );

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  const getUserIdFromAuthId = async (authId: string) => {
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
  };

  const getTenantId = async (userId: string) => {
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
  };

  const getUserPlanInfo = async (tenantId: string) => {
    try {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        return;
      }

      const { data } = await supabase
        .from("TenantPlan")
        .select("plan_id, end_date")
        .eq("tenant_id", tenantId)
        .single();

      if (!data || !data.plan_id) {
        console.error("Plan details not found.");
        return { planName: null, daysLeft: null };
      }

      const planName = await getPlanName(data.plan_id);
      const daysLeft = calculateDaysLeft(data.end_date);

      return { planName, daysLeft };
    } catch (error: any) {
      console.error("Error fetching user's plan info:", error.message);
      return { planName: null, daysLeft: null };
    }
  };

  const getPlanName = async (planId: string) => {
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
  };

  const calculateDaysLeft = (endDate: string | null) => {
    if (!endDate) return null;

    const endDateTime = new Date(endDate);
    const currentDateTime = new Date();
    const difference = endDateTime.getTime() - currentDateTime.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  };

  if (subscriptionStatus.planName === "Beta") {
    return null;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "var(--Text-Primary, #212B36)",
          fontFamily: "Public Sans, sans-serif",
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "36px",
          mb: { xs: 3, md: 5 },
        }}
      >
        {t("subscription.page-title")}
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
          "& .MuiTab-root": {
            textTransform: "capitalize",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "Public Sans, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
          },
          "& .Mui-selected": {
            color: "var(--Text-Primary, #212B36)",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "var(--Text-Primary, #212B36)",
          },
          "& .Mui-selected.MuiTab-root": {
            color: "var(--Text-Primary, #212B36)",
          },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                {tab.icon}
                <span>{t(tab.label)}</span>
              </Stack>
            }
            value={tab.value}
          />
        ))}

        <Box sx={{ mt: 9, mb: 5, position: "relative" }}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Box
              sx={{
                position: "absoulte",
                top: -40,
                transform: "translateX(-50%)",
              }}
            >
              <Stack
                direction="row"
                sx={{ position: "absolute", left: -50, bottom: 20 }}
              >
                {arrow}
                <Box
                  component="span"
                  sx={{
                    whiteSpace: "nowrap",
                    color: "#00A5AA",
                    fontWeight: 600,
                    fontSize: 12,
                    fontFamily: "Public Sans, sans-serif",
                    bottom: 40,
                  }}
                >
                  {t("subscription.icon-label")}
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Tabs>

      {currentTab === "general" && (
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          sx={{
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {_homePlans.map((plan) => (
            <m.div key={plan.license} variants={varFade().in}>
              <PlanCard
                key={plan.license}
                plan={plan}
                userPlanInfo={{
                  planName: null,
                  daysLeft: null,
                }}
              />
            </m.div>
          ))}
        </Box>
      )}

      {currentTab === "billing" && (
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          sx={{
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {_homePlansYearly.map((plan) => (
            <m.div key={plan.license} variants={varFade().in}>
              <PlanCardYearly
                key={plan.license}
                plan={plan}
                userPlanInfo={{
                  planName: null,
                  daysLeft: null,
                }}
              />
            </m.div>
          ))}
        </Box>
      )}

      <Typography
        sx={{
          mt: 2,
          color: "rgba(0, 0, 0, 0.60)",
          fontFamily: "Public Sans, sans-serif",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "22px",
          textAlign: "center",
        }}
      >
        {currentTab === "general"
          ? t("subscription.text-monthly")
          : t("subscription.text-yearly")}
      </Typography>
    </Container>
  );
}
