resource "google_secret_manager_secret" "plaintext_secret_resources" {
  for_each  = { for secret in var.plaintext_secret_resources : secret.name => secret }
  secret_id = secret.name
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "main_publickey" {
  for_each = { for secret in var.plaintext_secret_resources : secret.name => secret }
  secret   = google_secret_manager_secret.main_publickey[secret.name].id

  secret_data = secret.value
}


resource "google_secret_manager_secret" "base64_encoded_secrets" {
  for_each  = toset(base64_encoded_secrets)
  secret_id = each.key
  labels = {
    encoded = "base64"
  }
  replication {
    automatic = true
  }
}
