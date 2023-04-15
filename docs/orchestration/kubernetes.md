# Kubernetes

The de facto container orchestration champion.

## Introduction

### Key Concepts & Terminologies

The container runtime interface and 'kubelet' need to be run as system processes and not container pods like the other components like etcd, kube-proxy, scheduler, etc.

#### Control Plane

- To deploy pods on control plane, you need to remove the NoSchedule Taint on the master node.

  ```bash
  kubectl describe node master-node | grep -i taints
  ```

  ##### Untaint the Master Node

  ```bash
  # Add a hyphen at the end to untaint, remove the hyphen to taint again
  
  kubectl taint node master-node node-role.kubernetes.io/control-plane:NoSchedule-
  ```

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

## Declarative YAML

- Declarative model which will create a desired state
- YAMLs can be created by typing them out or letting Kubernetes create them for you using dry-runs.

#### CLI to YAML

```bash
kubectl create deployment <name> --dry-run=client -o yaml > <file>.yaml
```

**Sample YAML**

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

## Services

- Allows accessing app running in a single or group of pods
- Can be created using the command line

#### Create Service

```bash
# Syntax
kubectl expose <resource> <name> --name <servicename> --type <servicetype> --port <portno.> --target-port <portno.>
```

#### List Service

```bash
kubectl get services -o wide
```

#### Describe Services

```bash
# In this output, the Endpoints will show which Pods are present.
kubectl describe service <servicename>
```

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
  name: pyapp
  namespace: default
spec:
  type: NodePort
  selector:
    app: pyapp
  ports:
    - name: http # Name can be anything
      port: 80 # Port used with ClusterIP to access, Mandatory!
      targetPort: 3000 # Port of the app in the container
      nodePort: 30001 # Published port on every VM, if not mentioned, it is generated automatically
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
  name: pyapp
  namespace: default
spec:
  type: NodePort
  selector:
    app: pyapp
  ports:
    - name: http # Name can be anything
      port: 80 # Port used with ClusterIP to access, Mandatory!
      targetPort: 3000 # Port of the app in the container
      nodePort: 30001 # Published port on every VM, if not mentioned, it is generated automatically
```

### LoadBalancer (External)

- Distribute external traffic to the cluster
- Can be created manually, for eg. (nginx, haproxy, f5)
- Works with the Cloud Controller Manager, based on correct access, creates an external load balancer on the cloud of choice

```yaml
kind: Service
apiVersion: v1
metadata:
  name: pyapp-lb
  namespace: default
spec:
  type: LoadBalancer
  selector:
    app: pyapp
  ports:
    - name: http # Name can be anything
      port: 80 # Port used with ClusterIP to access, Mandatory!
      targetPort: 3000 # Port of the app in the container
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

## Types of Controllers

- An abstraction that controls a group of pods.
- If you delete the controller, the pods get deleted
- Cannot be created directly from the command line, like pods, EXCEPT, the Deployment controller

### ReplicaSet (replacement of Replication Controller)

**Sample YAML**

```yaml
kind: ReplicaSet
apiVersion: apps/v1
metadata:
  name: pyapp
  namespace: frontend
  
  # Labels are optional for controllers, unlike for pods, where they are mandatory
  labels: 
spec:
  
  # Total number of pods to be created, default is 1
  replicas: 4
  
  # Which Pod to be created
  template:
    metadata:
      # We don't use the 'name' object here as K8S will generate a unique pod name automatically. Multiple containers with the same names are not possible.
      labels:
        app: pyapp
    spec:
      terminationGracePeriodSeconds: 30
      restartPolicy: Always
      containers:
        - name: cont1
          image: nginx:latest
   
   # Select exiting pod(s) to be managed or controlled by this controller. Is mandatory, without this the controller will not be deployed.
  selector:
    matchLabels:
      app: frontend

```

#### List ReplicaSet

```bash
kubectl get rs <name> -o wide
```

#### Scale ReplicaSet

```bash
kubectl scale replicaset <name> --replicas <number>
```

#### Delete ReplicaSet

```bash
kubectl delete replicaset <name>
```

### DaemonSet

- Cannot be manually scaled like ReplicaSet
- Creates one pod per worker node
- Auto-scales based on the number of worker nodes online
- Use cases can include deploying a logging/monitoring agent per node (only one is needed per node to collect logs, so it can be deployed using DaemonSet)
- User deployed DaemonSet cannot have an instance deployed on master node

```yaml
kind: DaemonSet
apiVersion: apps/v1
metadata:
  name: fluentd
  namespace: frontend
  
  # Labels are optional for controllers, unlike for pods, where they are mandatory
  labels: 
spec:
  template:
    metadata:
      # We don't use the 'name' object here as K8S will generate a unique pod name automatically. Multiple containers with the same names are not possible.
      labels:
        app: fluentd
    spec:
      terminationGracePeriodSeconds: 30
      restartPolicy: Always
      containers:
        - name: cont1
          image: quay.io/fluted_elasticsearch/fluentd:v2.5.2
   
   # Select exiting pod(s) to be managed or controlled by this controller. Is mandatory, without this the controller will not be deployed.
  selector:
    matchLabels:
      app: fluentd
```

#### Get DaemonSet

```bash
kubectl get ds -n kube-system -o wide
```

### Deployment

- Has similar functionality as the ReplicaSet with some added functions
- In addition to all the functions of ReplicaSet, Deployment can enable rolling updates / rollbacks
- A Deployment controller can manage multiple ReplicaSets
- This is the controller used in majority of cases.

#### Create from Command Line

```bash
kubectl create deployment <name> --image=<image>
```

**Sample YAML**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubeserve
spec:
  replicas: 10
  
  # How many revisions should be maintained in ETCD by Kube
  revisionHistoryLimit: 30
  # Waiting time before making further changes to rollout
  minReadySeconds: 45
  strategy:
    type: RollingUpdate
    rollingUpdate:
    
      # No. of pods that can be unavailable to take requests during the update. Recommended 0 always. Default is 25%
      maxUnavailable: 1
      
      # No. of extra pods added while rolling update is in progress. Default is 25%
      maxSurge: 2        
  selector:
    matchLabels:
      app: kubeserve
  template:
    metadata:
      name: kubeserve
      labels:
        app: kubeserve
    spec:
      containers:
      - image: leaddevops/kubeserve:v1
        name: app

---
kind: Service
apiVersion: v1
metadata:
   name: kubeserve-svc
spec:
  type: NodePort
  selector: 
    app: kubeserve
  ports:
    - port: 80
      targetPort: 80
```

#### List Deployment

```bash
kubectl get deployment -o wide
```

#### Describe Deployment

```bash
kubectl describe deployment <name>
```

#### Delete Deployment

```bash
kubectl delete deployment <name>
```

#### Scale a Deployment

```bash
kubectl scale deployment <name> --replicas <no.>
```

### Rollout Strategy

- Is the default strategy in Kubernetes
- Makes sure there are no downtimes between version upgrades
- Is a usually slower deployment

#### Check Rollout Status

```bash
kubectl rollout status deployment kubeserve
```

#### Initializing a rolling update

- Changing and applying a new YAML file will initiate a rolling update

#### Check Rolling Update Status

```bash
kubectl rollout status deployment <deploymentname>
```

#### Rollback

- Undo deployment moves back one step in the revision history but considers a rollback as another revision
- Kubernetes will delete a revision when a newer revision is exactly the same as a previous revision.

| Revision No. | App Version | Comment              |
| ------------ | ----------- | -------------------- |
| 1            | v1          | Initial deployment   |
| ~~2~~        | ~~v2~~      | ~~v2 deployment~~    |
| 3            | v3          | Corrupted Deployment |
| 4            | v2          | Rollback Undo        |

- At Revision 4, the revision is exactly same as revision 2, so Kubernetes will remove Revision 2 and only keep Revision 4.
- This means the revision history will now only show 1, 3 and 4.

```bash
# Rollback to the immediate previous revision
kubectl rollout undo deployment <name>

# Rollback to a previous revision specified
kubectl rollout undo deployment <name> --to-revision <no.>
```

#### Check Rollout history

```bash
kubectl rollout history deployment <name>
```

### Recreate Strategy

- Replaces all of the previous versions with new versions without any delay or rolling update strategy
- Will cause a downtime while the containers/pods are getting ready
- The deployment is faster than in Rollout update

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubeserve
spec:
  replicas: 10
  revisionHistoryLimit: 30
  minReadySeconds: 45
  strategy:
    type: Recreate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 2        
  selector:
    matchLabels:
      app: kubeserve
  template:
    metadata:
      name: kubeserve
      labels:
        app: kubeserve
    spec:
      containers:
      - image: leaddevops/kubeserve:v1
        name: app
```

### Job

- Running certain tasks until they are reached to successful completion
- For eg. daily backup of a database can be a job
- The `restartPolicy` for a job controller should always be set to `never`

**Sample YAML**

```yaml
# Backup ETCD DB Using JOB Controller
kind: Job
apiVersion: batch/v1
metadata:
  name: backup-etcd-job
  namespace: default
spec:
  # Retry if the job fails
  backoffLimit: 4
  template:
    metadata:
      labels:
        app: etcd
    spec:
      restartPolicy: Never
      volumes:
        - name: hpvol
          hostPath:
            path: /opt/etcd-backup
      containers:
        - name: etcd
          image: lerndevops/samples:etcdctl
          command: ["sh", "-c", 'ETCDCTL_API=3 etcdctl --endpoints=etcdserver:2379 snapshot save "etcd-snapshot-latest-`date +"%d-%m-%Y-%H-%M"`.db"']
          volumeMounts:
            - name: hpvol
              mountPath: /opt/etcd-backup
```

#### List Jobs

```bash
kubectl get job -o wide
```

### CronJob

- Automated job execution based on a specified schedule
- In day of the week, 1-6 are Monday to Saturday. Sunday can be 0 or 7
- Visit [Crontab.guru - The cron schedule expression editor](https://crontab.guru/) to more about Cron Syntax

**Sample YAML**

```yaml
kind: CronJob
apiVersion: batch/v1
metadata:
  name: backup-etcd-cornjob
  namespace: default
spec:
  schedule: "* * * * *"
  suspend: false
  jobTemplate:
   spec:
    backoffLimit: 4
    template:
      metadata:
        labels:
          app: etcd1
      spec:
        restartPolicy: Never
        volumes:
          - name: hpvol
            hostPath:
              path: /opt/etcd-backup
        containers:
          - name: etcd
            image: lerndevops/samples:etcdctl
            command: ["sh", "-c", 'ETCDCTL_API=3 etcdctl --endpoints=etcdserver:2379 snapshot save "etcd-snapshot-latest-`date +"%d-%m-%Y-%H-%M"`.db"']
            volumeMounts:
              - name: hpvol
                mountPath: /opt/etcd-backup
```

#### List CronJob

```bash
kubectl get cronjob -o wide
```

### StatefulSet

~ developing ~

## Logging

### Logs

#### Get Logs

```bash
kubectl logs <resource>
```

## Additional Spec

### Pod Spec

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubeserve
spec:
  replicas: 10
  revisionHistoryLimit: 30
  minReadySeconds: 45
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 2        
  selector:
    matchLabels:
      app: kubeserve
  template:
    metadata:
      name: kubeserve
      labels:
        app: kubeserve
    spec:
      containers:
        - image: leaddevops/kubeserve:v1
          name: app
          ports:
            - containerPort: 3000
          env:
            - name: JAVA_HOME
              value: /opt/java
            - name: DBHOST
              value: "4.5.6.7"
          resources:
            # Minimum resources guaranteed for the container
            requests:
              memory: 128M
              # 1 core CPU = 1000 milli CPUs
              cpu: 20m
            # Maximum resources allowed
            limits:
              memory: 512M
              cpu: 50m
```

## Metrics

```bash
# Get resource utilisation of nodes
kubectl top node

# Get resource utilisation of pods
kubectl top pod
```

## Scheduling

### nodeName

- This can be considered as a "No-Scheduler" deployment
- These pods are coming directly from Kubelet and not from the scheduler
- Will create a single point of failure if the selected node goes down

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: nn-dep
 labels:
   app: myapp
spec:
 revisionHistoryLimit: 15
 replicas: 3
 selector:
   matchLabels:
     app: myapp
 template: # what pod to be deployed
   metadata:
     labels:
       app: myapp
   spec:
     nodeName: worker-node02
     terminationGracePeriodSeconds: 0
     restartPolicy: Always
     containers:
       - name: myapp-cont
         image: lerndevops/samplepyapp:v2
         ports:
          - containerPort: 3000
         env:
           - name: JAVA_HOME
             value: /opt/java
           - name: DBHOST
             value: "4.5.6.7"
```

### nodeSelector

- Selecting multiple nodes for a deployment
- These pods are coming directly from Kubelet and not from the scheduler
- Will create a single point of failure if the selected node goes down

#### Labeling Nodes

- Allows for grouping of nodes
- Nodes can have multiple labels (meaning they can be part of multiple groups)

```bash
# Using any key value pair
kubectl label node worker-node01 role=app
kubectl label node worker-node02 role=app
kubectl label node worker-node01 env=dev
kubectl label node worker-node-2 env=qa
```

#### Deleting a Label

```bash
kubectl label node worker-node01 env-
```

**Sample YAML**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: ns-dep
 labels:
   app: myapp
spec:
 revisionHistoryLimit: 15
 replicas: 3
 selector:
   matchLabels:
     app: myapp
 template: # what pod to be deployed
   metadata:
     labels:
       app: myapp
   spec:
     # Selects all nodes with the given label
     nodeSelector:
       # This is an "and" condition. All labels must be satisfied to be selected
       role: app
       # env: dev
     terminationGracePeriodSeconds: 0
     restartPolicy: Always
```

### Taints & Tolerations

#### Taints:lock:

- Tainting a node is like putting a lock on a node
- It is similar to applying labels but with opposite effects (tainting a node means it will start rejecting pods)
- Can be a `key=value:effect` or `key:effect`
- Effects are predefined keywords like `NoSchedule`, `NoExecute` or `PreferNoSchedule`

##### NoSchedule

- Does not affect already running pods, any other action will result in pod reject (eg. restart, re-schedule), regardless of Tolerations.
- New pods will be rejected after we apply the taint, if there are no Tolerations

##### NoExecute

- Deletes/evacuates all the pods that don't have Tolerations defined
- Upcoming pods without Tolerations will also be rejected

##### Apply Taint

```bash
kubectl taint node worker-node01 role=db:NoSchedule
kubectl taint node worker-node02 role=db:NoSchedule

kubectl taint node worker-node01 region=us:NoExecute
```

##### Get All Taints

```bash
kubectl describe nodes | egrep "Taints|Name" | grep -v Namespace
```

#### Untaint

```bash
kubectl taint node worker-node01 role=db:NoSchedule-
```

#### Tolerations :key:

- Deploy a pod to a node which is tainted

**Sample YAML**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: ns-dep
 labels:
   app: myapp
spec:
 revisionHistoryLimit: 15
 replicas: 3
 selector:
   matchLabels:
     app: myapp
 template: # what pod to be deployed
   metadata:
     labels:
       app: myapp
   spec:
     tolerations:
       - key: role
         value: db
         effect: NoSchedule
         # When taint is defined as key=value:effect
         operator: "Equal"
       - key: node-role.kubernetes.io/master
         effect: NoSchedule
         # When taint is defined as key:effect
         operator: "Exists"
     terminationGracePeriodSeconds: 0
     restartPolicy: Always
```

## Delete Everything

- Deletes all deployed resources
- [Warning] Deletes all deployed resources, **WITHOUT CONFIRMATION**

```bash
kubectl delete all --all
```

