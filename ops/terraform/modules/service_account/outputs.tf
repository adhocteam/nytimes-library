output "gha_service_account_email" {
  description = "GHA service account email, if enabled"
  value       = var.create_gha ? google_service_account.gha[0].email : ""
}
