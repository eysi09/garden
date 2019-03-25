#!/bin/bash -e

gcloud --quiet components update
echo $GCLOUD_SERVICE_KEY | gcloud auth activate-service-account --key-file=-
gcloud --quiet config set project $GOOGLE_PROJECT_ID && gcloud --quiet config set compute/zone $GOOGLE_COMPUTE_ZONE
gcloud --quiet container clusters get-credentials $GOOGLE_CLUSTER_ID --zone $GOOGLE_COMPUTE_ZONE
gcloud --quiet auth configure-docker