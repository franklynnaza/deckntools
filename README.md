# Deckntools — E-Commerce Platform (Terraform-Provisioned)

A materials and tools e-commerce platform with an admin dashboard for product and category management, deployed entirely via Infrastructure as Code.

## Live Demo

Demo available on request — infrastructure is spun up on demand rather than kept running continuously.

## Tech Stack

**Frontend/Backend:** Next.js (full-stack — API routes + server-rendered pages)
**Database:** MongoDB Atlas
**Container Registry:** AWS ECR
**Infrastructure as Code:** Terraform
**CI/CD:** GitHub Actions
**Reverse Proxy / SSL:** Nginx, Let's Encrypt (Certbot)
**Infrastructure:** AWS (EC2, ECR, Security Groups — all provisioned via Terraform)

## Architecture

```
GitHub Push ---GitHub Actions (CI/CD) ---- Build app image --> AWS ECR
                                        
                                terraform apply
                                        |
                                AWS EC2 (auto-provisioned)
                                |___ Docker installed automatically via user_data
                                |___ App container (pulled from ECR)
                                |___ Nginx (reverse proxy, SSL termination)
                                        |
                                MongoDB Atlas
                                        |
                                Custom domain with HTTPS
```

## Deployment Highlights

- **Infrastructure as Code** — the EC2 instance, security group, and ECR repository are all defined in Terraform, not manually created through the AWS console
- **Automatic bootstrapping** — Terraform's `user_data` script installs Docker on the server automatically on first boot, so no manual SSH setup is required before deploying the app
- **Automated CI/CD** — every push to `main` triggers GitHub Actions to build and push a new Docker image to AWS ECR, tagged by build number
- **Reproducible environment** — the entire infrastructure can be torn down and rebuilt identically with two commands:
  ```bash
  terraform destroy
  terraform apply
  ```
- **Reverse proxy + SSL** — Nginx forwards traffic to the app container, with a free Let's Encrypt certificate providing HTTPS on a custom subdomain

## Local Development Setup

### Prerequisites
- Node.js (>=18)
- MongoDB connection (Atlas or local)

```bash
npm install --legacy-peer-deps
```

Create a `.env` file:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=<your-secret>
```

```bash
npm run dev
```

## Infrastructure Deployment (Terraform)

### 1. Configure variables — `terraform.tfvars`
```hcl
key_pair_name = "<your-ec2-key-pair>"
```

### 2. Set AWS credentials
```bash
export AWS_ACCESS_KEY_ID="<key>"
export AWS_SECRET_ACCESS_KEY="<secret>"
export AWS_DEFAULT_REGION="us-east-2"
```

### 3. Provision infrastructure
```bash
terraform init
terraform plan
terraform apply
```

Outputs the new EC2 instance's public IP and the ECR repository URL.

### 4. Deploy the app on the server
```bash
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-2.amazonaws.com
docker compose up -d
```

### 5. Set up HTTPS
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## Core Features

- Product catalog across categories (Decking, Lumber, Fasteners, Tools, Accessories)
- Admin dashboard for adding and managing products
- Admin authentication with a secure first-run setup script
- Category-based browsing

## What I Learned / Debugged

- Fixed a Terraform IAM permissions gap where the deployment user lacked EC2 read/write access, initially set up for ECR-only actions
- Diagnosed a Terraform key pair region mismatch — key pairs are region-specific, and the wrong region caused a silent "key pair does not exist" failure
- Fixed a Terraform security group replacement bug — changing a resource's `description` field forces AWS to destroy and recreate it, which hung indefinitely while the resource was still attached to a running instance
- Resolved manually-added AWS Console firewall rules being reverted by `terraform apply`, by codifying them permanently into the Terraform configuration
- Fixed broken CSS caused by a hardcoded local root URL, replaced with a relative path suited to containerized deployment
- Diagnosed a MongoDB connection failure caused by an unencoded special character in the database password within the connection string

## License

MIT
