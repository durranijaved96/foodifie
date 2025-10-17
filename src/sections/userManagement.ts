/* eslint-disable @typescript-eslint/no-unused-vars */
import { supabase } from "../supabase";


export const createUserAndTenant = async (authId: string) => {
  try {
    console.log("creating user");
    if (supabase) {
      // Create user
      const { data: userData, error: userError } = await supabase
        .from("User")
        .insert([{ auth_id: authId, language: "EN" }])
        .select();
      const userId = userData?.[0]?.user_id;

      // Create tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from("Tenant")
        .insert([{ name: "empty" }])
        .select();
      const tenantId = tenantData?.[0]?.id;

      // Create user-tenant relation
      const userTenantResponse = await supabase
        .from("TenantUser")
        .insert([{ user: userId, tenant_id: tenantId, role: "admin" }])
        .select();

      // Create tenant plan relation

      // get date and set it 14 days ahead
      const now = new Date();
      const end_date = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      const tenantPlanResponse = await supabase
        .from("TenantPlan")
        .insert([{ tenant_id: tenantId, plan_id: 1, end_date: end_date }])
        .select();


      // Add Template Project
      // Add name and dates
      const { data: projectData, error: projectError } = await supabase
        .from("Project")
        .insert([{ name: "Template Project", user_id: authId, created_at: now, updated_at: now, Template : true }])
        .select();

      const projectId = projectData?.[0]?.id;
      // add input parameters
      // get project id of Template
      const { data: projectTemplateData, error: projectError2 } = await supabase
        .from("Project")
        .select()
        .eq("name", "Template Use Case");

      // get project id of Template
      const projectTemplateId = projectTemplateData?.[0]?.id;

      
      // get parameters of Configuration
      const { data: configurationData, error: configurationError } = await supabase
        .from("Configuration")
        .select()
        .eq("project", projectTemplateId)
        .eq("name", "template");

      //const configurationDataId = configurationData?.[0]?.id;

      // create configuration entry in Configuration table for new project
      const { data: newConfigurationData, error: newConfigurationError} = await supabase
        .from("Configuration")
        .insert([{ project: projectId, name: "current",  configuration_data: configurationData?.[0]?.configuration_data, results_data: configurationData?.[0]?.results_data, created_at: now }])
        .select();

      // get configuration id of new configuration
      const newConfigurationId = newConfigurationData?.[0]?.id;

      // get parameters of Template
      const { data: parameterData, error: parameterError } = await supabase
        .from("InputParameters")
        .select()
        .eq("configuration", configurationData?.[0]?.id);
  

      
      // create parameters entry in InputParameters table for new project
      const newInputParameters = await supabase
        .from("InputParameters")
        .insert([{ project: projectId, parameters: parameterData?.[0]?.parameters, last_update: now, configuration: newConfigurationId }])



    } else {
      console.error("Supabase is not initialized.");
    }
  } catch (error: any) {
    console.error("Error creating user, tenant or plan:", error.message);
  }
};
