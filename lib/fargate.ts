import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';

export class FargatePlaygroundStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // VPC
    const vpc = new ec2.Vpc(this, "PlaygroundVPC", {
      maxAzs: 2,
      natGateways: 1,
    });

    // Fargate cluster
    const cluster = new ecs.Cluster(this, "PlaygroundCluster", { vpc });

    // Fargate service
    const backendService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "BackendService", {
      cluster: cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset("./backend/"),
        environment: {
          myVar: process.env.MY_VAR || "variable-01",
        },
      },
    });

    // Health check
    backendService.targetGroup.configureHealthCheck({ path: "/health" });

    // Load balancer url
    new cdk.CfnOutput(this, "loadBalancerUrl", {
      value: backendService.loadBalancer.loadBalancerDnsName,
      exportName: "loadBalancerUrl",
    });
  }
}