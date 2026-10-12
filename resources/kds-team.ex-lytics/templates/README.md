# Lytics

Component ID: `kds-team.ex-lytics`

Extracts segments and users from the [Lytics](https://www.lytics.com/) customer data platform
(API `https://api.lytics.io/api/`).

This component is a configuration template for [Generic Extractor](https://github.com/keboola/generic-extractor).
It has no code of its own: the files in this folder define the API connection (`api.json`)
and the predefined configuration (`config/01-basic.json`) that Generic Extractor runs.

## Prerequisites

- A Lytics account and an API token with read access.

## Configuration

| Parameter | Required | Description |
|---|---|---|
| API token (`#token`) | yes | Sent in the `Authorization` header. |
| Incremental mode (`incrementalOutput`) | yes | On: rows are upserted by primary key. Off: tables are overwritten. To remove deleted records from Storage, turn it off. |

## Output tables

| Table | API endpoint | Primary key |
|---|---|---|
| `segment` | `segment` | `id` |
| `users` | `segment/{segment_id}/scan`, only for the segment named `All` | `uid` |
| `segment_movement` | nested `_segs` field of each user | `user_uid`, `segment_id`, `in`, `out` |
| `user_segments` | nested `segments` field of each user | `user_uid`, `segment_slug_name` |

Only the default user fields are downloaded. Users are read from the segment named `All`;
if your account has no such segment, the `users` table stays empty.

## Extending

To download more user fields, switch the configuration to the JSON editor and extend
the `users` mapping. See the
[Generic Extractor tutorial](https://developers.keboola.com/extend/generic-extractor/tutorial/).

## Files

- `api.json`: base URL, `Authorization` header and pagination (`_next` response parameter).
- `config/01-basic.json`: the Basic template.
