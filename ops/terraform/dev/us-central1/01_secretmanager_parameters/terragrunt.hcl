# Terraform module to create the IAM service account used by the content library app
terraform {
  source = "${get_parent_terragrunt_dir()}//modules//secret_manager"
}

include {
  path = find_in_parent_folders()
}

# Set a dependency for the GCP APIs being enabled, which will prevent this module from running too early
dependency "library_service_api" {
  config_path  = "../00_library_service_api"
  skip_outputs = true
}


locals {
  environment     = "dev"
  resource_prefix = "nytimes-library"
  project_id      = read_terragrunt_config(find_in_parent_folders("account.hcl"))
  common_env_vars = tolist(jsondecode(file(find_in_parent_folders("vars.json"))))
  environment_env_vars = tolist([
    {
      name  = "GCP_PROJECT_ID"
      value = local.project_id.locals.project_id
    },
    {
      name  = "REDIRECT_URL"
      value = "https://content-library-${local.environment}.adhoc.pizza/auth/redirect"
    },
    {
      name  = "NODE_ENV"
      value = "development"
    }
  ])
  full_environment_vars = concat(local.common_env_vars, local.environment_env_vars)
}

inputs = {
  project_id                   = local.project_id.locals.project_id
  plaintext_secret_resources   = local.full_environment_vars
}
