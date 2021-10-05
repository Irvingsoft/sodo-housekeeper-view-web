def project_name_parent = "sodo-view"
def project_url = "https://gitee.com/irvingsoft-sodo/sodo-housekeeper-view-web.git"
def git_auth = "Gitee"
def branch = "master"
def harbor_url = "172.16.16.8:8081"
def harbor_project_name = "sodo-view"
def harbor_auth = "Harbor"
def tag = "latest"
def image_name = "${project_name}:${tag}"

node {
    dir("/var/lib/jenkins/workspace/" + "${project_name_parent}" + "/") {
        stage('Pull Project') {
            checkout([$class: 'GitSCM',
                branches: [[name: "*/${branch}"]],
                extensions: [],
                userRemoteConfigs: [[credentialsId: "${git_auth}", url: "${project_url}"]]])
        }
        stage('Npm Build') {
            sh 'node --version'
            sh 'npm --version'
            sh 'npm install'
            sh 'npm run build'
        }
        stage('Docker Build') {
            sh "docker build -t ${image_name}"
            sh "docker tag ${image_name} ${harbor_url}/${harbor_project_name}/${image_name}"
        }
        stage('Upload Image') {
            // Upload the image to Harbor.
            withCredentials([
                    usernamePassword(
                        credentialsId: 'Harbor',
                        passwordVariable: 'password',
                        usernameVariable: 'username'
                    )
                ]) {
                // Login Harbor
                sh "docker login -u ${username} -p ${password} ${harbor_url}"
                // Upload
                sh "docker push ${harbor_url}/${harbor_project_name}/${image_name}"
            }
        }
        stage('Delete Images') {
            // Delete local images which had been uploaded to Harbor.
            sh "docker rmi -f ${image_name}"
            sh "docker rmi -f ${harbor_url}/${harbor_project_name}/${image_name}"
        }
        stage('Remote Deploy') {
            // Deploy the image to the remote server.
            sshPublisher(
                publishers: [
                    sshPublisherDesc(
                        configName: 'Irvingsoft_Server',
                        transfers: [
                            sshTransfer(
                                cleanRemote: false,
                                excludes: '',
                                execCommand: "/root/docker-deploy.sh $harbor_url $harbor_project_name $project_name $tag $port $port_in",
                                execTimeout: 120000,
                                flatten: false,
                                makeEmptyDirs: false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: '',
                                remoteDirectorySDF: false,
                                removePrefix: '',
                                sourceFiles: ''
                            )
                        ],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: true
                    )
                ]
            )
        }
    }
}
