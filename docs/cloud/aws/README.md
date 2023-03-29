## Monolithic vs Microservices

### Monolithic or Tightly Coupled

- Application with tightly coupled components like databases, servers, UI, business logic, etc.
- Also called **Monolithic** application
- If a single component fails, other components also fail, possibly failing the entire application.

### Microservices or Loosely Couple

- If a single component fails, other components continue to work
- Prevents entire application from failing at once

## Serverless Compute

With EC2 instances, the user has to manage the infrastructure of the instances, like software updates/patching etc. Serverless means that the provider manages the infrastructure entirely.

- Users can focus on applications rather than provisioning and maintaining
- Flexibility to auto scale serverless applications



## Provisioning Resources on AWS

### AWS Management Console

- Web based GUI
- Can implement or work with
  - Test Environments
  - Viewing bills
  - Monitoring
  - Non-technicals resources

### AWS CLI

- AWS commands to interact with resources using command line interface
- Avaiable for Windows, MacOS and Linux

### AWS SDKs

- Allows resource provisioning using other programming languages

### AWS Elastic Beanstalk

- Comprehensive service to automate deployment of instances
- Client submits the configuration settings and the EB builds an entire environment around it
- Can also provision load balancers

### AWS CloudFormation

- Declarative format Infrastructure as Code tool to provision resources
- Use JSON or YAML