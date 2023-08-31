import * as cdk from 'aws-cdk-lib'
import {StackProps} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import {Bucket} from 'aws-cdk-lib/aws-s3'
import {Distribution} from 'aws-cdk-lib/aws-cloudfront'
import {BucketDeployment, Source} from 'aws-cdk-lib/aws-s3-deployment'
import {WebappDistributionParams} from './types'
import * as path from 'path'
import {RetentionDays} from 'aws-cdk-lib/aws-logs'

type BaseStackProps = Readonly<{
    logRetention: RetentionDays
}> & StackProps
export class BaseStack extends cdk.Stack {
    constructor(scope: Construct,
                id: string,
                {
                    logRetention,
                    ...props
                }: BaseStackProps) {
        super(scope, id, props)
        const bucketName = this.node.tryGetContext('webappBucketName') as string
        const {distributionId, domainName} = this.node.tryGetContext('webappDistribution') as WebappDistributionParams['webappDistribution']

        const destinationBucket = Bucket.fromBucketAttributes(this, 'WebappBucket', {bucketName})

        const distribution = Distribution.fromDistributionAttributes(this, 'WebappDistribution', {
            distributionId,
            domainName
        })

        new BucketDeployment(this, 'WebappDeployment', {
            sources: [Source.asset(path.join(__dirname, '..', '..', 'dist'))],
            distribution,
            destinationBucket,
            logRetention
        })
    }
}
