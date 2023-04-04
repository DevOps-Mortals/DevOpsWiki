# Kubernetes

The de facto container orchestration champion.

## Introduction

### Overview of Kubernetes

### Why Kubernetes

### Key Concepts & Terminologies

The container runtime interface and 'kubelet' need to be run as system processes and not container pods like the other components like etcd, kube-proxy, scheduler, etc.

#### API Server

- Entry point into the kube cluster
- Listens to the client request & responds

#### ETCD

- Simple key value pair database
- Stores all cluster configuration like number of pods and their config status

#### Scheduler

- Receives requests from API server to identify a worker node
- Validates all the nodes and identifies the best node based on resource availability
- Once node identified, the scheduler informs the worker 

#### Kubelet

- Receives requests from API Server
- Starts the pod creation
- Manages the pod lifecycle on the  worker nodes
- Gives node/pod information to the API

#### Controller Manager

- Is responsible for the desired state
- What we request == desired state

#### CNI

- Responsible for IP allocation to the pods
- Facilitates pod to pod communication

#### CRI

- Pull images from the registry
- Create containers from images

#### Kube Proxy

- Helps in configuring port mappings
- Responsible for updating all necessary route configurations to the containers from the host level.

### Kubernetes Alternatives

## Containers

## Setting Up Kubernetes

### Deploying your First Application

### Choosing a Managed Provider

### Installing a Local Cluster

## Running Applications

### Pods

#### Single Container Pods

#### Multi-Container Pods

##### Sidecars

##### Ambassadors

##### Adapters

#### Init Container Pods

#### Static Pods

- Created and managed by kubelet directly without the involvement of API server
- Any manifests present in the `staticPodPath` will automatically be created and persisted by kubelet
- The `staticPodPath` can be found from the kubelet `config.yaml`
- Static Pods are appended with the node name to which they belong
- All system pods created by Kubernetes upon install are Static Pods, like etcd, api-server, etc.

### Deployments

### ReplicaSets

### StatefulSets

### Jobs

## Services & Networking

### External Access to Services

### Load Balancing

### Networking & Pod2Pod Communication

## Configuration Management

### Injecting Pod Config with ConfigMaps

### Using Secrets for Sensitive Data

## Resource Management

### Setting Resource Requests and Limits

### Assigning Quotas to Namespaces

### Monitoring & Optimizing Resource Usage

## Security

### Role-based Access Control (RBAC)

### Networking Security

### Container & Pod Security

### Security Scanners

## Monitoring & Logging

### Logs

### Metrics

### Traces

### Resource Health

### Observability Engines

## Autoscaling

### Horizontal Pod Autoscaler (HPA)

### Vertical Pod Autoscaler (VPA)

### Cluster Autoscaling

## Scheduling

### Basics

### Taints & Tolerations

### Topology Spread Constraints

### Pod Priorities

### Evictions

## Storage & Volumes

### CSI Drivers

### Stateful Applications

## Deployment Patterns

### CI/CD Integration

### GitOps

### Helm Charts

### Canary Deployments

### Blue-Green Deployments

### Rolling Updates / Rollbacks

## Advanced Topics

### Cluster Operations

#### Should you manage your own cluster?

#### Installing the control plane

#### Adding and managing worker nodes

#### Multi-Cluster Management

## Self - Managed

### kubeadm

- Initializes a master process called the API Server on the master node
- There are no networking drivers by default as part of the cluster setup
- Unlike Docker Swarm, it supports autoscaling

```bash
kubeadm init
```

### kubelet

- Initializes an agent process called `kubelet` on worker node.

```bash
kubeadm join
```

### kubectl

- Command to interact with the K8S api and manages everything

```bash
kubectl get nodes

# Get extra details - IP, OS, Kernel and Runtime
kubectl get nodes -o wide
```

```bash
kubectl run
```

```bash
kubectl describe
```

```bash
kubectl delete
```

```bash
kubectl logs
```

```bash
kubectl exec
```

### CNI - Container Network Interface

- Install networking drivers to a Kube cluster
- Supports many different options like Flannel, Canal, Weave, Calico, etc.
- Supports SSL and RBAC

### Pods

- Smallest manageable unit of K8S
- Is an abstraction layer that can create & manage container(s)
- Ideally, one pod should contain one instance of an application
- All containers in a pod share the same IP address, which means a pod cannot have 2 containers using the same port (port conflict). For eg. nginx and httpd cannot co-exit as they share the same port
- Replication happens at the Pod level and not container level

#### List Pods

```bash
kubectl get pods

# With more details
kubectl get pods -o wide

# From a particular namespace
kubectl get pods -o wide --namespace default
```

#### Delete Pods

```bash
kubectl delete pod <podname>
```

#### Run a single Pod from Image

```bash
kubectl run <podname> --image=<imagename>
```

#### Describe a Pod

```bash
kubectl describe pod <podname>
```

#### Accessing Pod

```bash
kubectl exec -it <podname> -c <containername> -- /bin/bash
```

#### Get Pod Labels

```bash
kubectl get pods -o wide --show-labels
```

### Kubernetes Controller

- An abstraction layer that can create & manage a single pod or group of pods.

#### Deployment Controller

#### Create Deployment CLI

```bash
# Create a deployment controller
kubectl create deployment <controllername> --image=<imagename>
```

#### List Deployments

```bash
# List deployment controllers
kubectl get deployment -o wide

# List deployment from all namespaces
kubectl get deployment -o wide --all-namespaces
```

#### Scale Deployments

```bash
# Scale a deployment (up or down) Reaches the desired state, does not increment by the number
kubectl scale deployment <controllername> --replicas <no.>
```

#### Delete Deployment

```bash
# Delete deployment from default namespace
kubectl delete deployment <deploymentname>

# Delete from a particular namespace
kubectl delete deployment <deploymentname> --namespace <namespacename>
```

## Declarative YAML

```yaml
# Example of a Kubernetes YAML declaration

apiVersion: apps/v1
kind: Deployment
metadata:
  name: mydeployment
  
  # Labels for deployments are optional
  labels: 
    app: myapp
spec:
  
  # No. of pods to be created
  replicas: 4
  
  # mandatory, helps the controller identify the pods
  selector: 
    matchLabels:
      app: myapp
  
  # What pod to be created
  template: 
    metadata:
    
      # Helps to identify a group (mandatory to assign)
      labels: 
        app: myapp
    spec:
      
      # array if you need more containers in a pod
      containers: 
        - name: myapp-cont
          image: lerndevops/samples:pyapp-v1
          ports:
            - containerPort: 3000
        - name: cont2
          image: nginx
          ports:
            - containerPort: 80
  
```

#### Apply YAML

```bash
kubectl apply --filename <filename>.yaml
```

### List Deployments

```bash
kubectl get deployment -o wide
```

## Services

- Allows accessing app running in a single or group of pods

### Cluster IP

- Default service type
- **Internal virtual load-balancer**
- Kubernetes also creates a dynamic Load Balancer IP
- The controller will select pods based on pod labels (in the selector) since the pod IPs are dynamic and not statically assigned.
- Only creating a ClusterIP will not expose your cluster/app from the outside (eg. Browser)

```yaml
kind: Service
apiVersion: v1
metadata:
  name: myapp-svc
spec:
  
  # Default
  type: ClusterIP 
  selector:
    app: myapp
  ports:
  
      # your choice
    - name: cont1
    
      # Is being mapped to the Load Balancer IP
      port: 80
      
      # Port of the app inside the container
      targetPort: 3000 
    - name: cont2
      port: 81
      targetPort: 80
```

### NodePort

- Allows access to the cluster from outside
- It will publish a node port / host port on every node/vm in the cluster
- It also automatically creates a IV Load Balancer and assigns an IP to it
- It also automatically maps the node port/host port to the clusterip:port

```yaml
kind: Service
apiVersion: v1
metadata:
  name: myapp-svc
  
  # Below is the explanation
  namespace: teamA 
spec:
  type: NodePort
  selector:
    app: myapp
  ports:
      
      # your choice
    - name: cont1 
      
      # Is being mapped to the Load Balancer IP
      port: 80 
      targetPort: 3000
      
      # Kubernetes needs between 32768-35535
      nodePort: 32878 
    - name: cont2
      port: 81
      targetPort: 80
```

#### List Service

```bash
kubectl get services -o wide
```

#### Describe

```bash
# In this output, the Endpoints will show which Pods are present.
kubectl describe service <servicename>
```

## Namespaces

- Allows grouping of Kubernetes resources
- Anything we create in Kubernetes is a resource (eg. Pod, Deployment, Service)
- Provides **isolation** to the resources
- Every resource will mandatorily go under a namespace
- If no namespace is mentioned, it goes under **`default`** namespace
- Namespaces allow **access restriction**
- Mentioned under `metadata` inside the YAML files.

#### List Namespaces

```bash
kubectl get namespaces
```

#### Create Namespace

```bash
# Namespace based on teams
kubectl create namespace teamA

# Namespace based on environment
kubectl create namespace dev

# Namespace based on apps
kubectl create namespace app1
```

#### Apply Namespace on Run

```bash
kubectl apply -f filename.yml --namespace <namespacename>
```

## Rolling Updates

```yaml
# Example of a Kubernetes YAML with Rollout delay

apiVersion: apps/v1
kind: Deployment
metadata:
  name: mydeployment
  
  # Labels for deployments are optional
  labels: 
    app: myapp
spec:
  
  # No. of pods to be created
  replicas: 4
  
  # Hold up time after adding a few pods in a rolling update
  minReadySeconds: 45 
  
  # mandatory, helps the controller identify the pods
  selector: 
    matchLabels:
      app: myapp
  
  # What pod to be created
  template: 
    metadata:
      
      # Helps to identify a group (mandatory to assign)
      labels: 
        app: myapp
    spec:
      
      # array if you need more containers in a pod
      containers: 
        - name: myapp-cont
          image: lerndevops/samples:pyapp-v1
          ports:
            - containerPort: 3000
        - name: cont2
          image: nginx
          ports:
            - containerPort: 80
```

#### Initializing a rolling update

```bash
kubectl rollout status deployment <deploymentname>
```

#### Rollback

```bash
kubectl rollout undo deployment <deploymentname>
```

## Volumes in Kubernetes

- Kubernetes can manage volumes or we can manually bind volumes
- Pods can restart containers, so there is a change of losing all the data inside the container
- To avoid this, we use Persistent Volumes

```yaml
# Example Volume declaration

apiVersion: apps/v1
kind: Deployment
metadata:
  name: mydeployment
  
  # Labels for deployments are optional
  labels: 
    app: myapp
spec:
  # No. of pods to be created
  replicas: 4 
  
  # Hold up time after adding a few pods in a rolling update
  minReadySeconds: 45
  
  # mandatory, helps the controller identify the pods
  selector: 
    matchLabels:
      app: myapp
  
  # What pod to be created
  template: 
    metadata:
  
      # Helps to identify a group (mandatory to assign)
      labels: 
        app: myapp
    spec:
      volumes:
        - name: vol1
          hostPath:
            
            # path on the node where the pod will run
            path: /applogs 
      
      # array if you need more containers in a pod
      containers: 
        - name: myapp-cont
          image: lerndevops/samples:pyapp-v1
          ports:
            - containerPort: 3000
          volumeMounts:
            - name: vol1
              
              # Path inside container
              mountPath: /usr/local/tomcat/logs 
```

### Kubernetes Managed Persistent Volume Resource

```yaml
kind: PersistentVolume
apiVersion: v1
metadata
  name: pv-hp
spec:
  hostpath:
    path: /applogs
  capacity:
    storage: 2G
  accessMode:
    
    # Only one node can write the data (ReadWriteMany/ReadOnlyMany)
    - ReadWriteOnce
```

#### Create Persistent Volume

```bash
kubectl apply -f pv.yml
```

#### List Persistent Volumes

```bash
kubectl get pv -o wide
```

### Persistent Volume Claim

- PVs cannot be attached directly to a pod, an App must claim the volume.
- Once a PV has been claimed, no other app can claim it
- Only one PVC per PV.. there cannot be one PV to many PVCs

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata
  
  # App1 is claiming the volume
  name: app1-pvc
spec:
  
  # Name of the volume already created
  volumeName: pv-hp
  resources:
    reqests:
      storage: 2Gi
  accessMode:
    
    # Only one node can write the data (ReadWriteMany/ReadOnlyMany)
    - ReadWriteOnce
```

#### List Persistent Volume Claims

```bash
kubectl get pvc -o wide
```

```yaml
# Example Persistent Volume Claim declaration for a Deployment

apiVersion: apps/v1
kind: Deployment
metadata:
  name: mydeployment
  
  # Labels for deployments are optional
  labels: 
    app: myapp
spec:
  
  # No. of pods to be created
  replicas: 4 
  
  # Hold up time after adding a few pods in a rolling update
  minReadySeconds: 45
  
  # mandatory, helps the controller identify the pods
  selector: 
    matchLabels:
      app: myapp
  
  # What pod to be created
  template: 
    metadata:
      
      # Helps to identify a group (mandatory to assign)
      labels: 
        app: myapp
    spec:
      volumes:
        - name: vol1
          persistentVolumeClaim:
            claimName: app1-pvc
      
      # array if you need more containers in a pod
      containers: 
        - name: myapp-cont
          image: lerndevops/samples:pyapp-v1
          ports:
            - containerPort: 3000
          volumeMounts:
            - name: vol1
              
              # Path inside container
              mountPath: /usr/local/tomcat/logs 
```

## ConfigMaps

Imagine you are running three environments, dev, qa and prod. Your dev environment container connects to a DB which has dummy data. When you move this container to the prod environment, it can't be using the dummy data from the dev DB. In the prod environment, it will need real data. This means your container needs to connect with the prod DB.

> In Short: Environment specific data cannot be packaged into an image. If this data packaged, the image becomes useless, the image cannot deployed to another environment.

- ConfigMaps store non-confidential decoupled data
- Secrets are sensitive data
- We create a configuration data in the cluster and store it in the master node
- We then inject the data into a container at runtime.

```ini
DBHOST: "19.5.6.7"
DBPORT: "1234"
DBNAME: "devdb"
DBURL: "jdbc:thin@19.5.6.7/devdb"
```

