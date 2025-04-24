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
	IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"   // <-- esto ya es válido
	IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
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
        stage("Dockermovida"){        
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
        stage("Disparar la Pipeline CD"){        
            steps{
                script {
                    sh "curl -v -k --user admin:${JENKINS_API_TOKEN} -X POST -H 'cache-control: no-cache' -H 'content-type: application/x-www-form-urlencoded' --data 'IMAGE_TAG=${IMAGE_TAG}' 'http://10.10.10.190/job/pipeline-gitops/buildWithParameters?token=gitops-token'"
                }
            }
        }
    }
}
