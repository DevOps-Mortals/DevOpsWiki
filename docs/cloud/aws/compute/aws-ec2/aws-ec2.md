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