# ИНСТРУКЦИЯ

# Зависимости
- https://nodejs.org/en/
- docker
- docker-compose
- kubectl
- helm

# Локальный запуск только для разработки
- npm i
- npm run dev:env - дождаться запуска контейнеров
- npm run dev:start - запуск всех процессов
- http://localhost:9000/

# Задачи и требования
- докеризировать проект, нужны контейнеры front, api, worker
- запустить локально k8s (любой дистрибутив)
- создать helm chart для развертывания приложения в k8s
- создать pipeline в gitlab'e для сборки образов и автодеплоя в k8s через helm
- реализовать readinessProbe для api и worker (GET /healthcheck = HTTP 200)
- helm должен запускаться с аргументом --wait и ждать успешный запуск всего окружения
- вся инфраструктура по проекту должна быть в репозитории


# Выполненные действия
- проект докеризирован, в /docker пресутсвуют  Докерфайлы:
- front - используется multi-stage, на первом этапе сборка на втором запуск на базе nginx, конфиг храниться src/frontend/nginx.conf. помимо веб сервера          используется проксирование на api.
- api и wroker стоит тоже сделать multi-stage чтоб не копировать все, но т.к. неизвестны зависимости просто происходит запуск api и wroke по отдельности.   Проверено на 10ой версии node.js на 14 worker даже не пытается связаться c db
- для удобства добавлен docker-compose-background.yaml для развертывания db, broker, cache отличается от того ч в ./env наличием hostname для локальной маршрутизации. Так же docker-compose-app.yaml для развертывания front, api, worker так же с hostname
- создан helm chart для развертывания приложения в k8s, в charts_hand_deploy присутствуют background-charts для db, broker, cache опять-таки для удобства тестирования. Так же app-charts для деплоя front, api, worker (реализован readinessProbe для api и worker (GET /healthcheck = HTTP 200))
- создан pipeline .gitlab-ci.yml для сборки и размещения образов в registry,  так же запуск helm chart используя переменные окружения размещен charts/app-charts/
ПРОБЛЕМЫ:
- тестировалось в гитлабе развернутом на виртуалке, там не удалось подружить gitlab и gitlab container registry эту часть пайплайна проверить не удалось
- при попытке залогиниться на dockerhub Error: Cannot perform an interactive login from a non TTY device, не принимает, так как это скрипт а не интерактивный режим

В гитлаб необходимо передать переменные:
KUBE_CONFIG должен содержать данные для подключения к куберу, лучше передавать в закодированном в виде base64 -w0 а иначе переносы строк теряются, в пайплане используется декодинг base64 -d

RABBITMQ_HOST=amqp://rabbitmqhost
PG_HOST=pghost
PG_PORT=5432
PG_USER=postgres
PG_PASS=mysecretpassword
PG_DB=postgres
REDIS_HOST=postgreshost
REDIS_PORT=6379
API_PORT=3000
WORKER_PORT=5000
FRONT_PORT=9000

используется для деплоя без предварительной сборки
API_IMAGE=danilovaleksey92/tages-api:1.0.0
WORKER_IMAGE=danilovaleksey92/tages-worker:1.0.0
FRONT_IMAGE=danilovaleksey92/tages-front:1.0.0
DOCKER_TAG=1.0.0

если при отсутствии gitlab container registry
MY_REGISTRY=danilovaleksey92
MY_REGISTRY_PASS=**********
