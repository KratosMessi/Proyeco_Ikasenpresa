pipeline{
    agent{
        label "jenkins-agent"
    }
    tools {
        jdk 'Java17'
        maven 'Maven3'
    }
environment {
	APP_NAME = "proyeco_ikasenpresa"
	RELEASE = "1.0.0"
	DOCKER_USER = "kratosmessi1"
	DOCKER_PASS = "dockerhub"
	IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
	IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
}

    stages{
        stage("Limpiar el Workspace"){
            steps {
                cleanWs()
            }

        }
    
        stage("Checkout de SCM"){
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/KratosMessi/Proyeco_Ikasenpresa'
            }

        }
        stage("Construir aplicacion MVN"){
            steps {
                sh "mvn clean package"
            }

        }
        stage("Testear applicacion MVN"){
            steps {
                sh "mvn test"
            }

        }
        stage("Analisis con Sonarqube"){
            steps {
                script{
                    withSonarQubeEnv(credentialsID: 'jenkins-sonarqube-token'){
                        sh "mvn sonar:sonar"
                    }
                }
            }
        }
        stage("Esperar por la QualityGate"){
            steps {
                script{
                    waitForQualityGate abortPipeline: false, credentialsID: 'jenkins-sonarqube-token'
                }
            }
        }
        stage("Construir imagen en Docker"){        
            steps{
                script {
                    docker.withRegistry('', DOCKER_PASS) {
                        docker_image = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    }

                    docker.withRegistry('', DOCKER_PASS) {
                            docker_image.push()
                            docker_image.push("latest")
                    }
                }
            }        
        }
    }
}
