#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import {RetentionDays} from 'aws-cdk-lib/aws-logs'
import 'source-map-support/register'
import {BaseStack} from '../lib/base-stack'

const app = new cdk.App()

new BaseStack(app, 'dev-AkuratWebappStack', {
    description: 'The stack with components needed for deploying Akurat Webapp',
    env: {account: '412644677543', region: 'eu-central-1'},
    logRetention: RetentionDays.ONE_WEEK,
})

new BaseStack(app, 'prod-AkuratWebappStack', {
    description: 'The stack with components needed for deploying Akurat Webapp',
    env: {account: '412644677543', region: 'eu-central-1'},
    logRetention: RetentionDays.ONE_MONTH,
})