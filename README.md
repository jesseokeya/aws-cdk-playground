## Aws CDK Playground
Simple Fibonacci generator ⚙️. To grasp how to deploy a real world app to aws via aws cdk for typescript

The frontend react application will provide input for the users to enter the desired Fibonacci number and the backend REST API will return the value for the requested number. Trying to build a scalable architecture for this app where hundreds of users start requesting Fibonacci numbers ✨. Using aws `Fargate` and an `ECS` cluster to containerize the backend service and `Cloudfront` as a cdn to serve static files with `Route 53` for dns mapping.

![alt text](./images/infra.png)

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Running Locally

### Prerequisites

Make sure you have node installed on your system. [Node Installation instruction](https://nodejs.org/en/).

Install [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and Execute the following below to get aws-cdk 👇🏽

```sh
# Authenticate aws cli with iam credentials
aws configure

# Install aws cdk globally
npm i -g aws-cdk

# Check installed aws-cdk version
cdk --version # 2.56.1 (build 9329a73)

```

### Installing Dependencies

To run this project you will need to install the third party dependencies.

```sh
# Installation for the backend service
cd backend && npm i
```

then 

```sh
# Installation for the frontend service
cd frontend && npm i
```


### Runing Application Locally

To run this application use the command below
```sh
# Run backend service
cd backend && npm start
```

then 

```sh
# Run frontend service
cd frontend && npm start
```

### Runing In Docker
To run this application using docker use the following command(s) below

```sh
cd backend && docker docker build --no-cache .
```
then 

```sh
docker run -it -p 80:80 "image_id"
```

Navigate to 👉🏽 http://localhost/

## Built With
* [Aws Cdk](https://aws.amazon.com/cdk/) - Aws Cdk
* [Node](https://nodejs.org/en/) - Node Js
* [React](https://reactjs.org/) - React

## Authors
* [Jesse Okeya](https://github.com/jesseokeya/)