version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 16
  pre_build:
    commands:
      - npm install --force
  build:
    commands:
      - npm run build
  post_build:
    commands:
      # Check the branch and sync to the corresponding S3 bucket
      - |
        if [ "$CODEBUILD_WEBHOOK_TRIGGER" == "main" ]; then
          aws s3 sync build/ s3://wsr-frontend-testing
        elif [ "$CODEBUILD_WEBHOOK_TRIGGER" == "branch-2" ]; then
          aws s3 sync build/ s3://bucket-2
        elif [ "$CODEBUILD_WEBHOOK_TRIGGER" == "branch-3" ]; then
          aws s3 sync build/ s3://bucket-3
        else
          echo "No matching branch for S3 sync."
        fi

artifacts:
  files: '**/*'
  base-directory: build
  discard-paths: yes
