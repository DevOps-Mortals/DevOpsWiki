# AWS

Amazon Web Services is the first and the largest extensive cloud provider.

## Global Infrastructure

### Regions

- Geographically isolated areas with AWS Datacenters
- One region can have multiple availability zones
- One availability zone can have multiple datacenters

#### Factors in Choosing a Region

1. Compliance with Government
2. Proximity to end user
3. Feature Availability
4. Pricing

### Availability Zones

- Multiple discreet data centers in a single region
- Physically distant from each other to maximize redundancy
- Is the absolute granular unit of the infrastructure in AWS

### Edge Locations

#### AWS Cloudfront

- CDN Service
- Caching and copying of data closer to end users if no availability zone
- Uses edge locations to serve data closer to end user

#### Route 53

- DNS Service
- Also uses edge locations

#### AWS Outposts

- A discreet datacenter inside a client’s own building
- Owned and operated by AWS

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

## AWS EC2

### Types of EC2 Instances

#### General Purpose

For a variety of general purpose workloads like

- Web Servers
- Gaming Servers
- Small and Medium Database Servers
- Backend for enterprise applications

#### Compute Optimized

For compute intensive workloads like

- High Performance web servers
- Compute intensive application servers
- Dedicated gaming servers
- Batch processing

#### Memory Optimized

For workloads that process large datasets in memory

- High performance databases
- Real-time processing of large unstructured data

#### Accelerated Compute

Use hardware accelerators or coprocessors

- Floating-point number calculations
- Graphics processing
- Data pattern matching

#### Storge Optimized

For workloads that need high, sequential read/write access to large datasets on local storage

- Distributed file systems
- Data warehousing applications
- High frequency Online Transcation Processing (OLTP) systems

### Pricing

#### On-Demand

Ideal for short-term and irregular workloads or testing and getting started

- No upgront costs
- No contracts
- Pay for what you use

#### Savings Plans

Reduced costs by up to 72%  over on-demand, on a commitment of consistent usage for 1 year or 3 year term.

Committed usage is charged at the discounted Savings Plan rate and anything beyond is charged at on-demand rates.

#### Reserved Instances

Reserving instances for a 1 or 3 year term. Discounts are applied to the use of on-demand instances.

- Standard Reserved (1 or 3 years)
- Convertible Reserved (1 or 3 years)
- Scheduled Reserved (1 year)

#### Spot Instances

These is the unused EC2 capacity that can offer discounts of up to 90% of on-demand rates. It is ideal for workloads that can accept interruptions and/or have flexible start and end times.

Instances can be interrupted if AWS claims back the unused capacity.

#### Dedicated Hosts

Dedicated physical servers with EC2 instances capacity that is not shared with other users.

The most expensive way to use EC2.

### Scalability & Elasticity

#### Auto-Scaling

Automatically add or remove EC2 instances based on demand.

1. Dynamic Scaling

   Responds to changing demand automatically

2. Predictive Scaling

   Automatically schedules the required EC2 instances based on predicted demand

#### Auto-Scaling Groups

Add configurations for scaling using Groups.

1. Minimum Capacity

   The number of instances that launch immediately after creating a group.

2. Desired Capacity

   Is the ideal capacity that you would like for your application. If this is not specified, it defaults to minimum.

3. Maximum Capacity

   Set the maximum number of instances required in cases of demand spikes.

#### Elastic Load Balancing

- Distribute incoming traffic across resources like EC2 instances
- Can work in conjunction with Auto Scaling

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

### AWS Lambda

- Serverless compute service
- Run code without needing to provision or manage servers based on triggers
- Run virtually any type of application or backend service with zero administration

## AWS SNS (Simple Notification Service)

- Notifies subscribers on process completion
- Create Topics that can notify multiple subscribers at the same time
- Subscribers can be web servers, Lambda functions or web hooks, etc

## AWS SQS (Simple Queue Service)

- Send, store and receive messages between software components, without losing them.
- Queueing requests to be processed by other resources
- Avoids failures if receiving resources are busy or unavailable

## AWS Elastic Container Service (ECS)

Highly scalable high performance container management system to run and scale containerized applications.

- Supports Docker containers
- Supports Docker Community Edition (Open Source) as well as Docker Enterprise
- Use API calls to launch and stop Docker applications.