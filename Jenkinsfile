def dockerArtifactoryTag = env.BRANCH_NAME == "master" ? "latest" : "${env.BRANCH_NAME}".replaceFirst(/^.*\//, "")
def dockerArtifactoryPush = env.BRANCH_NAME == "master"

pipeline {

    environment {
        PROJECT_NAME = "cutting-room-admin-cutting-room-production-process"
        DOCKER_IMAGE_NAME = "cutting-room-admin-cutting-room-production-process"
        K8S_NAMESPACE = "cutting-room-admin"
        DNS_PREFIX = "cutting-room-production-process"
    }
    
    parameters {
        string(name: 'ADD_ON_MAX_TRY', defaultValue: '30', description: 'maxTry value')
        booleanParam(name: 'RECORD_ANIMATION', defaultValue: false, description: 'Record video of tests (increases test duration !)')
    }

    agent {
        label 'docker&&linux'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '5'))
        disableConcurrentBuilds()
        skipDefaultCheckout()
    }
    
    stages {

        stage("checkout") {
            steps {
                cleanWs()
                checkoutScm()
                postGitLabStatus("running")
                stash includes: 'ltf/**', name: 'ltf', allowEmpty: true
            }
        }

        stage("build") {
            steps {
                jenkinsAlert(env.JOB_NAME, "build") {
                    script {
                        dockerArtifactoryImageName = dockerBuild(
                            imageName : "${env.DOCKER_IMAGE_NAME}",
                            version : "${dockerArtifactoryTag}",
                            registry : DockerEnvironment.ARTIFACTORY_REGISTRY_JENKINS,
                            push : "${dockerArtifactoryPush}",
                            multiStage : true,
                            insideReportPath : "/usr/app/reports"
                        )
                    }
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'multi-stage-reports/*test-results.xml'
                    coberturaPublisher 'multi-stage-reports/*-coverage/cobertura-coverage.xml'
                }
            }
        }

        stage("push-to-azure") {
            when { branch 'master' }
            steps {
                jenkinsAlert(env.JOB_NAME, "build") {
                    script {
                        dockerAzureImageName = dockerTag (
                            srcFullImageName : dockerArtifactoryImageName,
                            targetImageName : "${env.DOCKER_IMAGE_NAME}",
                            version : "${env.BUILD_NUMBER}",
                            registry : DockerEnvironment.AZURE_REGISTRY
                        )
                    }
                }
            }
        }

        stage("deploy dev") {
            when { branch 'master' }
            steps {
                jenkinsAlert(env.JOB_NAME, "build") {
                    helmDeploy(
                        k8sEnv : K8sEnv.DEV,
                        namespace : "${env.K8S_NAMESPACE}", 
                        dockerImageName : dockerAzureImageName, 
                        type : "WEBAPP",
                        doHealthCheck : true,
                        dnsPrefix : "${env.DNS_PREFIX}",
                    )
                }
            }
        }

        stage("ui-tests") {
            agent {
                label 'ltf-unlocked-session||admin-jnlp-unlocked'
            }
            when {
                beforeAgent true
                branch 'master'
            }
            steps {
                cleanWorkspace()
                jenkinsAlert(env.JOB_NAME, "ui-tests") {
                    unstash 'ltf'
                    withEnv(loadPropertiesFromFile("ltf/ltf.properties")) {
                        dir("ltf") {
                            runUITests(
                                appUrl : "https://${env.DNS_PREFIX}.dev.mylectra.com",
                                group : "${env.LTF_GROUP}",
                                maxTry : "${ADD_ON_MAX_TRY}",
                                recordAnimation : "${RECORD_ANIMATION}"
                            )
                        }
                    }
                    archiveArtifacts 'ltf/*.html,ltf/*.ldc'
                }
            }                  
        }
/*
        stage("deploy test") {
            when { branch 'master' }
            steps {
                jenkinsAlert(env.JOB_NAME, "build") {
                    helmDeploy(
                        k8sEnv : K8sEnv.TEST,
                        namespace : "${env.K8S_NAMESPACE}", 
                        dockerImageName : dockerAzureImageName, 
                        type : "WEBAPP",
                        doHealthCheck : true,
                        dnsPrefix : "${env.DNS_PREFIX}"
                    )
                }
            }
        }

        stage("deploy prod") {
            when { branch 'master' }
            steps {
                jenkinsAlert(env.JOB_NAME, "build") {
                    helmDeploy(
                        k8sEnv : K8sEnv.PROD,
                        namespace : "${env.K8S_NAMESPACE}", 
                        dockerImageName : dockerAzureImageName, 
                        type : "WEBAPP",
                        doHealthCheck : true,
                        dnsPrefix : "${env.DNS_PREFIX}",
                        k8sSecretFolder : "cutting-room-production-process"
                    )
                }
            }
        }
*/
    }

    post {
        success {
            cleanWs()
            postGitLabStatus("success")
        }
    }
}