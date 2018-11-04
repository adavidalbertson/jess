module.exports = {
    apps: [{
      name: 'jess',
      script: './backend/index.js'
    }],
    deploy: {
      production: {
        user: 'ec2-user',
        host: 'ec2-34-216-180-83.us-west-2.compute.amazonaws.com',
        key: '~/.ssh/aws-jess.pem',
        ref: 'origin/master',
        repo: 'git@github.com:adavidalbertson/jess.git',
        path: '/home/ec2-user/jess',
        'post-deploy': 'cd ./frontend && npm install && npm run build'
            + ' && cd ../backend && npm install && pm2 startOrRestart ecosystem.config.js'
      }
    }
  }