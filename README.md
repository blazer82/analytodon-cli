# Analytodon CLI

CLI for [Analytodon](https://www.analytodon.com).

<!-- toc -->

-   [Usage](#usage)
-   [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g analytodon-cli
$ analytodon-cli COMMAND
running command...
$ analytodon-cli (--version)
analytodon-cli/0.0.0 darwin-arm64 node-v16.19.0
$ analytodon-cli --help [COMMAND]
USAGE
  $ analytodon-cli COMMAND
...
```

Recommended cron configuration:

```crontab
# Analytodon initial stats
* * * * * /path/to/analytodon-cli fetch initialstats

# Analytodon fetch
35 * * * * /path/to/analytodon-cli fetch accountstats
35 * * * * /path/to/analytodon-cli fetch tootstats

# Analytodon aggregate
5 * * * * /path/to/analytodon-cli aggregate dailyaccountstats
5 * * * * /path/to/analytodon-cli aggregate dailytootstats

# Analytodon weekly mail
0 19,20,21,22,23 * * 0 /path/to/analytodon-cli mail weeklystats
0 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17 * * 1 /path/to/analytodon-cli mail weeklystats

# Analytodon cleanup
45 11 * * * /path/to/analytodon-cli cleanup users
46 11 * * * /path/to/analytodon-cli cleanup usercredentials
47 11 * * * /path/to/analytodon-cli cleanup accounts
48 11 * * * /path/to/analytodon-cli cleanup accountdata
```

<!-- usagestop -->

# Commands

<!-- commands -->
* [`analytodon-cli aggregate dailyaccountstats`](#analytodon-cli-aggregate-dailyaccountstats)
* [`analytodon-cli aggregate dailytootstats`](#analytodon-cli-aggregate-dailytootstats)
* [`analytodon-cli auth requesttoken`](#analytodon-cli-auth-requesttoken)
* [`analytodon-cli cleanup accountdata`](#analytodon-cli-cleanup-accountdata)
* [`analytodon-cli cleanup accounts`](#analytodon-cli-cleanup-accounts)
* [`analytodon-cli cleanup tootstats`](#analytodon-cli-cleanup-tootstats)
* [`analytodon-cli cleanup usercredentials`](#analytodon-cli-cleanup-usercredentials)
* [`analytodon-cli cleanup users`](#analytodon-cli-cleanup-users)
* [`analytodon-cli fetch accountstats`](#analytodon-cli-fetch-accountstats)
* [`analytodon-cli fetch initialstats`](#analytodon-cli-fetch-initialstats)
* [`analytodon-cli fetch tootstats`](#analytodon-cli-fetch-tootstats)
* [`analytodon-cli hello PERSON`](#analytodon-cli-hello-person)
* [`analytodon-cli hello world`](#analytodon-cli-hello-world)
* [`analytodon-cli help [COMMAND]`](#analytodon-cli-help-command)
* [`analytodon-cli mail weeklystats`](#analytodon-cli-mail-weeklystats)
* [`analytodon-cli plugins`](#analytodon-cli-plugins)
* [`analytodon-cli plugins:install PLUGIN...`](#analytodon-cli-pluginsinstall-plugin)
* [`analytodon-cli plugins:inspect PLUGIN...`](#analytodon-cli-pluginsinspect-plugin)
* [`analytodon-cli plugins:install PLUGIN...`](#analytodon-cli-pluginsinstall-plugin-1)
* [`analytodon-cli plugins:link PLUGIN`](#analytodon-cli-pluginslink-plugin)
* [`analytodon-cli plugins:uninstall PLUGIN...`](#analytodon-cli-pluginsuninstall-plugin)
* [`analytodon-cli plugins:uninstall PLUGIN...`](#analytodon-cli-pluginsuninstall-plugin-1)
* [`analytodon-cli plugins:uninstall PLUGIN...`](#analytodon-cli-pluginsuninstall-plugin-2)
* [`analytodon-cli plugins update`](#analytodon-cli-plugins-update)
* [`analytodon-cli tools rebuilddailytootstats`](#analytodon-cli-tools-rebuilddailytootstats)

## `analytodon-cli aggregate dailyaccountstats`

Aggregate daily account stats for all accounts

```
USAGE
  $ analytodon-cli aggregate dailyaccountstats [-c <value>] [-d <value>] [-z <value>]

FLAGS
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -z, --timezone=<value>          Process accounts with this timezone

DESCRIPTION
  Aggregate daily account stats for all accounts

EXAMPLES
  $ analytodon-cli aggregate dailyaccountstats
```

## `analytodon-cli aggregate dailytootstats`

Aggregate daily toot stats for all accounts

```
USAGE
  $ analytodon-cli aggregate dailytootstats [-c <value>] [-d <value>] [-z <value>]

FLAGS
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -z, --timezone=<value>          Process accounts with this timezone

DESCRIPTION
  Aggregate daily toot stats for all accounts

EXAMPLES
  $ analytodon-cli aggregate dailytootstats
```

## `analytodon-cli auth requesttoken`

Aid with requesting OAuth token manually

```
USAGE
  $ analytodon-cli auth requesttoken -i <value> [-c <value>] [-s <value>] [-o <value>]

FLAGS
  -c, --clientID=<value>      OAuth client ID
  -i, --serverURL=<value>     (required) Mastodon instance URL
  -o, --code=<value>          OAuth code
  -s, --clientSecret=<value>  OAuth client secret

DESCRIPTION
  Aid with requesting OAuth token manually

EXAMPLES
  $ analytodon-cli auth requesttoken
```

## `analytodon-cli cleanup accountdata`

Clean up orphaned account data.

```
USAGE
  $ analytodon-cli cleanup accountdata [-c <value>] [-d <value>] [-x]

FLAGS
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -x, --dryRun                    Dry run, no actual changes made

DESCRIPTION
  Clean up orphaned account data.

EXAMPLES
  $ analytodon-cli cleanup accountdata
```

## `analytodon-cli cleanup accounts`

Clean up accounts.

```
USAGE
  $ analytodon-cli cleanup accounts [-c <value>] [-d <value>] [-x]

FLAGS
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -x, --dryRun                    Dry run, no actual changes made

DESCRIPTION
  Clean up accounts.

EXAMPLES
  $ analytodon-cli cleanup accounts
```

## `analytodon-cli cleanup tootstats`

Clean up old tootstats.

```
USAGE
  $ analytodon-cli cleanup tootstats [-c <value>] [-d <value>] [-r <value>] [-x]

FLAGS
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -r, --days=<value>              [default: 30] Retain tootstats for this number of days back
  -x, --dryRun                    Dry run, no actual changes made

DESCRIPTION
  Clean up old tootstats.

EXAMPLES
  $ analytodon-cli cleanup tootstats
```

## `analytodon-cli cleanup usercredentials`

Clean up user credentials.

```
USAGE
  $ analytodon-cli cleanup usercredentials [-c <value>] [-d <value>] [-x]

FLAGS
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -x, --dryRun                    Dry run, no actual changes made

DESCRIPTION
  Clean up user credentials.

EXAMPLES
  $ analytodon-cli cleanup usercredentials
```

## `analytodon-cli cleanup users`

Clean up users that haven't completed setup.

```
USAGE
  $ analytodon-cli cleanup users [-c <value>] [-d <value>] [-x]

FLAGS
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -x, --dryRun                    Dry run, no actual changes made

DESCRIPTION
  Clean up users that haven't completed setup.

EXAMPLES
  $ analytodon-cli cleanup users
```

## `analytodon-cli fetch accountstats`

Gather account stats for all accounts

```
USAGE
  $ analytodon-cli fetch accountstats [-c <value>] [-d <value>] [-z <value>]

FLAGS
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -z, --timezone=<value>          Process accounts with this timezone

DESCRIPTION
  Gather account stats for all accounts

EXAMPLES
  $ analytodon-cli fetch accountstats
```

## `analytodon-cli fetch initialstats`

Gather initial stats for all accounts (only 1 per call)

```
USAGE
  $ analytodon-cli fetch initialstats -t <value> [-c <value>] [-d <value>] [-a <value>] [-h <value>]

FLAGS
  -a, --account=<value>           Only process specific account
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -h, --host=<value>              [default: app.analytodon.com] App host URL
  -t, --authorization=<value>     (required) Authorization header

DESCRIPTION
  Gather initial stats for all accounts (only 1 per call)

EXAMPLES
  $ analytodon-cli fetch initialstats
```

## `analytodon-cli fetch tootstats`

Gather toot stats for all accounts

```
USAGE
  $ analytodon-cli fetch tootstats [-c <value>] [-d <value>] [-a] [-z <value>] [-m <value>]

FLAGS
  -a, --all                       Fetch all (legacy, always on)
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -m, --account=<value>           Only process this account (disables timezone filter!)
  -z, --timezone=<value>          Process accounts with this timezone

DESCRIPTION
  Gather toot stats for all accounts

EXAMPLES
  $ analytodon-cli fetch tootstats
```

## `analytodon-cli hello PERSON`

Say hello

```
USAGE
  $ analytodon-cli hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/blazer82/analytodon-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `analytodon-cli hello world`

Say hello world

```
USAGE
  $ analytodon-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ analytodon-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

## `analytodon-cli help [COMMAND]`

Display help for analytodon-cli.

```
USAGE
  $ analytodon-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for analytodon-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.19/src/commands/help.ts)_

## `analytodon-cli mail weeklystats`

Send weekly stats email to users

```
USAGE
  $ analytodon-cli mail weeklystats -t <value> [-c <value>] [-d <value>] [-h <value>] [-u <value>] [-z <value>]

FLAGS
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -h, --host=<value>              [default: app.analytodon.com] App host URL
  -t, --authorization=<value>     (required) Authorization header
  -u, --user=<value>              Only process specific user
  -z, --timezone=<value>          Process accounts with this timezone

DESCRIPTION
  Send weekly stats email to users

EXAMPLES
  $ analytodon-cli mail weeklystats
```

## `analytodon-cli plugins`

List installed plugins.

```
USAGE
  $ analytodon-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ analytodon-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.7/src/commands/plugins/index.ts)_

## `analytodon-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ analytodon-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ analytodon-cli plugins add

EXAMPLES
  $ analytodon-cli plugins:install myplugin

  $ analytodon-cli plugins:install https://github.com/someuser/someplugin

  $ analytodon-cli plugins:install someuser/someplugin
```

## `analytodon-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ analytodon-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ analytodon-cli plugins:inspect myplugin
```

## `analytodon-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ analytodon-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ analytodon-cli plugins add

EXAMPLES
  $ analytodon-cli plugins:install myplugin

  $ analytodon-cli plugins:install https://github.com/someuser/someplugin

  $ analytodon-cli plugins:install someuser/someplugin
```

## `analytodon-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ analytodon-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ analytodon-cli plugins:link myplugin
```

## `analytodon-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ analytodon-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ analytodon-cli plugins unlink
  $ analytodon-cli plugins remove
```

## `analytodon-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ analytodon-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ analytodon-cli plugins unlink
  $ analytodon-cli plugins remove
```

## `analytodon-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ analytodon-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ analytodon-cli plugins unlink
  $ analytodon-cli plugins remove
```

## `analytodon-cli plugins update`

Update installed plugins.

```
USAGE
  $ analytodon-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `analytodon-cli tools rebuilddailytootstats`

Aggregate daily toot stats for all accounts

```
USAGE
  $ analytodon-cli tools rebuilddailytootstats [-c <value>] [-d <value>] [-m <value>] [-e <value>] [-a]

FLAGS
  -a, --all                       Rebuild daily toot stats for all accounts
  -c, --connectionString=<value>  [default: mongodb://localhost:27017] MongoDB connection string
  -d, --database=<value>          [default: analytodon] Source database name
  -e, --entry=<value>             Rebuild a specific entry only
  -m, --account=<value>           Rebuild daily toot stats for this account

DESCRIPTION
  Aggregate daily toot stats for all accounts

EXAMPLES
  $ analytodon-cli tools rebuilddailytootstats
```
<!-- commandsstop -->
