import {Document, Db} from 'mongodb';
import generator, {Response} from 'megalodon';
import {logger} from './logger';
import {getDateInTimezone} from './getDateInTimezone';
import {getDaysAgo} from './getDaysAgo';
import {processInBatches} from './processInBatches';

const MAX_ITERATIONS = 15000;
const PAUSE_INTERVAL = 9;
const PAUSE_MS = 2000;
const QUERY_LIMIT = 80;
const BATCH_SIZE = 5;

export const createInitialAccountStats = async (db: Db, account: Document) => {
    logger.info(`Create initial account stats: Processing account ${account.name}`);

    const credentials = await db.collection('accountcredentials').findOne({account: account._id});

    if (!credentials?.accessToken) {
        logger.info(`Create initial account stats: Access token not found for ${account.name}`);
    } else {
        try {
            const mastodon = generator('mastodon', account.serverURL, credentials.accessToken);

            let pagingCursor = undefined;

            let more = true;
            let iterationCount = 0;

            const userInfo = await mastodon.verifyAccountCredentials();

            const statsList: {day: Date; followersCount: number}[] = [];

            const startDate = getDateInTimezone(new Date(userInfo.data.created_at), account.timezone);
            const endDate = getDaysAgo(0, account.timezone);

            const day = new Date(endDate);
            while (day >= startDate) {
                statsList.push({day: new Date(day), followersCount: day.getTime() === endDate.getTime() ? userInfo.data.followers_count : 0});
                day.setDate(day.getDate() - 1);
            }

            let actualStartDate = new Date(endDate);

            const actualEndDate = getDateInTimezone(new Date(account.createdAt), account.timezone);
            actualEndDate.setDate(actualEndDate.getDate() - 1);

            while (more) {
                iterationCount++;

                if (iterationCount % PAUSE_INTERVAL === 0) {
                    logger.info(`Create initial account stats: Pausing for ${account.name}`);
                    await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
                }

                const notificationsResponse: Response<Array<Entity.Notification>> = await mastodon.getNotifications({
                    limit: QUERY_LIMIT,
                    max_id: pagingCursor,
                });

                const unfilteredNotificationsList = notificationsResponse.data ?? [];
                if (unfilteredNotificationsList.length > 0) {
                    const notificationsList = unfilteredNotificationsList.filter(({type}) => type === 'follow');

                    if (notificationsList.length > 0) {
                        logger.info(`Create initial account stats: Processing ${notificationsList.length} notifications for ${account.name}`);

                        for (const notification of notificationsList) {
                            const notificationDate = getDateInTimezone(new Date(notification.created_at), account.timezone);
                            notificationDate.setDate(notificationDate.getDate() - 1);
                            const index = statsList.findIndex(({day}) => day.getTime() === notificationDate.getTime());
                            if (index >= 0) {
                                statsList[index].followersCount += 1;
                            }
                            if (notificationDate.getTime() < actualStartDate.getTime()) {
                                actualStartDate = new Date(notificationDate);
                            }
                        }
                    }

                    pagingCursor = unfilteredNotificationsList[unfilteredNotificationsList.length - 1].id;
                    more = true;
                }

                logger.info(`Create initial account stats: Done for ${account.name}`);

                if (iterationCount >= MAX_ITERATIONS || unfilteredNotificationsList.length <= 0) {
                    more = false;

                    logger.info(`Create initial account stats: Follower list empty or limit reached for ${account.name}, resetting cursor`);

                    pagingCursor = undefined;
                }
            }

            const calculatedStatsList = statsList.reduce(
                (carry, stats, index) => {
                    if (!carry.length) {
                        return [{...stats}];
                    }
                    return [
                        ...carry,
                        {
                            ...stats,
                            followersCount: carry[index - 1].followersCount - stats.followersCount,
                        },
                    ];
                },
                [] as typeof statsList,
            );

            const croppedStatsList = calculatedStatsList.filter(
                ({day}) => day.getTime() >= actualStartDate.getTime() && day.getTime() <= actualEndDate.getTime(),
            );

            await processInBatches(BATCH_SIZE, croppedStatsList, (stats) =>
                db.collection('dailyaccountstats').insertOne({
                    account: account._id,
                    day: stats.day,
                    followersCount: stats.followersCount,
                    followingCount: 0,
                    statusesCount: 0,
                }),
            );
        } catch (error: any) {
            logger.error(`Create initial account stats: Error while processing ${account.name} (${account._id}): ${error?.message}`);
        }
    }
};
