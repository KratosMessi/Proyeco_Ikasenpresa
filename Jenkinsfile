pipeline{
    agent{
        label "jenkins-agent"
    }
    tools {
        jdk 'Java17'
        maven 'Maven3'
    }
    environment {
        APP_NAME = 'Proyeco_Ikasenpresa'
        RELEASE = '1.0.0'
        DOCKER_USER = 'kratosmessi1'
        DOCKER_PASS = 'dockerhub'
        IMAGE_NAME = '${DOCKER_USER}/${APP_NAME}'
        IMAGE_TAG = '${RELEASE}-${BUILD_NUMBER}'
    }

    stages{
        stage("Cleanup Workspace"){
            steps {
                cleanWs()
            }

        }
    
        stage("Checkout from SCM"){
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/KratosMessi/Proyeco_Ikasenpresa'
            }

        }
        stage("Build Application"){
            steps {
                sh "mvn clean package"
            }

        }
        stage("Test Application"){
            steps {
                sh "mvn test"
            }

        }
        stage("Analisis Sonarqube"){
            steps {
                script{
                    withSonarQubeEnv(credentialsID: 'jenkins-sonarqube-token'){
                        sh "mvn sonar:sonar"
                    }
                }
            }
        }
        stage("Portal de calidad"){
            steps {
                script{
                    waitForQualityGate abortPipeline: false, credentialsID: 'jenkins-sonarqube-token'
                }
            }
        }
        stage("Docker Image, Build y Push"){
            steps {
                script{
                    docker.withRegistry('',DOCKER_PASS) {
                        docker_image = docker.build '${IMAGE_NAME}'
                    }

                    docker.withRegistry('',DOCKER_PASS){
                        docker_image.push('${IMAGE_TAG}')
                        docker_image.push('latest')
                    }
                }
            }
        }
    }
}
