#!/bin/bash

# Stop and remove existing DynamoDB Local Docker container if it exists
docker stop dynamodb-local || true && docker rm dynamodb-local || true

# Start new DynamoDB Local Docker container
docker run -d -p 8000:8000 --name dynamodb-local amazon/dynamodb-local

# Wait for DynamoDB Local to be ready
until aws dynamodb list-tables --endpoint-url http://localhost:8000 2>/dev/null; do
    sleep 1
done

# Create UserTable in DynamoDB Local
# DynamoDB table definition
table_definition='{
  "TableName": "UserTable",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" },
    { "AttributeName": "email", "AttributeType": "S" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "BillingMode": "PAY_PER_REQUEST",
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "EmailIndex",
      "KeySchema": [
        { "AttributeName": "email", "KeyType": "HASH" }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ]
}'

# Create DynamoDB table
aws dynamodb create-table --cli-input-json "$table_definition" --endpoint-url http://localhost:8000 > /dev/null

# Additional setup or seeding if needed

echo "DynamoDB Local is now running and UserTable is created."