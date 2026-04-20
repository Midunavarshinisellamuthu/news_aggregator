pipeline {
    agent any

    triggers {
        // Automatically triggers when code is pushed to GitHub via webhook
        githubPush()
    }

    environment {
        COMPOSE_PROJECT_NAME = "news-aggregator"
    }

    stages {

        stage('Clean') {
            steps {
                script {
                    // Stop and remove existing containers (ignore errors if not running)
                    bat(returnStatus: true, script: 'docker compose stop app mongo')
                    bat(returnStatus: true, script: 'docker compose rm -f app mongo')
                }
            }
        }

        stage('Prepare') {
            steps {
                script {
                    // Write the .env.production file with secrets
                    writeFile file: '.env.production', text: """MONGODB_URI=mongodb+srv://midunavarshini342_db_user:Xr9UZc7OfDqvqJQ5@cluster0.doppz3y.mongodb.net/newshub?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=production
"""
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Build the Docker image using docker compose
                    bat 'docker compose build app'
                }
            }
        }

        stage('Run') {
            steps {
                script {
                    // Start the app container in detached mode
                    bat 'docker compose up -d app'
                    echo 'App is running at http://localhost:3000'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! App is live at http://localhost:3000'
        }
        failure {
            echo 'Pipeline failed. Check the logs above for errors.'
            // Cleanup on failure
            bat(returnStatus: true, script: 'docker compose down')
        }
    }
}