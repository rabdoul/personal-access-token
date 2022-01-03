def dockerArtifactoryTag = env.BRANCH_NAME == "master" ? "latest" : "${env.BRANCH_NAME}".replaceFirst(/^.*\//, "")
def dockerArtifactoryPush = env.BRANCH_NAME == "master"
String namespace = "cutting-room-admin";
String lectraChartVersion = "1.0";

pipeline {

    environment {
        COMPONENT_NAME = "cutting-room-production-process"
        PROJECT_NAME = "cutting-room-production-process"
        DOCKER_IMAGE_NAME = "cutting-room-admin-cutting-room-production-process"
        DNS_PREFIX = "cutting-room-production-process"
    }
    
    parameters {
        string(name: 'ADD_ON_MAX_TRY', defaultValue: '30', description: 'maxTry value')
        booleanParam(name: 'RECORD_ANIMATION', defaultValue: false, description: 'Record video of tests (increases test duration !)')
    }

    triggers {
        cron(env.BRANCH_NAME == "master" ? "H 19 * * *" : "")
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
                jenkinsAlert(env.COMPONENT_NAME, "build") {
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
                jenkinsAlert(env.COMPONENT_NAME, "push-to-azure") {
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

        stage ("Dry Run Deploy DEV") {
            when { not { anyOf { branch 'master' } } }
            steps {
                jenkinsAlert(env.PROJECT_NAME, "Dry run Deploy DEV") {
                    helmV3Deploy(
                        k8sEnv: K8sEnv.DEV_MAIN,
                        namespace: namespace,
                        dockerImageName: dockerArtifactoryImageName,
                        lectraChartVersion: lectraChartVersion,
                        projectName: "${env.PROJECT_NAME}",
                        cName : "${env.DNS_PREFIX}",
                        type : "WEBAPP",
                        doHealthCheck : true,
                        dryRun: true
                    )
                }
            }
        }

        stage("deploy dev") {
            when { branch 'master' }
            steps {
                jenkinsAlert(env.COMPONENT_NAME, "deploy dev") {
                    helmV3Deploy(
                        k8sEnv: K8sEnv.DEV_MAIN,
                        namespace: namespace,
                        dockerImageName: dockerAzureImageName,
                        lectraChartVersion: lectraChartVersion,
                        projectName: "${env.PROJECT_NAME}",
                        cName : "${env.DNS_PREFIX}",
                        type : "WEBAPP",
                        doHealthCheck : true
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
                jenkinsAlert(env.COMPONENT_NAME, "ui-tests") {
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

        stage("deploy test") {
            when { branch 'master' }
            steps {
                jenkinsAlert(env.COMPONENT_NAME, "deploy test") {
                    helmV3Deploy(
                        k8sEnv: K8sEnv.TEST_MAIN,
                        namespace: namespace,
                        dockerImageName: dockerAzureImageName,
                        lectraChartVersion: lectraChartVersion,
                        projectName: "${env.PROJECT_NAME}",
                        cName : "${env.DNS_PREFIX}",
                        type : "WEBAPP",
                        doHealthCheck : true
                    )
                }
            }
        }

        stage("deploy prod") {
            when { branch 'master' }
            steps {
                jenkinsAlert(env.COMPONENT_NAME, "deploy prod", SlackChannel.PROD) {
                    helmV3Deploy(
                        k8sEnv : K8sEnv.PROD_MAIN,
                        namespace : namespace, 
                        dockerImageName : dockerAzureImageName, 
                        cName : "${env.DNS_PREFIX}",
                        type : "WEBAPP",
                        doHealthCheck : true,
                        k8sSecretFolder : "${env.COMPONENT_NAME}"
                    )
                }
                notifySuccess(env.COMPONENT_NAME, "deploy prod", SlackChannel.PROD)
            }
        }
    }

    post {
        success {
            cleanWs()
            postGitLabStatus("success")
        }
    }
}