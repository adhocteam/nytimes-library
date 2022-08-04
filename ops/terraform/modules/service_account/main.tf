resource "google_service_account" "main" {
  account_id   = var.service_account_id
  display_name = var.service_account_display_name
  description  = var.service_account_description
}


resource "google_service_account" "gha" {
  count        = var.create_gha ? 1 : 0
  account_id   = "${var.service_account_id}-gha"
  display_name = "${var.service_account_display_name}-github-actions"
  description  = "For use with Github actions"
}

resource "google_service_account_key" "main" {
  count              = var.use_secretsmanager ? 1 : 0
  service_account_id = google_service_account.main.name
}

# Bind the IAM role roles/datastore.user to the service account
resource "google_project_iam_binding" "main" {
  project = var.project_id
  role    = "roles/datastore.user"
  members = [
    "serviceAccount:${google_service_account.main.email}"
  ]
}

data "google_app_engine_default_service_account" "default" {
}

# Grant the app engine default account the ability to access secret manager
resource "google_project_iam_binding" "main_secretmanager" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  members = [
    "serviceAccount:${data.google_app_engine_default_service_account.default.email}",
    "serviceAccount:${google_service_account.main.email}"
  ]
}

resource "google_secret_manager_secret" "main_privatekey" {
  count     = var.use_secretsmanager ? 1 : 0
  secret_id = "GOOGLE_APPLICATION_JSON"
  labels = {
    encoded = "base64"
  }
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "main_privatekey" {
  count  = var.use_secretsmanager ? 1 : 0
  secret = google_secret_manager_secret.main_privatekey[0].id

  secret_data = google_service_account_key.main[0].private_key
}

