# Create UserTable in DynamoDB Local
# DynamoDB table definition
user_table_definition='{
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
      "IndexName": "email",
      "KeySchema": [
        { "AttributeName": "email", "KeyType": "HASH" }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ]
}'
object_table_definition='{
  "TableName": "ObjectTable",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}'

# Create DynamoDB table
aws dynamodb create-table --cli-input-json "$user_table_definition" --endpoint-url http://localhost:8000 > /dev/null
aws dynamodb create-table --cli-input-json "$object_table_definition" --endpoint-url http://localhost:8000 > /dev/null