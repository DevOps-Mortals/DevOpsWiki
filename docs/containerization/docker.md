# Docker

## Basic Commands

### Pull

Pull Docker images from Docker Hub

```bash
# Pulling a docker image
docker pull nginx # By default it pulls the latest image
docker pull nginx:1.21 # Pull a specific version of the image
```

### Run

Run a container from an image.

```bash
docker run nginx # Starts a container in foreground mode (interactive)
docker run -d nginx # Starts a container in background mode

# Map a random port to the container
docker run -d -P <container id/name>

# Map a chosen port to the container
docker run -d -p <yourport>:<mappedport> <container id/name> # Mapped port is the port of the host machine/VM/Server
```

### List

List of docker containers that are currently running

```bash
docker ps # shows running containers
docker ps -a # shows all containers (running and exited)
docker ps -s # shows containers with added sizes after modifications inside container
```

### List Images

List docker images currently downloaded on the local system

```bash
docker image ls
```

### Start

Start docker containers using either their id or unique name

```bash
docker start <id>
docker start <unique name>
```

### Stop

Stop docker containers

```bash
docker stop <id> # you need to only provide the first three or four unique characters from id, not the entire id.
docker stop <unique name>
```

### Kill

Forcefully quit a docker container (for eg. if it is unresponsive)

```bash
docker kill <id>
docker kill <unique name>
```

### Remove

Remove docker containers. They need to be stopped to be removed.

```bash
docker rm <id>
docker rm <unique name>
docker rm --force <id> # remove running containers
```

### Logs

Show logs for a particular container

```bash
docker logs <container id>

docker logs -f # Live follow logs
```

### Inspect

Get detailed data about a container

```bash
docker inspect <container id>
```

### Stats

Shows detailed stats about running containers

```bash
docker stats
```

### Exec

Login to a container’s shell terminal

```bash
docker exec -it <container id/name> /bin/bash # Login to a container's bash shell in interactive mode (-i interactive, t terminal)
dockdr exec <container id/name> ls -l # Display the file contents of the container inside your current terminal
```

### Top

Check the processes running inside a container

```bash
docker top <container id>
```

## Build Images

### Dockerfile

Build an image by writing a dockerfile.

```docker
# Pull base image, run it as a container and login to the container
FROM docker.io/library/tomcat:8.5.45

# Change directory and download the app
RUN cd /usr/local/tomcat/webapps/ ; wget <https://github.com/lerndevops/code/raw/main/sampleapp.war>

# Update apt cache
RUN apt-get update

# Install vim editor
RUN apt-get install -y vim

# Create a file named hello.txt
RUN touch /tmp/hello.txt
```

Creating a dockerfile from local files without downloading anything while creation. It is recommended to use the ADD instruction if you need to extract files. COPY will only copy the files but ADD will copy the extracted contents.

```docker
FROM ubuntu:18.04
COPY jdk-8u331-linux-x64.tar.gz /tmp
RUN tar -xzf /tmp/jdk-8u331-linux-x64.tar.gz -C /opt
RUN mv /opt/jdk1.8.0_331 /opt/java
RUN rm /tmp/jdk-8u331-linux-x64.tar.gz
ENV JAVA_HOME /opt/java
ENV JAVA_VERSION 1.8
ADD apache-tomcat-9.0.63.tar.gz /opt
RUN mv /opt/apache-tomcat-9.0.63 /opt/tomcat
ENV TOMCAT_HOME /opt/tomcat
ENV TOMCAT_VERSION 9.0.63
COPY myapp.war /opt/tomcat/webapps/
EXPOSE 8080
CMD ["$TOMCAT_HOME/bin/catalina.sh", "run"] # You cannot have more than one CMD in a Dockerfile as only the last CMD will be executed.
```

### `commit`

Commit changes inside a container as a new image.

```bash
docker commit -m "<msg>" <newimagename>:<tag>
```

### `ENTRYPOINT` vs `CMD`

Entrypoint is the default command executed when a docker container is run. This process cannot be replaced or overwritten.

CMD commands can be overwritten while executing a `docker run` process.

```docker
# Dockerfile with ENTRYPOINT
FROM ubuntu:18.04
ENTRYPOINT ["sleep", "6000"]
docker run -d mybuntu:entry . # Runs docker container with entrypoint
docker run -d mybuntu:entry sleep 900 . # Does not affect as ENTRYPOINT cannot be changed

docker build --file Dockerfile --tag myubuntu:entrypoint .
# Dockerfile with CMD
FROM ubuntu:18.04
CMD ["sleep", "6000"]
docker run -d myubuntu:cmd # Runs docker container with the CMD specified in the dockerfile.
docker run -d mybuntu:cmd sleep 900 . # Runs docker container with the new specifications replacing the original CMD
# Dockerfile with ENTRYPOINT and CMD
FROM ubuntu:18.04
ENTRYPOINT ["sleep"]
CMD ["6000"]
docker run -d myubuntu:entry-cmd . # Runs the docker container with the settings mentioned in dockerfile.
docker run -d myubuntu:entry-cmd 900 . # Replaces the CMD argument with 900 but still runs the sleep command as entrypoint is immutable.
```

### `USER`

The `USER` instruction will make the container use the specified user for any commands specified after the instruction.

```docker
# Dockerfile with USER
FROM ubuntu:18.04
RUN useradd -ms /bin/bash nyukeit # -m sets default directory for user, -s sets the default shell
USER nyukeit
RUN touch /tmp/hello.txt 
CMD ["sleep", "500"]

docker build --file Dockerfile --tag myubuntu:user . # Creates the image
docker run -d <containerid> # Creates the container
docker exec -it <containerid> /bin/bash # Will login as the USER instead of ROOT
```

### `WORKDIR`

Set the default working directory inside the container.

```docker
# Dockerfile with WORKDIR
FROM ubuntu:18.04
RUN mkdir /home/nyukeit
WORKDIR /home/nyukeit
RUN touch hello.txt # This file will now be created in /home/nyukeit instead of the root directory
```

## Multi-Stage Build

Multiple FROM statements in a single Dockerfile.

```docker
# Stage 1 of the build
FROM maven:3.6.3-jdk-8 AS stage1
RUN git clone <https://github.com/lerndevops/samplejavaapp>
WORKDIR /samplejavaapp
RUN mvn package

# Stage 2 of the build
FROM tomcat:8.5
WORKDIR /usr/local/tomcat/webapps/
COPY --from=stage1 /samplejavaapp/target/samplejavaapp.war .
```

Use Case:

In stage 1, docker will compile the entire webapp from source code and create a deployable .war file and a container which is separate from Stage 2. For further usage, we do not need to install Maven again, java again, compile and build the maven package again. If we use a single FROM instruction and use everything together, docker has to perform those steps everytime there is an update, which is unnecessary.

Once Docker is done with the Stage 1 steps, it discards that container and only works with the Stage 2 container.  This keeps the front-facing webapp container lean without needing the additional package installation, etc.

Usually, there are only two stages in a Dockerfile.

### Tag

Retag an image

```docker
docker tag sampleapp:v4 docker.io/nyukeit/dockertrial:sampleapp-v4
#                                 account repository  imagename tag
```

## Offline Image transfer

When there is no access to online repositories or locally hosted repositories.

### Save

```docker
# Generates a tarball with all the docker images included
docker save --output myimages.tar <image1> <image2> <image3> 
```

### Load

```docker
# Reloads images in another server
docker load --input myimages.tar
```

## Docker Cleanup

### Prune

```docker
# Remove all stopped containers
docker container prune

# Remove all images without running containers
docker image prune

# Prune entire docker system including images and containers, cache, etc
docker system prune
```

## Docker Local Registry

A docker container as a Docker Registry which is totally private.

```docker
# Pull the official Docker Registry image
docker pull registry:latest

# Create the registry container with a dedicated port
docker run -d -p 5000:5000 --restart always --name registry

# Tag local images to the docker Registry container
docker tag myimage:1 localhost:5000/nyukeit/myapp:1

# Push images
docker push localhost:5000/nyukeit/myapp:1

# Pull images
docker pull localhost:5000/nyukeit/myapp:1
```

## Docker Network

### List Networks

```docker
docker network ls

# Ouput
NETWORK ID     NAME      DRIVER    SCOPE
9dd7f68dd225   bridge    bridge    local
550b260adc35   host      host      local
2440bbbbab37   none      null      local
```

### Inspect Network

```docker
docker network inspect <network name/id>
```

### Create Network

- Custom bridge networks also enable container name resolution which means you could ping one container from another using the container name instead of ip address

```docker
# Docker used options
docker network create <network name>

# User defined settings
docker network create <name> --driver bridge --subnet <subnet ip> gateway <gateway ip>
```

### Join Network

```docker
docker run -d --name <cont> --network <networkname>
docker run -d --name <cont2> --network <networkname>

# These containers are now in a totally different network

docker exec cont1 ping cont2
# This should receive a response because name resolution is enabled in a custom network
```

### Connect Second Network

```docker
# This makes cont1 a part of 2 different networks, the default bridge and the custom bridge mynet.
docker network connect mynet cont1
```

### Disconnect Network

```docker
# This disconnects a container from a network
docker network disconnect mynet cont1
```

### None network

- Cannot be customized
- Cannot create a custom none network
- It means switching off all networking for the container, it becomes unreachable

```docker
docker run -d --name <cont> --network none

# When you do ifconfig on this container, it will only have the local loopback network 
```

### Host network

- Join a container to the host/vm network, outside of other container network.

```docker
docker run -d --name <cont> --network host

# Thsi runs the container as a process on the vm network and is directly accessible using the VM ip.
```

### Overlay Network

- Connect containers across hosts

## Docker Volumes

- Attach external storage to a container
- Makes data persistent
- Docker managed volumes are in /var/lib/docker/volumes - this is accessible only by root.

```docker
# List volumes
docker volume ls

# Create an empty volume
docker volume create <volumename>

# Attach a volume to a container
docker run -dP --mount type=volume,src=<volumename>,target=<pathinsidecontainer> <containername>:<tag>
# src = volumename/path on host
# target = path inside container
# type=volume = docker managed volume i.e. present in /var/lib/docker/volumes/<volumename>/_data 

Example
docker run -dP --mount type=volume,src=applogs,target=/usr/local/tomcat/logs tomcat:latest

# Another syntax
docker run -dP --volume <src>:<target> <containername>:<tag>
#Example
docker run -dP --volume applogs:/usr/local/tomcat/logs tomcat:latest
docker run -dP -v applogs:/usr/local/tomcat/logs tomcat:latest

# Map another directory as a src volume to a container, also called a Bind Mount, user managed volume.
mkdir /opt/nginxlogs
docker run -dP --mount type=bind,src=<volumepath>,target=<pathinsidecontainer> <containername>:<tag>
#Example
docker run -DP --moutn type=bind,src=/opt/nginxlogs,target=/var/log/nginx nginx:latest

# Mount multiple volumes
Use more than one mount agruments to attach multiple volumes.
docker run -dP --moutn type=bind,src=/opt/nginxlogs,target=/var/log/nginx --mount type=bind,src=/opt/nginxlogs,target=/var/log/nginx

# Bind volume with another syntax
docker run -dP -v <pathinsidevm>:<pathinsidecontainer> <containername>:<tag>
#Example
docker run -dP -v /opt/nginxlogs:/var/log/nginx nginx:latest
```

### `tmpfs`

Storage managed by Docker in memory. This is not persistent storage. It is deleted when the container is removed.

## Docker Daemon

The Docker service or more aptly, the Docker Engine, is called the Docker Daemon. 

- Docker Daemon is not connected to any network by default, but this can be enabled using the Remote API.

### Enable Docker Daemon Remote API

#### For Ubuntu 16.04 / 18.04 LTS

```bash
sudo vi /lib/systemd/system/docker.service
```

Add this line in the config file

```ini
# The port number can be anything of your choosing. You can allow specific IPs only instead of 0.0.0.0
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:4243
```

Restart Daemon

```bash
systemctl daemon-reload
```

Restart Docker Engine

```bash
sudo service docker restart
```

## Docker Storage Drivers

### Overlay2

- Supported on current Ubuntu and CentOS/RHEL versions
- Data is stored in the form of a file system (Filesystem Storage)
- Efficient use of memory
- Inefficient with write-heavy workload

### AuFS

- Supported with Ubuntu 14.04 or earlier
- Data is stored in the form of a file system (Filesystem Storage)
- Efficient use of memory
- Inefficient with write-heavy workload

### Devicemapper

Device Mapper is one of the Docker storage drivers available for some Linux distributions. it is the default storage driver for CentOS7 and earlier. We can customize Device Mapper configuration using the daemon config file. 

- Supported on CentOS 7 and earlier
- Data is stored in blocks (Block Storage)
- Efficient with write-heavy workloads

Device Mapper supports two modes:
#### loop-lvm

- Loopback machanism simulates an additional physical disk using files on the local disk.
- Minimal setup, does not require an additional storage device.
- Bad performance, suggested use only for testing.

#### ct-lvm mode: 

- Stores data on a separate device
- Requires and additional storage device.
- Good Performance, suggested to use for Production.

### Storage models 

Persistent data can be managed using several storage models. 
#### Filesystem Storage

- Data is stored in the form of a file system.
- Efficient use of memory
- Inefficient with write-heavy workloads

#### Block storage

- Stores data in blocks
- Efficient with write-heavy workloads

#### Object storage

- Stores data in an external object-based stored
- Application must be designed to use object-based storage.
- Flexible & scalable

### Customize Docker Daemon

Create a file named `daemon.json` in `/etc/docker`

#### Changing Docker Root Directory

You could change the root directory of Docker to another location if you are running out of disk space.

```json
{
  "data-root": "/new_dir_structure/docker"
}
```

#### Changing default logging driver

Add this in the `daemon.json` file

Options awslogs, fluentd, gcplogs, gelf, journald, json-file, local, logentries, splunk, syslog. These options can be found by doing `docker info`

```json
{
    "log-driver": "syslog"
}
```

Or, another way with options

```json
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "15m"
    }
}
```

#### Change storage driver

```json
{
    "storage-driver": "devicemapper"
}
```

#### Change Default Registry

```
{
	"registry-mirrors": ["https://<my-docker-mirror-host>"]
} 
```

#### Ssecure the docker daemon with TLS / SSL

```JSON
{
    "tlsverify": true,
    "tlscacert": "/home/certs/ca.pem",
    "tlscert": "/home/certs/server-cert.pem",
    "tlskey": "/home/certs/server-key.pem"
}
```

## Docker Content Trust (DCT)

By default, Docker allows users to download any images from Docker Hub. This can be a security vulnerability. To allow Docker to only pull trusted and signed images, enable Docker Content Trust:

```bash
export DOCKER_CONTENT_TRUST=1
```

## Docker Compose

- Can only create multiple containers on a single VM/machine. This does not help in high-availability as the redundancy is limited to only a single point of failure.
- They also create different port numbers for every container. This creates a problem for the load balancer.
- It is stateless, meaning, if the containers created by `compose` go down, it cannot bring them back up. 

### Service

Multiple containers from the SAME image.

```yaml
volumes:
  applogs: # $ docker volume create applogs
networks:
  mynet: # $ docker network create mynet --driver bridge
    #subnet:
    #gateway:
services:
  myapp: # Service 1 name, can be any string
    image: nginx:latest
    ports: # Array, since containers can have multiple services
      - 80 # -P or -p 8080:80
      - 443
    volumes:
      - applogs:/var/log/nginx # Docker managed volume (must be created first before using)
      - /opt/nconf:/usr/share/nginx/html	# Bind mount
    networks:
      - mynet # Needs to be created before being used
      - mynet1
    depends_on: # Needs mydb containers to be functional first
      - mydb
  mydb: # Service 2
    image: mongo
    ports:
      - 27017
    networks:
      - mynet
```

```bash
# Brings up one container each
docker compose --file compose.yaml up -d
```

```bash
# Brings up the suggested number of containers
docker compose --file compose.yaml up --scale myapp=5 --scale mydb=3 -d

# You can again pass this command by reducing the numbers
docker compose --file compose.yaml up --scale myapp=3 --scale mydb=1 -d

# Bring down the entire setup
docker compose --file compose.yaml down
```

## Docker Swarm

Docker's built-in container orchestration tool.

- Has a lower learning curve than Kubernetes
- Manages dynamic nature of the containers
- Provides the desired state configurations / auto-healing
- Enables request routing into multiple containers for High Availability

```bash
# Initialise Swarm on master node. Whichever machine this command is run becomes the master node.
docker swarm init
```

### Join Swarm

```bash
# Run on worker nodes to join the swarm
docker swarm join --token <token> 
```

```bash
# Regenerate the swarm join token for worker
docker swarm join-token worker
```

```bash
# Regenerate the swarm join token for manager
docker swarm join-token manager
```

### List Nodes

```bash
docker node ls
```

### Inspect Nodes

```bash
docker node inspect <nodename>
```

### Update Node Configuration

```bash
# Eg. here we add a label to a node, here 'role' is a key and 'app' is the value
docker node update <nodename/id> -- label-add role=app
```

### Leave Swarm

```bash
docker swarm leave --force
```

#### Remove Node from Swarm

```bash
docker node rm <workername> --force
```

> Note: This does not stop the node from still being active by itself and trying to report to the swarm. To make swarm inactive on the node, do a `docker swarm leave` on the node itself.

### Create Service

#### Replicated Mode

- Is the default mode for 
- Allows to create as many replicas as needed
- Run more than one container on any worker node in the cluster
- Scale up/scale down
- Can be used for front facing applications

```bash
# --mode replicated in effect
docker service create --name myapp --replicas 7 -p 9080:3000 id/repo:image-tag
```

#### Global Mode

- Creates number of replicas === number of nodes
- This creates only and only one container per node
- Is not scalable using docker service scale
- Automatically scales up or down if nodes are added or removed
- Can be used for applications like monitoring agents, anti-virus or logging agents (since there is barely a need for running multiple of these applications)

```bash
# Automatically creates same number of containers as nodes present in the Swarm

docker service create --name myapp --mode global -p 9080:3000 id/repo:image-tag
```

### List Services

```bash
docker service ls
```

### List Containers with Services

```bash
docker service ps <service name>
```

### Scaling

```bash
# Add more containers, there were 7 it will now add 5 more. It works for scaling down too.

docker service scale <servicename>=12
```

### Service Logs

```bash
docker service logs <servicename>
```

### Remove Services

```bash
docker service rm <servicename>
```

### Rolling Update

Continuously delivered updates instead of point release updates. Like Ubuntu 22.04 is a versioned point release update.

```bash
# To see all parameters
docker service update --help
```

```bash
# Rolling update
# Update parallelism 2 -> update 2 containers at a time (default is 1 if not set)
# Update delay 30s -> wait 30s between updates
# Update failure action rollback -> rollback any changes if update failed
# Update order start-first -> begins from the first container
# Not all parameters are mandatory

docker service update <servicename> --image id/repo:image-tag --update-parallelism 2 --update-delay 30s --update-failure-action rollback --update-order start-first
```

### Rollback Updates

```bash
docker service rollback
```

### Using Declarative YAML

Create a yaml file

```yaml
volumes:
  data:
  data-bkp:
networks:
  myoverlay:
services:
  springbootapp:
    image: lerndevops/samples:springboot-app
    deploy:
      replicas: 2
      placement:
        constraints:
          - node.labels.role==app
      restart_policy:
        condition: on-failure
      resources:
        limits:
          cpus: "0.2"
          memory: 512M
    ports:
      - "9090:8080"
    depends_on:
      - mongo
    networks:
      - myoverlay
  mongo:
    image: lerndevops/samples:mongodb
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.labels.role==db
      restart_policy:
        condition: on-failure
    ports: 
      - "27017:27017"
    volumes:
      - data:/data/db
      - data-bkp:/data/bkp
    networks:
      - myoverlay
```

### Deploy Stack

```bash
docker stack deploy -c <file.yaml> <stackname>
```

### List Stacks

```bash
docker stack ls
```

### List Containers in Stack

```bash
docker stack ps <stackname>
```

### List Services in Stack

```bash
docker stack services <stackname>
```

### Remove Stack

```bash
docker stack rm <stackname>
```

### List Services in a Service Stack

```bash
docker service ps <stackname>_<servicename>
```

## Docker Config

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

#### Create Config

```bash
docker config create <configname> <filename>.props
```

#### Inspect Config

```bash
docker config inspect <configname>
```

> Note: Docker stores this data in base64 format. To decode this data
>
> ```bash
> echo "encoded string" | base64 --decode
> ```

#### Apply Config

```bash
# Example of applying a config on service run

docker service create --name <svcname> --replicas 2 -p 9080:80 --config src=devdbconf,target=/opt/dbconf/db.props image:tag
```

## Secrets

- Any sensitive data is created as a secret

#### Create Secret

```bash
# You can use any file type as a secret, depending on what is required by your app
docker secret create <secretname> <file>
```

#### List Secrets

```bash
docker secret ls
```

#### Apply Secret

```bash
docker service create --name <svcname> --replicas 2 --secret src=testsec,target=/etc/secrets/dbsec.prop image:tag
```

## Multi-Master

- Multiple managers can join a swarm as manager
- One manager remains active, the remaining are passive
- Passive manager replaces active manager if it becomes passive
- Worker nodes still only interact with the active leader manager node
- It is suggested to have at least 3 manager nodes in a prod cluster for HA (as per the RAFT algorithm)

#### Join as a manager

```bash
docker swarm join-token manager
```

> Note: The second manager node is shown as 'Reachable' and not 'leader'

#### Promote an Existing Worker to Manager

```bash
docker node promote <nodename>
```

> Note: This command can be run from either manager nodes.

#### Demote an Existing Manager to Worker

```bash
docker node demote <nodename>
```

> Note: You cannot demote the leader node (for eg. from another manager node)

#### Raft Consensus Algorithm

- Built to orchestrate replicas in a distributed fashion

- It follows leader-election mechanism

- As per RAFT, to make a cluster HA, more than half of the managers should be available/ready/online

- **Failover Threshold** - the number of managers that can fail while still keeping the cluster accessible

  | Managers | Failover Threshold |
  | -------- | ------------------ |
  | 1        | 0                  |
  | 2        | 0                  |
  | 3        | 1                  |
  | 4        | 1                  |
  | 5        | 2                  |

> Explanation: If we have only a 1 manager cluster and if it goes down, then the number of managers available are 0. The failover threshold still remains 0 in a 2 clusters setup (1 going down, 1 left, which is not more than half). This makes a 3 manager cluster a minimum suggested HA requirement.
>
> Notice in a 4 manager cluster, if 1 manager goes down, we still have HA. But if the second manager goes down, we are left with 2, which is not more than half (it's exactly half not more). Which means our threshold is still 1. Due to this, having a 4 master cluster is no different than a 3 master cluster. This means you can have odd number managers. Most common are 3 or 5. 7 is overkill.

- Whichever node has the latest config sync will be elected as the manager

## Docker EE

Is provided by an organisation called Mirantis.

### Universal Control Plane

- Comes with a GUI
- Called the Universal Control Plane (also called Mirantis Kubernetes Engine)
- This is the manager node

### Docker Trusted Registry

- Worker node
- Also called Mirantis Secure Registry
- It is like a private version of Docker Hub
- Must be a part of the Swarm cluster, in one of the worker node
