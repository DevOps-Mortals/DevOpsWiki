## Key Features

1. Infrastructure as a code
2. Execution Plans → make dry runs without committing
3. Resource Graphs → see a list of resources that are created/provisioned using Terraform
4. Change Automation → changes to the configuration file post-execution are re-implemented

## Concepts

### Input Variables

- Key-value pairs used by Terraform module

### Provider

- Plugins used by Terraform to interact with the APIs of the services & access related resources

### Module

- Folder that contains the TF templates/configuration files are stored
- Configuration for provisioning resources are stored here

### State

- Cached information about the infrastructure managed by TF

### Resources

- Refers to a block of one or more infrastructure object like compute, storage, network, etc
- used in configuring and managing the infra

### Data Source

- Implemented by the providers
- Return information on external objects that can be managed by TF

### Output Values

- Return values of TF modules
- Can be used by other configurations

## Lifecycle

4 Stages of the Terraform Lifecycle process

### `init`

```
terraform init
```

- Initialise Terraform inside a folder

### `plan`

```
terraform plan
```

- A Dry run stage. It is a preview of the changes before they are actually applied

### `apply`

```
terraform apply
```

- Provisioning of actual resources and bringing the actual state to desired state

### `destroy`

```
terraform destroy
```

- Remove resources that were provisioned

## Terraform Core

- The actual TF application
- Communicates with plugins using remote procedure calls (RPC)
- Reading & interpolating the config files and modules
- Resource state management
- Construction of the Resource Graph
- Executing Plans

### Terraform Configuration Files

- .tf or .tf.json files

### Terraform State

- .tfstate files

## Terraform Plugins

### Providers

- Providers for specific technologies or platforms (Eg. Amazon AWS, Microsoft Azure, Google Cloud)
- Authentication with the infra provider will be handled by the provider plugin
- Defines the resource maps

### Provisioners

- Execute commands or scripts on resources after creation or before destruction

- For eg. for configuration after creation of a resource

  - **Creation-time Provisioners** → Default, executed after the creation of a resource

  - **Destroy-time Provisioners** → executed before the destruction of a resource

    `when = destroy` → key to be added to make it a destroy provisioner

- Failure Behavior

  - `on_failure = continue` → ignore the status of provisioner execution
  - `on_failure = fail` → use the status of the provisioner execution (default behavior)

- Types of Provisioners

  - Generic

    - **File** → copy files / directories from your TF machine to the newly created resource

      For eg. copy public key of host machine to remote machine - for password-less ssh

      *Arguments:* `source`, `destination` , `content`

    - **Local-exec** → used to invoke a local executable on the resource after creation / before destruction

      For eg. execute [Ansible](https://www.notion.so/Ansible-3f3854950fbf43869fb64ecb36b2502c) commands to perform configuration changes

      ```
      # Creating a resource with local-exec
      
      resource "null_resource" "myrss" {
        provisioner "local-exec" {
          command = "echo ${var.owner} > file_${null_resource.myrss.id}.txt"
        }
      }
      
      resource "null_resource" "myrss1" {
        provisioner "local-exec" {
          command = "echo ${var.owner} > file_${self.id}.txt"
        }
      }
      ```

      *Arguments:* command, working_dir, interpreter

    - **Remote-exec** → invoke a script i the remote resource after creation, requires a connection block

      *Arguments:* `inline`, `script`, `scripts`

      ```bash
      # Example of Remote-exec
      locals {
        ami_id = "ami-08fdec01f5df9998f"
        vpc_id = "your-vpc-id"
        ssh_user = "ubuntu"
        key_name = "Demokey"
        private_key_path = "/home/labsuser/remoteexec/Demokey.pem"
      }
      
      provider "aws" {
        access_key = "your-access-key"
        secret_key = "your-secret-key"
        token = "your-token"
        region = "us-east-1"
      }
      
      resource "aws_security_group" "demoaccess" {
        name = "demoaccess"
        vpc_id = local.vpc_id
        
        ingress {
          from_port = 80
          to_port = 80
          protocol = "tcp"
          cidr_blocks = ["0.0.0.0/0"]
        }
      
        ingress {
          from_port = 22
          to_port = 22
          protocol = "tcp"
          cidr_blocks = ["0.0.0.0/0"]
        }
      
        egress {
          from_port = 0
          to_port = 0
          protocol = "-1"
          cidr_blocks = ["0.0.0.0/0"]
        }
      }
      
      resource "aws_instance" "web" {
        ami = local.ami_id
        instance_type = "t2.micro"
        associate_public_ip_address = true
        vpc_security_group_ids = [aws_security_group.demoaccess.id]
        key_name = local.key_name
        
        tags = {
          Name = "Demo test"
        }
      
        connection {
          type = "ssh"
          host = self.public_ip
          user = local.ssh_user
          private_key = file(local.private_key_path)
          timeout = "4m"
        }
      
        provisioner "remote-exec" {
          inline = [
            "touch /home/ubuntu/demo-file-from-terraform.txt"
          ]
        }
      }
      
      output "instance_ip" {
        value = aws_instance.web.public_ip
      }
      ```

## Terraform Registry

https://registry.terraform.io

- A central repository for publicly available Terraform Providers, modules, policy libraries and run tasks
- Hosts Providers for the majority of the infrastructure providers

```go
# Example Terraform configuraton file
provider "aws" {
	access_key = "your_access_key"
	secret_key = "your_secret_key"
	token = "your_access_token"
	region = "us-east-1"
}

resource "aws_instance" "terraf" {
	ami = "ami-08fdec01f5df9998f"
	instance_type = "t2.micro"
}

resource "aws_security_group" "demoaccess" {
  name = "demoaccess"
  vpc_id = local.vpc_id
  
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

resource "aws_instance" "web" {
  ami = local.ami_id
```

## Variables & Outputs

### Input Variables

Used to provide parameters to a terraform module. These are like function arguments.

Arguments

- default
- type
- description
- validation
- sensitive
- nullable

```bash
# Defining a variable

variable "names" {
  description = "Just a list of names"
  type = list(string)
  default = ["bob", "kevin", "stewart"]
}

output "test_upper" {
  value = [for name in var.names : upper(name)]
}

# Output
test_upper = [
  "BOB",
  "KEVIN",
  "STEWART",
]

# To change default values and pass your own variables
terraform apply -var='names=["user1", "user2", "user3", "user4"]

# Output
test_upper = [
  "USER1",
  "USER2",
  "USER3",
	"USER4"
]

# Using a terrafor variables file
nano myvariables.tfvars
names = ["user4", "user5", "user6", "user7"]

# Output
test_upper = [
  "USER4",
  "USER5",
  "USER6",
  "USER7",
]
```

### Output Values

These are the return values of the terraform module. These are similar to return values of functions.

Arguments

- Description
- sensitive
- depends_on

```bash
# Declaring output values

output "instance_ip_addr" {
	my_ip = aws_instance.my_ec2.private_ip
}

# General Format
module.modulename.outputidentifier
```

### Local Values

Expressions or values set within the same configuration file. These are like temporary local variables within a function. Local can be called only inside the .tf file in which it is created, as opposed to vars which can be globally called.

```bash
# Declaring local values

locals {
	common_tags = {
		name = "My Server"
		owner = "Owner"
	}
}

# Using the local value

resource "aws_instanc" "myec2" {
	ami = ""
	instance_type = "t2.micro" 
	tags = local.common_tags
}
```

## Types & Values

- strings
- numbers
- boolean
- lists and tuples
- map → Dictionary
- null → absence of value

## Loops

### `count`

- To loop over resources
- meta-argument
- can only use either count or for_each expression within a resource block or module block
- Get the current index by using count.index starting with 0 index.

```bash
# Example of using count

locals {
  names = ["bob","kevin","stewart"]
}

resource "null_resource" "named" {
  count = length(local.names)
  triggers = {
    myname = local.names[count.index]
  }
}

output "testname" {
  value = null_resource.named
}

# Output

testname = [
  {
    "id" = "2217760068405460324"
    "triggers" = tomap({
      "myname" = "bob"
    })
  },
  {
    "id" = "5118553875256902688"
    "triggers" = tomap({
      "myname" = "kevin"
    })
  },
  {
    "id" = "3931741192652813776"
    "triggers" = tomap({
      "myname" = "stewart"
    })
  },
]
```

### `for_each`

- Loop over resources and inline blocks within a resource
- Only supports sets or maps as input
- `toset()` → built-in function to convert lists to sets
- If input is set → each.value for individual value
- If input is map → each.key & each.value

```bash
# Example of using for_each loop

locals {
  names = ["bob","kevin","stewart"]
}

resource "null_resource" "named" {
  for_each = toset(local.names)
  triggers = {
    myname = each.value
  }
}

output "testname" {
  value = null_resource.named
}

# Output

testname = [
  {
    "id" = "2217760068405460324"
    "triggers" = tomap({
      "myname" = "bob"
    })
  },
  {
    "id" = "5118553875256902688"
    "triggers" = tomap({
      "myname" = "kevin"
    })
  },
  {
    "id" = "3931741192652813776"
    "triggers" = tomap({
      "myname" = "stewart"
    })
  },
]
```

### `for`

```bash
[for <item> in <list> : <output>]

# item -> local variable name to assign to each item in the list
# Creating a Security Group in AWS using Terraform Loops
VPC-ID = vpc-0341fb1ef5313ca4f

provider "aws" {
  access_key = ""
  secret_key = ""
  token = ""
  region = "us-east-1"
}

locals {
  ingress_rule = [{
    port = 443
    description = "Port 443 desc"
  },
  {
    port = 80
    description = "Port 80 desc"
  }]
}

resource "aws_security_group" "main" {
  name = "foo"
  vpc_id = "vpc-0341fb1ef5313ca4f"
  
  dynamic "ingress" {
    for_each = local.ingress_rule

    content {
      description = ingress.value.description
      from_port = ingress.value.port
      to_port = ingress.value.port
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
  
  tags = {
    Name = "New Security Group"
  }
}
```