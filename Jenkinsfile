pipeline {
    agent any

    triggers {
        // Polls GitHub every minute for new commits - no webhook needed
        pollSCM('* * * * *')
    }

    stages {

        stage('Clean') {
            steps {
                script {
                    // Stop and remove old containers by their hardcoded names to avoid project name conflicts
                    sh 'docker rm -f news-prometheus news-mongo news-container news-grafana || true'
                }
            }
        }

        stage('Prepare') {
            steps {
                script {
                    // Write environment file for the app
                    writeFile file: '.env.production', text: '''MONGODB_URI=mongodb+srv://midunavarshini342_db_user:Xr9UZc7OfDqvqJQ5@cluster0.doppz3y.mongodb.net/newshub?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=production
'''
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Build the app and prometheus Docker images
                    sh 'docker compose build app prometheus'
                }
            }
        }

        stage('Run') {
            steps {
                script {
                    // Start app and mongo in detached mode
                    sh 'docker compose up -d app mongo prometheus grafana'
                    echo 'App is running at http://localhost:3000'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed! App is live at http://localhost:3000'
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
            sh 'docker compose down || true'
        }
    }
}