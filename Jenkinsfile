pipeline {
    agent any

    triggers {
        // Polls the Git repository every minute for changes. 
        // For production, consider using 'githubPush()' or webhooks instead.
        pollSCM('* * * * *') 
    }

    environment {
        DOCKER_IMAGE = "midunavarshini30/news-hub-aggregator"
        DOCKER_TAG = "v${env.BUILD_NUMBER}"
        DOCKER_LATEST = "midunavarshini30/news-hub-aggregator:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Environment') {
            steps {
                writeFile file: '.env.production', text: '''MONGODB_URI=mongodb+srv://midunavarshini342_db_user:Xr9UZc7OfDqvqJQ5@cluster0.doppz3y.mongodb.net/newshub?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NEXT_PUBLIC_API_URL=http://localhost:3000
'''
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // This ensures docker commands work if configured as a tool
                    bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    bat "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_LATEST}"
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS')]) {
                    bat "echo %PASS%| docker login -u %USER% --password-stdin"
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    bat "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    bat "docker push ${DOCKER_LATEST}"
                }
            }
        }

        stage('Cleanup Local Images') {
            steps {
                bat returnStatus: true, script: "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_LATEST}"
            }
        }

        stage('Run Locally (Deployment Simulation)') {
            steps {
                script {
                    bat returnStatus: true, script: "docker stop news-container"
                    bat returnStatus: true, script: "docker rm news-container"
                    bat "docker run -d -p 3000:3000 --name news-container ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline successfully completed!"
        }
        failure {
            echo "Pipeline failed! Please check the logs."
        }
    }
}