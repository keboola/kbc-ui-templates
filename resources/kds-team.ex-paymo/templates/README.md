# Paymo

Component ID: `kds-team.ex-paymo`

Extracts clients, projects, tasks, time entries and users from the [Paymo API](https://github.com/paymo-org/api).

This component is a configuration template for [Generic Extractor](https://github.com/keboola/generic-extractor).
It has no code of its own: the files in this folder define the API connection (`api.json`)
and the predefined configurations (`config/*.json`) that Generic Extractor runs.

## Prerequisites

- A Paymo account and a [Paymo API key](https://github.com/paymo-org/api/blob/master/sections/authentication.md#api-keys).

## Configuration

| Parameter | Required | Description |
|---|---|---|
| API Token (`#username`) | yes | Paymo API key. Sent with HTTP basic authentication as the user name. |
| Start day (`days`) | yes | Download time entries from this day until today, as a relative [strtotime](https://www.php.net/manual/en/function.strtotime.php) value. Default: `-60 days`. |

`Start day` applies only to time entries. All other tables are downloaded in full on every run.

## Templates

| Template | Downloads | Load type |
|---|---|---|
| Basic | Clients, client contacts, projects, tasks, task lists, time entries from `Start day`, users, user tasks. | Incremental (upsert by primary key) |
| Full Entry IDs | Only the IDs of all time entries. Use it in a separate configuration to find entries deleted in Paymo, while the Basic configuration keeps loading incrementally. | Full load |

## Output tables

| Table | API endpoint | Primary key |
|---|---|---|
| `client_contact` | `clientcontacts` | `id` |
| `client` | `clients` | `id` |
| `project` | `projects` | `id` |
| `task` | `tasks` | `id` |
| `tasklist` | `tasklists` | `id` |
| `entry` | `entries` (Basic: filtered by `time_interval`; Full Entry IDs: `id` only) | `id` |
| `user` | `users` | `id` |
| `user_task` | `userstasks?where=user_id={id}` (for each user) | `id` |

## Extending

Switch the configuration to the JSON editor to add endpoints or fields.
See the [Generic Extractor tutorial](https://developers.keboola.com/extend/generic-extractor/tutorial/).

## Files

- `api.json`: base URL, basic authentication with the API key and pagination.
- `config/01-basic.json`: the Basic template.
- `config/02-full_ids.json`: the Full Entry IDs template.
