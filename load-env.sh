#!/bin/bash
# Load environment variables from .env.local

if [ -f .env.local ]; then
    echo "Loading environment variables from .env.local..."
    export $(grep -v '^#' .env.local | xargs)
    echo "✅ Environment variables loaded successfully!"
    echo "NEXT_PUBLIC_SANITY_PROJECT_ID: $NEXT_PUBLIC_SANITY_PROJECT_ID"
    echo "NEXT_PUBLIC_SANITY_DATASET: $NEXT_PUBLIC_SANITY_DATASET"
    echo "NEXT_PUBLIC_SANITY_API_VERSION: $NEXT_PUBLIC_SANITY_API_VERSION"
else
    echo "❌ .env.local file not found"
    exit 1
fi 