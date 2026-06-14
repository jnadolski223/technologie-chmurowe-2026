# Technologie chmurowe 2026 — Task Manager

## Instrukcja instalacji monitoringu
Przed przystąpieniem do instalacji upewnij się, że narzędzie Kubernetes i Helm są zainstalowane.
```shell
kubectl version
helm version
```

### Krok 1 — Dodaj repozytorium `prometheus-community`
Wykonaj poniższe polecenia w celu dodania repozytorium `prometheus-community`.
```shell
# Dodaje repozytorium
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Aktualizuje repozytorium
helm repo update
```

### Krok 2 — Zainstaluj zestaw monitoringu
Zainstaluj zestaw monitoringu w dedykowanej przestrzeni nazw.
```shell
# Tworzy nową przestrzeń nazw
kubectl create namespace monitoring

# Instaluje release monitoringu
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring -f k8s/monitoring/values.yaml
```
Instalacja całego zestawu może zająć kilka minut. Poczekaj, aż release będzie w statusie `deployed`, a wszystkie Pody
będą w statusie `Running`. Wykonaj poniższe polecenia, aby sprawdzić statusy.
```shell
# Sprawdza status release
helm list -n monitoring

# Sprawdza statusy Podów
kubectl get pods -n monitoring
```

### Krok 3 — Dostęp do narzędzia Prometheus
Aby uzyskać dostęp do narzędzia Prometheus, wykonaj poniższe polecenie.
```shell
kubectl port-forward -n monitoring service/monitoring-kube-prometheus-prometheus 9090:9090
```
Prometheus jest dostępny pod adresem URL http://localhost:9090.

### Krok 4 — Dostęp do narzędzia Grafana
Aby uzyskać dostęp do narzędzia Grafana, wykonaj poniższe polecenie.
```shell
kubectl port-forward -n monitoring service/monitoring-grafana 3000:80
```
Grafana jest dostępna pod adresem URL http://localhost:3000.  
Dane logowania do Grafany:
- Login: `admin`
- Hasło: `admin123`

### Krok 5 — Konfiguracja dashboardu Grafany
W interfejsie Grafany należy zaimportować gotowy dashboard dla Kubernetesa.  
Instrukcja konfiguracji:
1. Kliknij **Dashboards** w lewym menu.
2. Kliknij **New** i wybierz opcję **Import**.
3. W polu **Find and import dashboards for common applications at grafana.com/dashboards** wpisz ID dashboardu: `20372`.
4. Kliknij **Load**.
5. W polu **DS_PROMETHEUS** wybierz dostępne źródło danych.
6. Kliknij **Import**.
