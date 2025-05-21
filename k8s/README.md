# K8s for recoit #

For apply any kind of entity %filename%, run:

```bash
kubectl apply -f %filename% --namespace recoit
```

## Before first deploy ##

Create token for jenkins agent

```bash
kubectl create token jenkins-agent --namespace recoit ----duration=8760h
```

and paste it to jenkins credentials. Label it as `recoit-k8s-secret`
