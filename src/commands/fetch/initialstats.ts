import {Command, Flags} from '@oclif/core';
import {Filter, MongoClient, Document, ObjectId} from 'mongodb';
import {completeLogging} from '../../helpers/completeLogging';
import {logger} from '../../helpers/logger';
import {fetchTootstatsForAccount} from '../../helpers/fetchTootstatsForAccount';
import {createInitialAccountStats} from '../../helpers/createInitialAccountStats';
import {createInitialTootStats} from '../../helpers/createInitialTootStats';
import axios from 'axios';

export default class InitialStats extends Command {
    static description = 'Gather initial stats for all accounts (only 1 per call)';

    static examples = [`<%= config.bin %> <%= command.id %>`];

    static flags = {
        connectionString: Flags.string({
            char: 'c',
            description: 'MongoDB connection string',
            default: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        }),
        database: Flags.string({
            char: 'd',
            description: 'Source database name',
            default: 'analytodon',
        }),
        account: Flags.string({
            char: 'a',
            description: 'Only process specific account',
        }),
        host: Flags.string({
            char: 'h',
            description: 'App host URL',
            default: process.env.APP_URL || 'https://app.analytodon.com',
        }),
        authorization: Flags.string({
            char: 't',
            description: 'Authorization header',
            default: process.env.EMAIL_API_KEY || 'no-key',
        }),
    };

    static args = [];

    async run(): Promise<void> {
        const {flags} = await this.parse(InitialStats);

        logger.info('Fetching initial stats: Started');

        // Connect to database
        const connection = await new MongoClient(flags.connectionString).connect();
        const db = connection.db(flags.database);

        const accountQuery: Filter<Document> = {
            isActive: true,
            credentials: {$exists: true},
            initialStatsFetched: {$ne: true},
            requestedScope: {$all: ['read:accounts', 'read:statuses', 'read:notifications']},
        };

        if (flags.account) {
            logger.info(`Fetching initial stats: Only process account ${flags.account}`);
            accountQuery['_id'] = new ObjectId(flags.account);
        }

        const account = await db.collection('accounts').findOne(accountQuery);

        if (account) {
            logger.info(`Fetching initial stats: Processing account ${account.name}`);

            const user = await db.collection('users').findOne({accounts: {$in: [account._id]}});

            if (user) {
                await db.collection('accounts').updateOne({_id: account._id}, {$set: {initialStatsFetched: true}});

                logger.info(`Fetching initial stats: Fetch toot history for account ${account.name}`);
                await fetchTootstatsForAccount(db, account);

                logger.info(`Fetching initial stats: Create initial account stats for account ${account.name}`);
                await createInitialAccountStats(db, account);

                logger.info(`Fetching initial stats: Create initial toot stats for account ${account.name}`);
                await createInitialTootStats(db, account);

                await axios.post(
                    `${flags.host}/api/mail/firststats`,
                    {userID: `${user._id}`, accounts: [account._id]},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: flags.authorization,
                        },
                    },
                );
            } else {
                logger.warn(`Fetching initial stats: Owner of account ${account._id} not found.`);
            }
        } else {
            logger.info('Fetching initial stats: Nothing to do.');
        }

        await connection.close();

        await completeLogging();
    }
}
