# Invoice Manager

Manage and keep track of invoices with the Invoice Manager application.

## Project Description

The Invoice Manager is a serverless application designed to help businesses manage and track their invoices. Built on top of AWS, it leverages several AWS services such as Lambda, API Gateway, DynamoDB, and Cognito for authentication.

## Features

- **User Authentication**: Secure sign up and login using AWS Cognito.
- **Invoice CRUD**: Create, read, update, and delete invoices.
- **Client Management**: Store and manage client information.
- **Secure**: All data is securely stored in AWS DynamoDB with appropriate access controls.
- **Serverless**: Powered by AWS Lambda and API Gateway.

## Setup & Installation

1. Install the Serverless Framework globally:

   ```bash
   npm install -g serverless
   ```

2. Clone this repository:

   ```bash
   git clone git@github.com:luizreverso/invoice-manager.git
   ```

3. Navigate to the project directory:

   ```bash
   cd invoice-manager
   ```

4. Install the necessary dependencies using Yarn:

   ```bash
   yarn install
   ```

5. Deploy the application using the Serverless Framework:
   ```bash
   serverless deploy
   ```

## Usage

- **Create User**: Use the `createUser` endpoint to sign up new users.
- **Login**: Authenticate users with the `login` endpoint.
- **Manage Invoices**: Use the various invoice endpoints to perform CRUD operations.
- **Manage Clients**: Store and retrieve client data using the client endpoints.

## Things Missing in the Project

- **Integration Tests**: Automated tests to verify the integrated units of the application work correctly.
- **Invoice Line Item Model**: Detailed line-by-line representation of each item in the invoice.

- **SNS Notification**: Integration with AWS SNS to notify users when an invoice status changes.

- **PDF Generation**: Convert invoice details into a downloadable PDF format for easy sharing and printing.
