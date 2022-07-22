#!/usr/bin/env bash

# Helper to make it easier to grab secrets from GCP secret manager

# Get the latest enabled secret version if it wasn't already provided

secret_name="$1"
version="$2"

if [ -z "$version" ]; then
  # shellcheck disable=SC2086
  version="$(gcloud secrets versions list $secret_name --filter=enabled --limit=1 --format=json | jq -r '.[].name' | sed 's/.*\///g')"
fi

# Return the secret

gcloud secrets versions access "$version" --secret="$secret_name"
