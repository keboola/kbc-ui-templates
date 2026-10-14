# dbt Cloud API

Component ID: `kds-team.ex-dbt-cloud-api`

Extracts accounts, projects, jobs, runs and run artifacts from the
[dbt Cloud Administrative API v2](https://docs.getdbt.com/dbt-cloud/api-v2).

This component is a configuration template for [Generic Extractor](https://github.com/keboola/generic-extractor).
It has no code of its own: the files in this folder define the API connection (`api.json`)
and the predefined configuration (`config/01-basic.json`) that Generic Extractor runs.

## Prerequisites

- A dbt Cloud account hosted on `cloud.getdbt.com`. The base URL is fixed to
  `https://cloud.getdbt.com/api/v2/`; accounts in other regions or single-tenant
  instances need a different base URL in the JSON editor.
- A dbt Cloud API token with read access to the account.

## Configuration

| Parameter | Required | Description |
|---|---|---|
| Token (`#token`) | yes | dbt Cloud API token. Sent as `Authorization: Token <token>`. |

The template loads data incrementally: rows are upserted by primary key.

## Output tables

| Table | API endpoint | Primary key |
|---|---|---|
| `accounts` | `accounts` | `id` |
| `projects` | `accounts/{account_id}/projects` | `id`, `account_id` |
| `jobs` | `accounts/{account_id}/jobs` | `id`, `account_id` |
| `runs` | `accounts/{account_id}/runs` | `id`, `account_id` |
| `run_artifacts` | `accounts/{account_id}/runs/{run_id}/artifacts` | `run_id` |

Lists are paged by 100 (`limit` / `offset`). Responses with HTTP 404 are skipped
(for example, a run without artifacts).

## Extending

Switch the configuration to the JSON editor to add endpoints or fields.
See the [Generic Extractor tutorial](https://developers.keboola.com/extend/generic-extractor/tutorial/).

## Files

- `api.json`: base URL, pagination, required `Authorization` header and ignored 404 errors.
- `config/01-basic.json`: the template, including the `Authorization` header.
