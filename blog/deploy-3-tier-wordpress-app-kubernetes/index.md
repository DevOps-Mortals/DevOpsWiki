---
slug: deploy-3-tier-wordpress-app-kubernetes
title: How to Deploy a 3-Tier WordPress App with Kubernetes & NFS
date: 2023-05-02T13:00
authors: nyukeit
tags: [Kubernetes, WordPress, MySQL, NFS]
---

# Introduction

In this project, we will deploy a WordPress application which uses a MySQL database using Network File System on a 3 node Kubernetes cluster. This tutorial assumes `kubeadm`, `kubectl`, `kubelet` and `docker` are already installed and updated.

> Although I prefer to use CRI-O, we will use Docker because the project demands so.

##  To-Do

1. Deploy WP application using the Kubernetes dashboard. 
2. Create a user (service account) with the name of Sandry and make sure to assign her an admin role. 
3. WordPress and MySQL Pods should use node3 as an NFS storage server using static volumes. 
4. WordPress applications must verify the MySQL Service before getting it deployed. If the MySQL Service is not present, then the WordPress Pod should not be deployed. 
5. These all should be restricted to the namespace called `cep-project1` and must have 3 SVCs, and 3 Pods as a max quota. 
6. All sensitive data should be used using secrets and non-sensitive data using configmaps.

## Versions

**Kubernetes** : 1.27.1

**Docker** : 23.0.1

**WordPress** : 6.0.1

**MySQL** :

# WordPress

 kubeadm join 10.0.2.15:6443 --token xv3mtm.60j2vbpays0akiye \
        --discovery-token-ca-cert-hash sha256:ab02d6162c4a88eaacafb8649abe7299d43f00b470093bd5d727a52a5285d74c