#!/bin/bash -ex

function helm-upgrade {
    cd kubernetes/
    test -e metadata-values.yaml || touch metadata-values.yaml
    cp ${TLS_CRT} ${PROJECT_NAME}/tls.crt
    cp ${TLS_KEY} ${PROJECT_NAME}/tls.key
    helm upgrade \
        ${1:---install} \
        --force \
        --wait \
        --kube-context ${KUBERNETES_CONTEXT} \
        --namespace ${KUBERNETES_NAMESPACE} \
        --set Env=${DEPLOY_ENV} \
        --set DockerImage=${DOCKER_IMAGE} \
        --values metadata-values.yaml \
        ${PROJECT_NAME} \
        ${PROJECT_NAME}
}

"$@"
