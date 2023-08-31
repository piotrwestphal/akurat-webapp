#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BaseStack } from '../lib/base-stack';
import {RetentionDays} from 'aws-cdk-lib/aws-logs'

const app = new cdk.App();

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