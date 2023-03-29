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