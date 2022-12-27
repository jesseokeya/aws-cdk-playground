import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import {
  OriginAccessIdentity,
  AllowedMethods,
  ViewerProtocolPolicy,
  OriginProtocolPolicy,
  Distribution,
} from "aws-cdk-lib/aws-cloudfront";

interface CustomStackProps extends cdk.StackProps {
  stage: string;
}

export class CloudfrontPlaygroundStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);
    
    // Importing ALB domain name
    const loadBalancerDomain = cdk.Fn.importValue("loadBalancerUrl");
      
    // Getting external configuration values from cdk.json file
    const config = this.node.tryGetContext("stages")[props.stage];

    // SSL certificate 
    const certificateArn = acm.Certificate.fromCertificateArn(this, "tlsCertificate", config.certificateArn);

    // Web hosting bucket
    let websiteBucket = new Bucket(this, "websiteBucket", {
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Trigger frontend deployment
    new BucketDeployment(this, "websiteDeployment", {
      sources: [Source.asset("./frontend/build")],
      destinationBucket: websiteBucket as any
    });

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new OriginAccessIdentity(this, "cloudfrontOAI", {
      comment: "OAI for web application cloudfront distribution",
    });

    // Creating CloudFront distribution
    let cloudFrontDist = new Distribution(this, "cloudfrontDist", {
      defaultRootObject: "index.html",
      domainNames: ["domain.com"],
      certificate: certificateArn,
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket as any, {
          originAccessIdentity: originAccessIdentity as any,
        }) as any,
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
      },
    });

    // Creating custom origin for the application load balancer
    const loadBalancerOrigin = new origins.HttpOrigin(loadBalancerDomain, {
      protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
    });

    // Creating the path pattern to direct to the load balancer origin
    cloudFrontDist.addBehavior("/generate/*", loadBalancerOrigin as any, {
      compress: true,
      viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
      allowedMethods: AllowedMethods.ALLOW_ALL,
    });

    new cdk.CfnOutput(this, "cloudfrontDomainUrl", {
      value: cloudFrontDist.distributionDomainName,
      exportName: "cloudfrontDomainUrl",
    });
  }
}