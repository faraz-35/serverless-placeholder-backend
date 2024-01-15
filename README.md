# Serverless Application Starter Template

## Description

This starter template provides a basic CRUD (Create, Read, Update, Delete) application built with a cloud-native architecture using AWS Serverless Application Model (SAM). It leverages AWS services such as API Gateway, Lambda, and DynamoDB. This template serves as a placeholder for a serverless backend.

## Features

-   Create, read, update, and delete operations using AWS Lambda functions
-   API Gateway for handling requests and responses
-   DynamoDB for persistent data storage

## Installation

To install the application, follow these steps:

1. Clone the repository: `git clone https://github.com/faraz-35/serverless-placeholder-backend`
2. Navigate to the project directory: `cd serverless-placeholder`
3. Install dependencies: `npm install` or `yarn install`
4. Initialize and update the Git submodules: `git submodule update --init --recursive`
5. Initialize local dynamodb container :`npm run dynamodb-local-setup`

## Usage

To run the application locally (Needs running docker):

1. Update default parameters for stack name and region in samconfig.toml file.
2. Deploy the application using AWS SAM: `sam build && sam deploy`

## Testing

To run the tests for the application, follow these steps:

2. Setup local dynamoDB container and run the tests: `npm run test`

## Planned Improvements

Here are some improvements we're planning to implement in the future:

-   **LocalStack Integration**: To improve the local development experience, we plan to integrate LocalStack. This will allow developers to test AWS services locally without needing to deploy their applications.

-   **VPC Integration**: For enhanced security, we plan to run the application inside a Virtual Private Cloud (VPC). This will provide a more secure environment by isolating the application from the public internet.

-   **Additional AWS Resources**: We plan to incorporate more AWS resources into the application's workflows to expand its capabilities and provide more functionality.

Please note that these are planned improvements and the timeline for their implementation may vary. We welcome contributions to help implement these features!

## Contributing

Contributions are welcome! Please read the [contributing guidelines](./CONTRIBUTING.md) before getting started.

## License

This project is licensed under the [MIT License](./LICENSE.md).
