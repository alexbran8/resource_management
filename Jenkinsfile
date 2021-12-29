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

        stage 'Deploy'
         dir('/apps/npt'){
            sh 'chmod +x deploy_prod.sh'
            sh 'cat deploy_prod.sh'
            sh './deploy_prod.sh'
         } 
    }

    catch (err) {
       
        throw err
    }
    finally {
        // deploy previous  container
    }

}