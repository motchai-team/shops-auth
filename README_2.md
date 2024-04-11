# private cluster postgres on k8s

### https://postgres-operator.readthedocs.io/en/latest/user/#manifest-roles

```python
- k port-forward svc/postgres-operator-ui 8088:80 -n postgres-operator
=> admin operator ui

- kubectl port-forward pg-db-0 6432:5432 -n default
=> DATABASE_URL=postgres://postgres:9bAY41NIdfLMjHWxuoJIqCJNpfbvgntA1lHa302gk2l9LMUBciLTSTWvM3DyGdSh@localhost:6432/db_name

```
