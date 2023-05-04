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

# Volumes in Kubernetes

- Kubernetes can manage volumes or we can manually bind volumes
- Pods can restart containers, so there is a change of losing all the data inside the container
- To avoid this, we use Persistent Volumes

## Types of Volumes

### emptyDIR

- Lifecycle of this volume is managed by the Pod
- Ephemeral storage present only in the RAM
- Is not persistent
- Is created inside a Pod but outside a container

![](C:\Users\Nyukeit\Downloads\emptyDIR.jpg)

#### Sample YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mydeployment
  labels: 
    app: nginx-front
spec:
  replicas: 4 
  minReadySeconds: 45
  selector: 
    matchLabels:
      app: nginx-front
  template: 
    metadata:
      labels: 
        app: nginx-front
    spec:
      volumes:
        - name: vol1
          emptyDir: {}
      containers: 
        - name: myapp-cont
          image: nginx:latest
          ports:
            - containerPort: 3000
          volumeMounts:
            - name: vol1
              mountPath: /var/logs/nginx 
```

### Persistent Volume

```yaml
# Example Volume declaration

apiVersion: apps/v1
kind: Deployment
metadata:
  name: mydeployment
  labels: 
    app: myapp
spec:
  replicas: 4 
  minReadySeconds: 45
  selector: 
    matchLabels:
      app: myapp
  template: 
    metadata:
      labels: 
        app: myapp
    spec:
      volumes:
        - name: vol1
          hostPath:
            path: /applogs 
      containers: 
        - name: myapp-cont
          image: lerndevops/samples:pyapp-v1
          ports:
            - containerPort: 3000
          volumeMounts:
            - name: vol1
              mountPath: /usr/local/tomcat/logs 
```

#### Sample YAML

```yaml
kind: PersistentVolume
apiVersion: v1
metadata:
  name: pv-hp
spec:
  hostpath:
    path: /applogs
  capacity:
    storage: 2G
  accessMode: 
  # Only one node can write the data
    - ReadWriteOnce
    #- ReadWriteMany
    #- ReadOnlyMany
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
metadata:
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

#### External Storage with PV & PVC

- Mapping storage that is completely external to the VMs/nodes
- Examples can be NFS, GlusterFS, GCEPD, EBS, AzureFiles

##### Sample YAML for PV with NFS (Network File Storage)

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv 
spec:
  capacity:
    storage: 1Gi 
  accessModes:
    - ReadWriteMany 
  persistentVolumeReclaimPolicy: Retain 
  nfs: 
    path: /mnt/appdata
    server: <PLACE-NFS-SERVER-IP-HERE>
    readOnly: false
```

##### Sample YAML for PVC with NFS

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-pvc  
spec:
  volumeName: nfs-pv
  accessModes:
   - ReadWriteMany      
  resources:
     requests:
       storage: 1Gi
```

### Storage Classes



### ConfigMaps

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

### Secrets

~developing~

# Controllers

- An abstraction that controls a group of pods.
- If you delete the controller, the pods get deleted
- Cannot be created directly from the command line, like pods, EXCEPT, the Deployment controller

## ReplicaSet (replacement of Replication Controller)

### Sample YAML

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

### List ReplicaSet

```bash
kubectl get rs <name> -o wide
```

### Scale ReplicaSet

```bash
kubectl scale replicaset <name> --replicas <number>
```

### Delete ReplicaSet

```bash
kubectl delete replicaset <name>
```

## DaemonSet

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

### Get DaemonSet

```bash
kubectl get ds -n kube-system -o wide
```

## Deployment

- Has similar functionality as the ReplicaSet with some added functions
- In addition to all the functions of ReplicaSet, Deployment can enable rolling updates / rollbacks
- A Deployment controller can manage multiple ReplicaSets
- This is the controller used in majority of cases.

### Create from Command Line

```bash
kubectl create deployment <name> --image=<image>
```

### Sample YAML

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

### List Deployment

```bash
kubectl get deployment -o wide
```

### Describe Deployment

```bash
kubectl describe deployment <name>
```

### Delete Deployment

```bash
kubectl delete deployment <name>
```

### Scale a Deployment

```bash
kubectl scale deployment <name> --replicas <no.>
```

## Rollout Strategy

- Is the default strategy in Kubernetes
- Makes sure there are no downtimes between version upgrades
- Is a usually slower deployment

### Check Rollout Status

```bash
kubectl rollout status deployment kubeserve
```

### Initializing a rolling update

- Changing and applying a new YAML file will initiate a rolling update

### Check Rolling Update Status

```bash
kubectl rollout status deployment <deploymentname>
```

### Rollback

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

### Check Rollout history

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

## Job

- Running certain tasks until they are reached to successful completion
- For eg. daily backup of a database can be a job
- The `restartPolicy` for a job controller should always be set to `never`

### Sample YAML

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

### List Jobs

```bash
kubectl get job -o wide
```

## CronJob

- Automated job execution based on a specified schedule
- In day of the week, 1-6 are Monday to Saturday. Sunday can be 0 or 7
- Visit [Crontab.guru - The cron schedule expression editor](https://crontab.guru/) to more about Cron Syntax

### Sample YAML

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

### List CronJob

```bash
kubectl get cronjob -o wide
```

## StatefulSet

- A stateful application is one which needs to save data in one session for use in another session, called Application State
- Always requires a 'Headless' Kubernetes service. A headless service does not have an assigned IP. It is essentially a ClusterIP without an IP. It has multiple IPs (one for each pod) assigned to a single domain name.
- Provides guarantees ordering and uniqueness of Pods
- Usually used with DB intances

**Sample YAML**

```yaml
apiVersion: apps/v1
kind: StatefulSet 
metadata:
  name: db
  labels:
    app: redis
spec:
  replicas: 8
  serviceName: redis
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:latest 
        ports:
        - containerPort: 6379

---

apiVersion: v1
kind: Service
metadata:
  name: redis
  labels:
    app: redis
spec:
  ports:
  - port: 80
  clusterIP: None
  selector:
    app: redis
```

### List StatefulSets

```bash
kubectl get sts -o wide
```

### Scale StatefulSets

- Scaling appends the numbers

```bash
kubectl scale sts <name> --replicas <no>
```

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
 name: tt-dep
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

## Networking

- Kubernetes creates `/pause` containers to maintain networking
- Containers can be joined in to another container's network
- This way, every container gets the same IP Address
- This is how all containers in a Kubernetes pod get the same IP

### Pod to Pod Communication

#### Kube DNS

- Handled by the Coredns pods
- Creates a DNS

```ini
# resolv.conf used by Kubernetes
cluster.local

svc
  # Namespace
  default
    # This is an IP with a short name
    x.x.x.x name
pod
  name
  name2
```

#### FQDN

- Fully Qualified Domain Name
- Generally, using short names can lead to confusion and ambiguity (For eg. a service named mongo could be in two or more namespaces)
- FQDNs will solve this by pointing to the exact resource
- Suggested to be used always

```ini
cluster.local
  svc
    default
      mongo.default.svc.cluster.local
    teamA
      mongo.teamA.svc.cluster.local

  pod
    default
      x-x-x-x.default.pod.cluster.local
```

### Ingress Controller

- For exposing the applications outside of the cluster
- Helps in exposing multiple applications
- It is in essence a Load Balancer that forwards requests into multiple ClusterIPs.
- Always runs within the cluster only
- It is a regular K8S pod running a LB process (nginx/haproxy)

#### Ingress Resource

- It's a Kubernetes manifest
- Contains the routing rules that are fed to the ingress controller

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: apps-ingress-rule
  annotations:
    ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: nginx-custom-default-backend
              port:
                number: 80
        - path: /unapp
          pathType: Prefix
          backend:
            service:
              name: unapp-svc
              port:
                number: 80
        - path: /pyapp
          pathType: Prefix
          backend:
            service:
              name: pyapp-svc
              port:
                number: 80
        - path: /petclinic
          pathType: Prefix
          backend:
            service:
              name: petclinic-svc
              port:
                number: 80
```

### Network Policy

- Used to restrict pod to pod communication

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: allow-access-mongo-from-app-only
  namespace: default
spec:
  # On which pods the policy applies
  podSelector:
    matchLabels:
      app: mongodb
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
      - podSelector:
          matchLabels:
            app: myapp
      #- namespaceSelector:
      #- ipBlock:
          #cidr: 0.0.0.0/0
```

## Probes

- Run health checks inside containers
- Take action if health checks fail
- Written at container level in manifests

| Order | Probe     |
| ----- | --------- |
| 1     | Startup   |
| 2     | Readiness |
| 3     | Liveness  |

### Liveness Probe

- Restarts a Pod if an application container is running but not progressing.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: livenessprobe
spec:
  replicas: 3
  revisionHistoryLimit: 30
  minReadySeconds: 45      
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
      - image: lerndevops/samples:springboot-app
        name: app
        # LivenessProbe restarts a container if health checks fail
        livenessProbe:
          #httpGet:
            #path: /
            #port: 8080
          #tcpSocket:
            #port: 8080
          exec:
            command: ["curl", "localhost:80"]
          # Perform health check after
          initialDelaySeconds: 5
          # Perform health check every
          periodSeconds: 10
          # Wait till declared Failed
          timeoutSeconds: 5
```

### Readiness Probe

- Checks if a pod is up and running and ready to receive traffic
- All containers in the pod must be ready for the pod status to be ready

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: livenessprobe
spec:
  replicas: 3
  revisionHistoryLimit: 30
  minReadySeconds: 45      
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
      - image: lerndevops/samples:springboot-app
        name: app
        livenessProbe:
          exec:
            command: ["curl", "localhost:80"]
          # Perform health check after
          initialDelaySeconds: 60
          # Perform health check every
          periodSeconds: 10
          # Wait till declared Failed
          timeoutSeconds: 5
        readinessProbe:
          exec:
            command: ["curl", "localhost:880"]
          initialDelaySeconds: 60
          periodSeconds: 10
          timeoutSeconds: 20
```

# Security

- K8S generates self-signed certificates
- All components connect securely using SSL certificates
- All certificates are stored in the `/etc/kubernetes/pki` folder

## RBAC

- Role-based Access Control
- Every user will need a certificate to authenticate to access the API server
- The Kubernetes Cluster Certificate Authority will issue a certificate

### Creating & Configuring Users

#### Create a key for user

```bash
openssl genrsa -out user1.key 2048
```

#### Create a CSR for the user

```bash
openssl req -new -key user1.key -out user1.csr -subj "/CN=user1/O=devops"
```

#### Generate a Certificate for the user

```bash
openssl x509 -req -in user1.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out user1.crt -days 1000
```

#### Example Configuration for a User

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: /etc/kubernetes/pki/ca.crt
    server: https://10.0.0.10:6443
  name: dev-cluster
- cluster:
    certificate-authority: /etc/kubernetes/pki/ca.crt
    server: https://10.0.0.10:6443
  name: qa-cluster
contexts:
- context:
    cluster: dev-cluster
    user: user1
  name: user1@dev-cluster
current-context: user1@dev-cluster
kind: Config
preferences: {}
users:
- name: user1
  user:
    client-certificate: /home/vagrant/certs/user1.crt
    client-key: /home/vagrant/certs/user1.key
```

### RBAC Access Levels

#### Namespace Level

- Roles and rolebindings work at this level

#### Cluster Level

- Clusterroles and clusterrolebindings work at this level
- Used for resources that cannot be scoped inside Namespaces (eg. persistentvolume, nodes, etc.)

### Roles

- Set of actions that can be performed on K8S resources (eg. get, delete, create on pods, services, deployments, etc)
- ONLY defines WHAT can be done, not WHO can do it.

#### Create Role

```bash
# This role can only get, list and watch pods, services and deployments
kubectl create role <name> --n <name> --verb=get,list,watch --resource=pods,services,deployments

# Wildcard Access
kubectl create role <name> --n <name> --verb="*" --resource="*.*"
```

**Example YAML**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  creationTimestamp: null
  name: readonly
  namespace: teama
rules:
- apiGroups:
  - ""
  resources:
  - pods
  - services
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - apps
  resources:
  - deployments
  verbs:
  - get
  - list
  - watch
```

#### Get Role

```bash
kubectl get roles -n <name>
```

#### Describe Role

```bash
kubectl describe role <rolename> -n <namespace>
```

#### Clusterrole

```bash
kubectl create clusterrole <crname> --verb=get,list,watch --resource=pods,deployments,services,namespaces
```

**Example YAML**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  creationTimestamp: null
  name: crall
rules:
- apiGroups:
  - ""
  resources:
  - pods
  - services
  - namespaces
  verbs:
  - '*'
- apiGroups:
  - apps
  resources:
  - deployments
  verbs:
  - '*'
```

### Rolebindings

- This will define the WHO part
- Binding a user to a role

#### Create Rolebinding

```bash
# Binding a user to a role
kubectl create rolebinding <rbname> -n <nsname> --role=<rname> --user=<uname>
```

**Example YAML**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  creationTimestamp: null
  name: readonlyaccess
  namespace: teama
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: readonly
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user1
```

#### Clusterrole Binding

```bash
kubectl create clusterrolebinding <crbname> --clusterrole=<crname> --user=<uname>

# Allow access to a group of users
kubectl create clusterrolebinding <crbname> --clusterrole=<crname> --group=<gname>
# This <gname> is the same as the O=<name> provided when creating user. O stands for Organisation
```

**Example YAML**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  creationTimestamp: null
  name: crbindall
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: crall
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user1
```

## Service Accounts

- Provides an identity for processes that run inside a Pod
- Maps to a ServiceAccount. Pods authenticate with the API Server as a ServiceAccount
- There is always at least one ServiceAccount per namespace
- A Bearer Token is generated along with it, in `/var/run/secrets/kubernetes.io/serviceaccount`

### Create ServiceAccount

```bash
kubectl create sa -n <nsname>
```

- By deafult, the SA does not have any permissions, but access can be added using the Role and Rolebinding for namespace scoped access
- To provide cluster-wide access, use ClusterRole and ClusterRoleBinding instead

```bash
# create role scoped to default namespace with read permissions
kubectl create role testsa-role --namespace=default --verb=get,list,watch --resource="*.*"

# Assign the role to Service Account 
kubectl create rolebinding testsa-rb --namespace=default --role=testsa-role --serviceaccount=default:testsa
```

## Security Context

- Defines privilege and access control settings for a Pod or a container

### Disable Write Access

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: readonly-pod
spec:
  containers:
  - name: cont1
    image: alpine
    command: ["/bin/sleep", "999999"]
    securityContext:
      # Keeps the container file system Read Only. Allows writing to externally mounted volumes only.
      readOnlyRootFilesystem: true
    volumeMounts:
    - name: my-volume
      # This path will still be writeable inside the container
      mountPath: /volume
      readOnly: false
  volumes:
  - name: my-volume
    emptyDir: {}
```

### Disable Root Access to Container

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: nonroot-pod
spec:
  containers:
    - name: cont1
      image: ubuntu
      command: ["/bin/bash", "-c", "sleep 6000"]
      securityContext:
        runAsNonRoot: true
        # UID of User
        runAsUser: 400
        # GID of Group
        runAsGroup: 400
```

# Troubleshooting

| Error                | Detail                                                       | Possible Reasons                                             | Possible Solutions                                           |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ImagePullBackOff     | Unable to retrieve container image from registry             | Wrong Image name or tag<br />Permission or authentication issue with registry<br />`ImagePullSecret` issue<br />Wrong RBAC access | Check Image name and tag<br />Check secret credentials<br />Check RBAC policies |
| CrashLoopBackOff     | Container cannot be scheduled on node                        | Pod cannot mount volumes<br />Node does not have enough resources | Verify volume details are correct<br />Manually schedule pod on another node |
| Out-of-Memory (OOM)  | Container is terminated due to resource shortage or memory leak | If a container in a Pod has reached resource limit or OOMKilled, i.e., container tried to use more memory than configured to use | Increase container's memory limit in pod spec<br />Check application for memory leak<br />Define resource limits |
| BackOffLimitExceeded | Job has reached its retry limit                              | Most commonly, a designated path does not exist<br />Job cannot locate an input file for processing | Check pod logs for failure reasons                           |

# Delete Everything

- Deletes all deployed resources
- [Warning] Deletes all deployed resources, **WITHOUT CONFIRMATION**

```bash
kubectl delete all --all
```

