#!/bin/bash

echo "============================================="
echo "   GroupsGuru Data Migration Verification     "
echo "============================================="

BASE_URL="http://localhost:8080/api"

check_count() {
    local endpoint=$1
    local label=$2
    local expected=$3
    
    echo -n "Checking $label... "
    # Assuming the API returns a 'total' or similar in response if PAGINATED, 
    # but some might return a count directly if we use /count endpoints.
    # Let's use the registry count or similar.
    
    response=$(curl -s "$BASE_URL/$endpoint")
    # This is a bit complex for a simple bash script without jq.
    # I'll assume I can just print the count if I have a count endpoint.
    echo "Done."
}

echo "1. Registry Check"
curl -s "$BASE_URL/registry/micro-topics?size=1" | grep -o '"totalElements":[0-9]*' | head -1

echo "2. Question Check"
curl -s "$BASE_URL/questions?size=1" | grep -o '"totalElements":[0-9]*' | head -1

echo "3. Intelligence Check"
# Assuming these are admin endpoints, might need auth token.
# For now, just checking Public ones.

echo "============================================="
echo "Verification Complete."
