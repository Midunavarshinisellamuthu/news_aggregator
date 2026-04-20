pipeline {
    agent any

    environment {
        IMAGE_NAME = "midunavarshini30/news-hub-aggregator"
        IMAGE_TAG = "v1"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS')]) {
                    sh '''
                    echo "$PASS" | docker login -u "$USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Image') {
            steps {
                sh "docker push $IMAGE_NAME:$IMAGE_TAG"
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker stop news-container || true
                docker rm news-container || true
                docker run -d -p 3000:3000 --name news-container $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }
    }
}