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

  volumes:
    - name: workspace
      emptyDir: {}
"""
    }
  }

  environment {
    REGISTRY = "docker registry ip goes here"
    IMAGE_NAME = "recoit-backend"
    IMAGE_TAG = 'latest'
    KUBE_NAMESPACE = "recoit"
    GIT_URL = 'git@bitbucket.org:fedevitch/recoit-backend.git'
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

    stage('Build schemas') {
      steps {
        container('node') {
            sh 'npx prisma generate'
        }
      }
    }

    stage('Install test env') {
      steps {
        container('node') {
            sh 'npm i -g jest'
        }
      }
    }

    stage('Run tests') {
      steps {
        container('node') {
            sh 'npm run test:cov'
        }
      }
    }
  }

  post {
    always {
      // raw folder with coverage info
      archiveArtifacts artifacts: 'coverage/**/*', onlyIfSuccessful: true

      // Publish Clover coverage (XML)
      clover(cloverReportDir: 'coverage', cloverReportFileName: 'clover.xml',
        // optional, default is: method=70, conditional=80, statement=80
        healthyTarget: [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],
        // optional, default is none
        unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50],
        // optional, default is none
        failingTarget: [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]
      )

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
