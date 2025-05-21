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

    - name: buildah
      image: quay.io/buildah/stable
      securityContext:
        privileged: true
      command: [ "sleep", "999999" ]
      volumeMounts:
        - name: workspace
          mountPath: /workspace

    - name: kubectl
      image: bitnami/kubectl
      command: [ "sleep", "999999" ]
      tty: true
      securityContext:
        runAsUser: 1000      

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
              url: 'git@bitbucket.org:fedevitch/recoit-frontend.git',
              credentialsId: 'put your jenkins credentials id for repo here as well (cause it cannot read it from variable)'
            ]]
          ])
        }
      }
    }

    stage('Build and Push to registry') {
      steps {
        container('buildah') {
          sh '''
          buildah bud --format=docker -t $REGISTRY/$IMAGE_NAME:$BUILD_NUMBER -t $REGISTRY/$IMAGE_NAME:latest -t $REGISTRY/$IMAGE_NAME:staging .
          buildah push --tls-verify=false --compression-format=zstd $REGISTRY/$IMAGE_NAME:$BUILD_NUMBER
          buildah push --tls-verify=false --compression-format=zstd $REGISTRY/$IMAGE_NAME:latest
          buildah push --tls-verify=false --compression-format=zstd $REGISTRY/$IMAGE_NAME:staging
          '''
        }
      }
    }

    stage('Code coverage report') {
      steps {
        container('buildah') {
          sh '''
          container=$(buildah from $REGISTRY/$IMAGE_NAME:$BUILD_NUMBER)
          mntpoint=$(buildah mount $container)
          cp -r "$mntpoint/usr/src/app/coverage" coverage
          '''
        }
      }
    }

    stage('Deploy App to Kubernetes') {
      steps {
        container('kubectl') {
          withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'recoit-k8s-secret', namespace: 'recoit', restrictKubeConfigAccess: false, serverUrl: 'PUT YOUR K8S SERVER URL HERE') {
            sh 'kubectl rollout restart -n recoit deployment recoit-frontend-deployment'
          }
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
