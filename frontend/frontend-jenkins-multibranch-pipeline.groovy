pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
metadata:
  name: jenkins-build-agent
spec:
  containers:
    - name: jnlp
      image: jenkins/inbound-agent
      args: ["\$(JENKINS_SECRET)", "\$(JENKINS_NAME)"]

    - name: node
      image: node:22.14.0-alpine
      command: [ "sleep", "999999" ]
      volumeMounts:
        - name: workspace
          mountPath: /workspace

    - name: chrome
      image: browserless/chrome
      command: [ "sleep", "999999" ]        

  volumes:
    - name: workspace
      emptyDir: {}
"""
    }
  }

  environment {
    REGISTRY = "docker registry ip goes here"
    IMAGE_NAME = "recoit-frontend"
    IMAGE_TAG = 'latest'
    KUBE_NAMESPACE = "recoit"
    GIT_URL = 'git@bitbucket.org:fedevitch/recoit-frontend.git'
    CREDENTIALS_ID = 'put your jenkins credentials id here'
  }

  stages {        
    stage('Checkout') {
      steps {
        sshagent(['put your jenkins credentials id for repo here as well (cause it cannot read it from variable)']) {
          checkout([$class: 'GitSCM',
            branches: [[name: 'origin/LPP-*']],
            userRemoteConfigs: [[
              url: 'git@bitbucket.org:fedevitch/recoit-backend.git',
              credentialsId: 'put your jenkins credentials id for repo here as well (cause it cannot read it from variable)'
            ]]
          ])
        }
      }
    }

    stage('Install dependencies') {
      steps {
        container('node') {
            sh 'npm ci'
        }
      }
    }

    stage('Install test env') {
      steps {
        container('node') {
            sh 'npm i -g @angular/cli'
        }
      }
    }

    stage('Run tests') {
      steps {
        container('node') { // ToDo: run using chrome container            
            sh 'npm run test:ci'
        }
      }
    }
  }

  post {
    always {
      // raw folder with coverage info
      archiveArtifacts artifacts: 'coverage/**/*', onlyIfSuccessful: true

      // Publish HTML report (for visual browsing)
      publishHTML([
          reportName : 'Jest Coverage',
          reportDir  : 'coverage/lcov-report',
          reportFiles: 'index.html',
          keepAll    : true,
          alwaysLinkToLastBuild: true,
          allowMissing: false
      ])
    }
  }
}
