 // Import supabase from your supabase setup file

import { supabase } from "../../supabase";

export async function fetchSubscriptionStatus() {
    try {
        if (!supabase) {
            console.error("Supabase is not initialized.");
            return;
          }
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error fetching user session:", error.message);
            return { planName: null, daysLeft: null };
        }

        if (!data || !data.session || !data.session.user) {
            console.error("User session not available.");
            return { planName: null, daysLeft: null };
        }

        const authId = data.session.user.id;
        const userId = await getUserIdFromAuthId(authId);
        if (!userId) {
            console.error("Failed to fetch user ID.");
            return { planName: null, daysLeft: null };
        }

        const tenantId = await getTenantId(userId);
        if (!tenantId) {
            console.error("Failed to fetch tenant ID.");
            return { planName: null, daysLeft: null };
        }

        const userPlanInfo = await getUserPlanInfo(tenantId);
        if (!userPlanInfo) {
            console.error("Failed to fetch user's plan information.");
            return { planName: null, daysLeft: null };
        }

        return userPlanInfo;
    } catch (error: any) {
        console.error("Error fetching subscription status:", error.message);
        return { planName: null, daysLeft: null };
    }
}

async function getTenantId(userId: string) {
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
}

async function getUserIdFromAuthId(authId: string) {
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
}

async function getUserPlanInfo(tenantId: string) {
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
}

async function getPlanName(planId: string) {
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
}

function calculateDaysLeft(endDate: string | null) {
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
}
