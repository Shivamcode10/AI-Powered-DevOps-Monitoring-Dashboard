Write-Host "🚀 Starting Kubernetes Project..." -ForegroundColor Green

# 1. Check cluster
kubectl get nodes

# 2. Install Ingress (if not installed)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

# 3. Wait for ingress
kubectl wait --namespace ingress-nginx `
  --for=condition=ready pod `
  --selector=app.kubernetes.io/component=controller `
  --timeout=120s

# 4. Apply project
kubectl apply -f k8s/

# 5. Restart deployments (important for fresh start)
kubectl rollout restart deployment auth-deployment
kubectl rollout restart deployment booking-deployment
kubectl rollout restart deployment ai-deployment

# 6. Show pods
kubectl get pods

Write-Host "✅ Project Started Successfully!" -ForegroundColor Green
Write-Host "🌐 Open: http://localhost"