variable "identity_pool_id" {
  description = "The ID of the workload identity pool. Required"
  type        = string
}

variable "identity_pool_display_name" {
  description = "THe display name of the identity pool. Required"
  type        = string
}

variable "identity_pool_description" {
  description = "Description of the identity pool. Optional"
  type        = string
  default     = ""
}

variable "identity_provider_attribute_mapping" {
  description = "A map of strings containing attribute maps for the identity provider. Required"
  type        = map(any)
}

variable "aws_account_ids" {
  description = "List of AWS account IDs to share the workload provider identity account out to. Is not compatible with oidc block Optional."
  type        = list(string)
  default     = null
}

variable "oidc_allowed_audiences" {
  description = "List of OIDC allowed audiences if using oidc. Only works if oidc_issuer_uri is set"
  type        = list(string)
  default     = null
}

variable "oidc_issuer_uri" {
  description = "The OIDC issuer URI. This is not compatible with AWS"
  type        = string
  default     = null
}
