provider "aws" {
  region = "us-east-1"
}

resource "aws_cognito_user_pool" "user_pool" {
  name = "user_pool"
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = "user_pool_client"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  inline_policy {
    name = "lambda_policy"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ]
          Effect   = "Allow"
          Resource = "*"
        },
        {
          Action = [
            "cognito-idp:AdminGetUser",
            "cognito-idp:AdminInitiateAuth"
          ]
          Effect   = "Allow"
          Resource = "*"
        }
      ]
    })
  }
}

resource "aws_lambda_function" "auth_lambda" {
  filename         = "lambda.zip"
  function_name    = "auth_lambda"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "handler.autenticar"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256("lambda.zip")

  environment {
    variables = {
      USER_POOL_ID = aws_cognito_user_pool.user_pool.id
    }
  }
}

resource "aws_api_gateway_rest_api" "api" {
  name = "auth_api"
}

resource "aws_api_gateway_resource" "auth_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "autenticar"
}

resource "aws_api_gateway_method" "auth_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.auth_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "auth_integration" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.auth_resource.id
  http_method = aws_api_gateway_method.auth_method.http_method
  type        = "AWS_PROXY"
  integration_http_method = "POST"
  uri         = aws_lambda_function.auth_lambda.invoke_arn
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auth_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}