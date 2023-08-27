// eslint-disable-next-line @typescript-eslint/no-var-requires
const newrelic = require('newrelic');

export const completeLogging = async () =>
    new Promise<void>((resolve) => {
        newrelic.shutdown({collectPendingData: true, timeout: 10000, waitForIdle: true}, () => resolve());
    });
