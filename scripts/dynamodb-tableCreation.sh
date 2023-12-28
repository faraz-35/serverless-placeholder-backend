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