#!groovy

node {
    try {
        stage 'Checkout'
                // how to import location from .env???
            dir('/apps/npt'){
            sh "pwd"
       
            checkout scm

            sh 'git log HEAD^..HEAD --pretty="%h %an - %s" > GIT_CHANGES'
            def lastChanges = readFile('GIT_CHANGES')

                dir('/apps/env'){
                sh "ls -a"
                sh "cp .npt_env /apps/npt/.env"
            }

        stage 'Test'
            sh 'echo "test implementation in progress"'
            // sh '. env/bin/activate'
            // sh 'env/bin/pip install -r requirements.txt'
            // sh 'env/bin/python3.5 manage.py test --testrunner=djtrump.tests.test_runners.NoDbTestRunner'

        stage 'Deploy'
         dir('/apps/npt'){
            sh 'chmod +x deploy_prod.sh'
            sh 'cat deploy_prod.sh'
            sh './deploy_prod.sh'
         }

        stage 'Publish results'
            // slackSend color: "good", message: "Build successful: `${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
 
    }
    }

    catch (err) {
       
        throw err
    }
    finally {
        // deploy previous  container
    }

}