import {Command, Flags} from '@oclif/core';
import {Document, Filter, MongoClient} from 'mongodb';
import {completeLogging} from '../../helpers/completeLogging';
import {logger} from '../../helpers/logger';

export default class OldAccounts extends Command {
    static description = 'Delete users with old accounts';

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
        host: Flags.string({
            char: 'h',
            description: 'App host URL',
            default: process.env.APP_URL || 'https://app.analytodon.com',
        }),
        dryRun: Flags.boolean({
            char: 'x',
            description: 'Dry run, no actual changes made',
            default: false,
        }),
    };

    async run(): Promise<void> {
        logger.info('Cleanup old accounts started.');

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 120);

        try {
            const {flags} = await this.parse(OldAccounts);

            // Connect to database
            const connection = await new MongoClient(flags.connectionString).connect();
            const db = connection.db(flags.database);

            const credentialsQuery: Filter<Document> = {
                updatedAt: {
                    $lt: cutoffDate,
                },
            };

            const credentialList = await db.collection('usercredentials').find(credentialsQuery).project({user: 1}).toArray();
            const credentialSet = new Set(credentialList.map(({user}) => user));

            const usersQuery: Filter<Document> = {
                _id: {$in: Array.from(credentialSet)},
                oldAccountDeletionNoticeSent: true,
            };

            const userList = await db.collection('users').find(usersQuery).project({_id: 1}).toArray();

            const userSet = new Set(userList.map(({_id}) => _id));

            for (const userID of userSet) {
                try {
                    if (!flags.dryRun) {
                        logger.info(`Cleanup old accounts: Delete user ${userID}`);
                        await db.collection('users').deleteOne({_id: userID});
                    } else {
                        logger.info(`Cleanup old accounts: Delete user ${userID} (DRY RUN)`);
                    }
                } catch (error: any) {
                    logger.error(`Cleanup old accounts: Failed for user ${userID} with error ${error?.message}`);
                }
            }

            await connection.close();
        } catch (error: any) {
            logger.error(`Cleanup old accounts: Failed with error ${error?.message}`);
        }

        logger.info('Cleanup old accounts done.');

        await completeLogging();
    }
}
